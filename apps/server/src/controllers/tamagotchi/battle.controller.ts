import { Request, Response, NextFunction } from 'express';
import { getTamagotchiModel } from '../../models/tamagotchi.model';
import { getBattleMatchModel } from '../../models/battle-match.model';
import { processOfflineStats } from '../../services/tamagotchi/offline.service';
import { generateBattleLogs } from '../../services/tamagotchi/battle-log.service';
import * as battleRuleService from '../../services/tamagotchi/battle-rule.service';

/**
 * POST /api/tamagotchi/battle/request
 * 비동기 대결 신청
 */
export const requestBattle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const { receiverId, skillIndex } = req.body;
    const reqSkill = Number(skillIndex);
    if (!receiverId || isNaN(reqSkill) || reqSkill < 1 || reqSkill > 6) {
      res.status(400).json({ success: false, error: '상대방 ID와 1~6 범위의 스킬 인덱스가 필요합니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const myTama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });
    const oppTama = await Tamagotchi.findById(receiverId);

    if (!myTama || !oppTama || oppTama.isDead || oppTama.isRetired) {
      res.status(404).json({ success: false, error: '신청자 혹은 상대 다마고치 정보가 유효하지 않습니다.' });
      return;
    }

    // 오늘 하루 총 전투 5회 제한 체크
    const BattleMatch = getBattleMatchModel();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayMatchCount = await BattleMatch.countDocuments({
      $or: [
        { requesterId: myTama._id },
        { receiverId: myTama._id },
      ],
      createdAt: { $gte: startOfToday },
    });

    if (todayMatchCount >= 5) {
      res.status(400).json({ success: false, error: '하루에 최대 5회까지만 전투에 참가할 수 있습니다.' });
      return;
    }

    const newMatch = new BattleMatch({
      requesterId: myTama._id,
      receiverId: oppTama._id,
      requesterSkill: reqSkill,
      status: 'pending',
    });

    await newMatch.save();

    res.json({
      success: true,
      data: newMatch,
      message: `${oppTama.name}에게 대결을 신청했습니다! 24시간 내 수락 대기 상태입니다.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tamagotchi/battle/accept
 * 비동기 대결 수락 및 즉시 전투 시뮬레이션
 */
export const acceptBattle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const { matchId, skillIndex } = req.body;
    const recSkill = Number(skillIndex);
    if (!matchId || isNaN(recSkill) || recSkill < 1 || recSkill > 6) {
      res.status(400).json({ success: false, error: '신청 정보 및 1~6 범위의 스킬 인덱스가 필요합니다.' });
      return;
    }

    const BattleMatch = getBattleMatchModel();
    const match = await BattleMatch.findById(matchId);
    if (!match || match.status !== 'pending') {
      res.status(404).json({ success: false, error: '대결 신청 정보를 찾을 수 없거나 이미 유효하지 않습니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const myTama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });
    if (!myTama || myTama._id.toString() !== match.receiverId.toString()) {
      res.status(403).json({ success: false, error: '본인에게 신청된 대결만 수락할 수 있습니다.' });
      return;
    }

    const oppTama = await Tamagotchi.findById(match.requesterId);
    if (!oppTama || oppTama.isDead || oppTama.isRetired) {
      res.status(404).json({ success: false, error: '대결을 신청한 상대방 다마고치 정보가 올바르지 않습니다.' });
      return;
    }

    // 1. 방치 보정
    processOfflineStats(myTama);
    processOfflineStats(oppTama);

    // 2. 버프 룰링
    const reqBuff = battleRuleService.rollSkillBuff();
    const recBuff = battleRuleService.rollSkillBuff();

    let reqPower = battleRuleService.calculateBattlePower(oppTama) + reqBuff.bonus;
    let recPower = battleRuleService.calculateBattlePower(myTama) + recBuff.bonus;

    const skillReqName = battleRuleService.SKILLS_LIST[match.requesterSkill - 1];
    const skillRecName = battleRuleService.SKILLS_LIST[recSkill - 1];

    // 10분용 병맛로그 미리 빌드
    const basicLogs = generateBattleLogs(oppTama.name, myTama.name, skillReqName, skillRecName);
    if (reqBuff.activated) basicLogs.splice(2, 0, `[📢 버프] ${oppTama.name}(이)가 [${skillReqName}] 스킬로 용기가 10 증가합니다!`);
    if (recBuff.activated) basicLogs.splice(3, 0, `[📢 버프] ${myTama.name}(이)가 [${skillRecName}] 스킬로 용기가 10 증가합니다!`);

    // 3. 도망 여부 검사 (수락자가 신청자로부터 도망 또는 신청자가 수락자로부터 도망)
    let runAwayOccurred = false;
    let runAwaySuccess: boolean | null = null;
    let winnerId = null;

    if (battleRuleService.checkEscapeTrigger(recPower, reqPower, myTama.stats.courage)) {
      // 수락자(나)가 도망
      runAwayOccurred = true;
      runAwaySuccess = Math.random() < 0.5;
      if (runAwaySuccess) {
        winnerId = oppTama._id;
        myTama.escapeCount += 1;
        oppTama.stats.courage = Math.min(100, oppTama.stats.courage + 30);
        myTama.stats.courage = Math.max(0, myTama.stats.courage - 30);
        myTama.stats.happiness = Math.max(0, myTama.stats.happiness - 20);
        basicLogs.push(`🏃💨 비굴하게 도망가기 발동! ${myTama.name}가 식겁하고 꽁무니를 뺐습니다! (도망 성공)`);
      } else {
        basicLogs.push(`🏃💨 비굴하게 도망가려던 ${myTama.name}의 뒷덜미가 잡혔습니다! 도망 실패하여 전투 돌입!`);
      }
    }

    // 도망이 일어나지 않았거나 도망 실패했을 경우 전투 진행
    if (!runAwayOccurred || runAwaySuccess === false) {
      const { winner } = battleRuleService.determineWinner(reqPower, recPower);
      if (winner === 'A') {
        winnerId = oppTama._id;
        battleRuleService.applyBattleResults(oppTama, myTama);
        basicLogs.push(`🎉 치열한 격전 끝에 ${oppTama.name}의 불주먹이 작렬하며 승리했습니다!`);
      } else {
        winnerId = myTama._id;
        battleRuleService.applyBattleResults(myTama, oppTama);
        basicLogs.push(`🎉 치열한 격전 끝에 ${myTama.name}의 곡괭이가 급소를 명중하며 승리했습니다!`);
      }
    }

    match.receiverSkill = recSkill;
    match.status = 'accepted'; // 연출용 10분간 accepted 로 유지
    match.battleLogs = basicLogs;
    match.winnerId = winnerId;
    match.runAwayOccurred = runAwayOccurred;
    match.runAwaySuccess = runAwaySuccess;
    match.resolvedAt = new Date();

    await Promise.all([myTama.save(), oppTama.save(), match.save()]);

    res.json({
      success: true,
      data: match,
      message: '대결 신청을 수락했습니다! 전투가 성립되어 10분 동안 치열하게 격돌합니다!',
    });
  } catch (error) {
    next(error);
  }
};
