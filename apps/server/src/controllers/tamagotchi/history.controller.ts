import { Request, Response, NextFunction } from 'express';
import { getTamagotchiModel } from '../../models/tamagotchi.model';
import { getFamilyModel } from '../../models/family.model';
import { getBattleMatchModel } from '../../models/battle-match.model';

/**
 * GET /api/tamagotchi/family/grave
 * 가문 내 사망한 조상 다마고치(isDead = true) 목록 조회
 */
export const getGraveTamas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    // 로그인한 유저의 사망한 전체 다마고치 조회
    const graves = await Tamagotchi.find({ userId: user._id, isDead: true }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: graves,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tamagotchi/family/history
 * 은퇴 조상들(isRetired = true)의 생존/은퇴 세대 히스토리 조회
 */
export const getRetiredHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const history = await Tamagotchi.find({ userId: user._id, isRetired: true }).sort({ generation: 1 });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tamagotchi/title/representative
 * 대표 개체 칭호 변경
 */
export const updateRepresentativeTitle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const { title } = req.body;
    const Tamagotchi = getTamagotchiModel();
    const tama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });

    if (!tama) {
      res.status(404).json({ success: false, error: '활동 중인 다마고치가 존재하지 않습니다.' });
      return;
    }

    if (!title || !tama.unlockedTitles.includes(title)) {
      res.status(400).json({ success: false, error: '해금되지 않았거나 올바르지 않은 칭호입니다.' });
      return;
    }

    tama.representativeTitle = title;
    await tama.save();

    res.json({
      success: true,
      data: tama,
      message: `대표 칭호가 [${title}]로 변경되었습니다!`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tamagotchi/notifications/list
 * 내 다마고치에게 들어온 대결 신청 등 알림함 조회
 */
export const getMyNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const myTama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });
    if (!myTama) {
      res.json({ success: true, data: [] });
      return;
    }

    const BattleMatch = getBattleMatchModel();
    // 상대가 나에게 보냈거나 내가 상대에게 보낸 pending 배틀 정보
    const list = await BattleMatch.find({
      $or: [
        { receiverId: myTama._id },
        { requesterId: myTama._id },
      ],
    }).populate({
      path: 'requesterId receiverId',
      select: 'name species hat representativeTitle unlockedTitles',
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};
export const getFamilyInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }
    const Tamagotchi = getTamagotchiModel();
    const activeTama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });
    let familyId = activeTama?.familyId;

    if (!familyId) {
      const lastRetired = await Tamagotchi.findOne({ userId: user._id, isRetired: true }).sort({ updatedAt: -1 });
      if (lastRetired) familyId = lastRetired.familyId;
    }

    if (!familyId) {
      res.json({ success: true, data: null });
      return;
    }

    const Family = getFamilyModel();
    const family = await Family.findById(familyId);
    res.json({ success: true, data: family });
  } catch (error) {
    next(error);
  }
};
