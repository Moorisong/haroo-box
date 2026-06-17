import { Request, Response, NextFunction } from 'express';
import { getTamagotchiModel } from '../../models/tamagotchi.model';
import { processOfflineStats } from '../../services/tamagotchi/offline.service';
import * as minigameService from '../../services/tamagotchi/minigame.service';

/**
 * POST /api/tamagotchi/walk
 * 산책 실행 (꽃 획득 확률 테이블)
 */
export const walkTamagotchi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const tama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });

    if (!tama) {
      res.status(404).json({ success: false, error: '활동 중인 다마고치가 존재하지 않습니다.' });
      return;
    }

    processOfflineStats(tama);

    const result = minigameService.executeWalk(tama);
    await tama.save();

    res.json({
      success: true,
      data: {
        tamagotchi: tama,
        walkType: result.type,
        flower: result.flower,
      },
      message: result.msg,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tamagotchi/bath/try
 * 목욕 시도 (거부 및 비누던지기 미니게임 트리거 여부 반환)
 */
export const tryBathTamagotchi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const tama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });

    if (!tama) {
      res.status(404).json({ success: false, error: '다마고치가 없습니다.' });
      return;
    }

    processOfflineStats(tama);

    // 1. 목욕 거부 탈출 조건 검사
    const checkVal = minigameService.checkBathTrigger(tama);
    if (checkVal.triggerMinigame) {
      await tama.save();
      res.json({
        success: true,
        data: {
          triggerMinigame: true,
          tamagotchi: tama,
        },
        message: '다마고치가 목욕탕 밖으로 도망치려 펄쩍펄쩍 뛰어다닙니다! 비누 거품을 던져 붙잡으세요!',
      });
      return;
    }

    // 2. 그냥 정상 목욕 통과
    const result = minigameService.executeNormalBath(tama);
    await tama.save();

    res.json({
      success: true,
      data: {
        triggerMinigame: false,
        tamagotchi: tama,
      },
      message: result.msg,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tamagotchi/bath/resolve
 * 목욕 탈출 미니게임 결과 반영
 */
export const resolveBath = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const { success } = req.body;
    const Tamagotchi = getTamagotchiModel();
    const tama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });

    if (!tama) {
      res.status(404).json({ success: false, error: '다마고치가 없습니다.' });
      return;
    }

    processOfflineStats(tama);

    const result = minigameService.resolveBathMinigame(tama, !!success);
    await tama.save();

    res.json({
      success: true,
      data: tama,
      message: result.msg,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tamagotchi/runner/resolve
 * 장애물 달리기 게임 기록 등록 및 보상 반영
 */
export const resolveRunner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const { seconds } = req.body;
    const Tamagotchi = getTamagotchiModel();
    const tama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });

    if (!tama) {
      res.status(404).json({ success: false, error: '다마고치가 없습니다.' });
      return;
    }

    processOfflineStats(tama);

    const result = minigameService.resolveRunnerGame(tama, Number(seconds) || 0);
    await tama.save();

    res.json({
      success: true,
      data: tama,
      message: result.msg,
    });
  } catch (error) {
    next(error);
  }
};
