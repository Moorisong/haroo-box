import { Request, Response, NextFunction } from 'express';
import { getTamagotchiModel } from '../../models/tamagotchi.model';
import { getPlazaShoutModel } from '../../models/plaza-shout.model';

/**
 * GET /api/tamagotchi/plaza/list
 * 광장에 보여줄 10마리 목록 조회 (1순위: 현재 로그인 활성 유저 5인, 2순위: 최근 7일 이내 로그인 유저 5인)
 */
export const getPlazaList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    const Tamagotchi = getTamagotchiModel();

    // 1. 전체 활동중인 현역 다마고치 쿼리 (본인 제외)
    const filter: any = { isRetired: false, isDead: false };
    if (user) {
      filter.userId = { $ne: user._id };
    }

    // 간단한 정렬: 최근 7일 기준 분기
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // 1순위: 최근 활성화된 다마고치 무작위 추출
    const recentTamas = await Tamagotchi.aggregate([
      { $match: { ...filter, updatedAt: { $gte: weekAgo } } },
      { $sample: { size: 10 } },
    ]);

    let list = [...recentTamas];

    // 부족하면 전체에서 무작위 보충
    if (list.length < 10) {
      const needed = 10 - list.length;
      const idsToExclude = list.map((t) => t._id);
      const backupTamas = await Tamagotchi.aggregate([
        { $match: { ...filter, _id: { $nin: idsToExclude } } },
        { $sample: { size: needed } },
      ]);
      list = [...list, ...backupTamas];
    }

    res.json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tamagotchi/plaza/search
 * 정확히 이름 매칭(Exact Match)하는 다마고치만 검색 허용
 */
export const searchTamagotchi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.query;
    if (!name) {
      res.status(400).json({ success: false, error: '검색할 이름을 입력해 주세요.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const tama = await Tamagotchi.findOne({ name: String(name), isRetired: false, isDead: false });

    if (!tama) {
      res.status(404).json({ success: false, error: '해당 이름의 다마고치를 찾을 수 없습니다.' });
      return;
    }

    res.json({
      success: true,
      data: tama,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tamagotchi/plaza/shout
 * 오늘의 한마디 외치기 작성 (1일 1회 제한)
 */
export const createShout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const { content } = req.body;
    if (!content || content.length > 100) {
      res.status(400).json({ success: false, error: '내용은 100자 이하로 작성해야 합니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const myTama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });

    if (!myTama) {
      res.status(404).json({ success: false, error: '현역 다마고치가 존재하지 않습니다.' });
      return;
    }

    const PlazaShout = getPlazaShoutModel();

    // 오늘 이미 작성했는지 체크
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const exists = await PlazaShout.findOne({
      tamagotchiId: myTama._id,
      createdAt: { $gte: startOfToday },
    });

    if (exists) {
      res.status(400).json({ success: false, error: '외치기는 다마고치당 하루에 단 한 번만 작성 가능합니다.' });
      return;
    }

    // 오늘 밤 자정(KST 00:00:00) 만료시킬 Date 설정 (서버 로컬 기준 자정 계산)
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const newShout = new PlazaShout({
      tamagotchiId: myTama._id,
      content,
      expireAt: midnight,
    });

    await newShout.save();

    res.json({
      success: true,
      data: newShout,
      message: '오늘의 한줄 외치기가 성공적으로 게시판에 퍼졌습니다!',
    });
  } catch (error) {
    next(error);
  }
};
export const getShouts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const PlazaShout = getPlazaShoutModel();
    const shouts = await PlazaShout.find().populate({
      path: 'tamagotchiId',
      select: 'name species hat flower unlockedTitles representativeTitle',
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: shouts });
  } catch (error) {
    next(error);
  }
};
export const likeShout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }
    const { shoutId } = req.body;
    const PlazaShout = getPlazaShoutModel();
    const shout = await PlazaShout.findById(shoutId);
    if (!shout) {
      res.status(404).json({ success: false, error: '외치기를 찾을 수 없습니다.' });
      return;
    }
    const uId = user._id.toString();
    if (shout.likes.includes(uId)) {
      shout.likes = shout.likes.filter((id: string) => id !== uId);
    } else {
      shout.likes.push(uId);
    }
    await shout.save();
    res.json({ success: true, data: shout });
  } catch (error) {
    next(error);
  }
};
export const addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }
    const { shoutId, content } = req.body;
    if (!content) {
      res.status(400).json({ success: false, error: '댓글 내용이 필요합니다.' });
      return;
    }
    const PlazaShout = getPlazaShoutModel();
    const shout = await PlazaShout.findById(shoutId);
    if (!shout) {
      res.status(404).json({ success: false, error: '외치기를 찾을 수 없습니다.' });
      return;
    }
    shout.comments.push({
      userId: user._id.toString(),
      nickname: user.nickname || '익명',
      content,
      createdAt: new Date(),
    });
    await shout.save();
    res.json({ success: true, data: shout });
  } catch (error) {
    next(error);
  }
};
