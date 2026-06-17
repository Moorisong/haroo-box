import { Request, Response, NextFunction } from 'express';
import { getTamagotchiModel } from '../../models/tamagotchi.model';
import { getFamilyModel } from '../../models/family.model';

const MONSTER_HATS = [
  'crown',
  'ribbon',
  'sunglasses',
  'helmet',
  'cap',
  'box',
  'pot',
  'frog',
  'poop',
  'plunger',
];

/**
 * POST /api/tamagotchi/hatch
 * 알 부화하기 (종족, 이름 설정)
 */
export const hatchTamagotchi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const { name, species } = req.body;
    if (!name || !species) {
      res.status(400).json({ success: false, error: '이름과 종족을 선택해야 합니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();

    // 1. 이름 중복 검사
    const existsName = await Tamagotchi.findOne({ name });
    if (existsName) {
      res.status(400).json({ success: false, error: '이미 존재하는 이름입니다. 다른 이름을 사용해 주세요.' });
      return;
    }

    // 2. 이미 활성화된 다마고치가 있는지 검사
    const activeTama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });
    if (activeTama) {
      res.status(400).json({ success: false, error: '이미 돌보고 있는 다마고치가 존재합니다.' });
      return;
    }

    // 3. 계승할 은퇴한 부모가 있는지 검사 (가문 연결용)
    const lastRetired = await Tamagotchi.findOne({ userId: user._id, isRetired: true }).sort({ updatedAt: -1 });
    
    let familyId = null;
    let generation = 1;

    if (lastRetired) {
      familyId = lastRetired.familyId;
      generation = lastRetired.generation + 1;

      // 만약 가문 레벨이 올라갔다면 가문 세대도 최신으로 동기화
      if (familyId) {
        const Family = getFamilyModel();
        const family = await Family.findById(familyId);
        if (family && family.generation < generation) {
          family.generation = generation;
          await family.save();
        }
      }
    }

    // 무작위 모자 장착 (평생 고정)
    const randomHat = MONSTER_HATS[Math.floor(Math.random() * MONSTER_HATS.length)];
    // 무작위 색상 팔레트 (0 ~ 4)
    const randomPalette = Math.floor(Math.random() * 5);

    const newTama = new Tamagotchi({
      userId: user._id,
      name,
      species,
      colorPalette: randomPalette,
      hat: randomHat,
      stats: {
        happiness: 50,
        hunger: 50,
        cleanliness: 100,
        courage: 10,
      },
      generation,
      familyId,
    });

    await newTama.save();

    res.json({
      success: true,
      data: newTama,
      message: '다마고치가 성공적으로 부화했습니다!',
    });
  } catch (error) {
    next(error);
  }
};
