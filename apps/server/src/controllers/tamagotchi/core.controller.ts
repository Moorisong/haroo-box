import { Request, Response, NextFunction } from 'express';
import { getTamagotchiModel } from '../../models/tamagotchi.model';
import { getFamilyModel } from '../../models/family.model';
import { processOfflineStats } from '../../services/tamagotchi/offline.service';

/**
 * GET /api/tamagotchi/me
 * 내 다마고치 정보 가져오기 (오프라인 수치 보정 적용)
 */
export const getMyTamagotchi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const myTama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });

    if (!myTama) {
      // 다마고치가 부화되지 않은 상태
      res.json({ success: true, data: null, message: '알을 부화시켜 주세요.' });
      return;
    }

    // 오프라인 방치 스탯 차감 계산 진행
    const updated = processOfflineStats(myTama);
    if (updated) {
      await myTama.save();
    }

    // 가문 정보가 있다면 함께 로드
    let family = null;
    if (myTama.familyId) {
      const Family = getFamilyModel();
      family = await Family.findById(myTama.familyId);
    }

    res.json({
      success: true,
      data: {
        tamagotchi: myTama,
        family,
      },
    });
  } catch (error) {
    next(error);
  }
};
