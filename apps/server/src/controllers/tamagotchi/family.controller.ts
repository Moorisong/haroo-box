import { Request, Response, NextFunction } from 'express';
import { getTamagotchiModel } from '../../models/tamagotchi.model';
import { getFamilyModel } from '../../models/family.model';
import { checkFamilyTitles } from '../../services/tamagotchi/family.service';

/**
 * POST /api/tamagotchi/family/create
 * 성체(나이 20세 이상, 1주일 = 1살) 다마고치가 최초 결혼 시 가문을 창립
 */
export const createFamily = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const { familyName } = req.body;
    if (!familyName) {
      res.status(400).json({ success: false, error: '가문 이름을 입력해 주세요.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const myTama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });

    if (!myTama) {
      res.status(404).json({ success: false, error: '활동 중인 다마고치가 존재하지 않습니다.' });
      return;
    }

    if (myTama.familyId) {
      res.status(400).json({ success: false, error: '이미 가문에 가입되어 있습니다.' });
      return;
    }

    // 나이 계산 (현실 7일 = 1세)
    const msDiff = Date.now() - myTama.birthDate.getTime();
    const age = Math.floor(msDiff / (7 * 24 * 60 * 60 * 1000));

    if (age < 20) {
      res.status(400).json({ success: false, error: '가문을 창립하려면 다마고치 나이가 20세(현실 시간 20주 경과) 이상이어야 합니다.' });
      return;
    }

    const Family = getFamilyModel();
    const newFamily = new Family({
      founderId: myTama._id,
      name: familyName,
      generation: myTama.generation,
    });

    await newFamily.save();

    myTama.familyId = newFamily._id;
    await myTama.save();

    res.json({
      success: true,
      data: {
        tamagotchi: myTama,
        family: newFamily,
      },
      message: `축하합니다! 대전사 [${familyName}] 가문이 정식 창립되었습니다!`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tamagotchi/family/retire
 * 후계자를 맞이하여 기존 부모 다마고치는 은퇴시키고 신세대로 계승
 */
export const hatchSuccessor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const { childName, childSpecies } = req.body;
    if (!childName || !childSpecies) {
      res.status(400).json({ success: false, error: '후계자 이름과 종족을 선택해야 합니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const parent = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });

    if (!parent) {
      res.status(404).json({ success: false, error: '계승할 현역 부모 다마고치가 존재하지 않습니다.' });
      return;
    }

    if (!parent.familyId) {
      res.status(400).json({ success: false, error: '결혼하여 가문을 먼저 생성해야 후계자를 맞이할 수 있습니다.' });
      return;
    }

    // 이름 중복 검사
    const existsName = await Tamagotchi.findOne({ name: childName });
    if (existsName) {
      res.status(400).json({ success: false, error: '이미 존재하는 이름입니다. 다른 이름을 사용해 주세요.' });
      return;
    }

    // 1. 기존 부모를 현역에서 은퇴 처리
    parent.isRetired = true;
    await parent.save();

    // 2. 가문 정보 갱신 (세대 상승)
    const Family = getFamilyModel();
    const family = await Family.findById(parent.familyId);
    if (family) {
      family.generation = parent.generation + 1;
      checkFamilyTitles(family); // 가문 칭호 해금
      await family.save();
    }

    // 3. 신규 2대 후계자 부화
    const MONSTER_HATS = ['crown', 'ribbon', 'sunglasses', 'helmet', 'cap', 'box', 'pot', 'frog', 'poop', 'plunger'];
    const randomHat = MONSTER_HATS[Math.floor(Math.random() * MONSTER_HATS.length)];

    const child = new Tamagotchi({
      userId: user._id,
      name: childName,
      species: childSpecies,
      colorPalette: Math.floor(Math.random() * 5),
      hat: randomHat,
      generation: parent.generation + 1,
      familyId: parent.familyId,
    });

    await child.save();

    res.json({
      success: true,
      data: {
        parent,
        child,
      },
      message: `대를 이어 가문을 빛낼 후계자 [${childName}]가 성공적으로 계승 탄생했습니다!`,
    });
  } catch (error) {
    next(error);
  }
};
