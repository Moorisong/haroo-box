import { Request, Response, NextFunction } from 'express';
import { getTamagotchiModel } from '../../models/tamagotchi.model';

interface RankItem {
  id: string;
  name: string;
  species: string;
  hat: string;
  flower: string | null;
  representativeTitle: string | null;
  value: number;
  rank: number;
}

/**
 * GET /api/tamagotchi/rank
 * 쿼리 파라미터 ?type=battleWins | escapeCount | courageGaugeCount | titles
 * 공동 순위 처리를 프론트 및 백엔드에서 공동 계산
 */
export const getTamagotchiRankings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type } = req.query;
    const sortType = String(type || 'battleWins');

    if (!['battleWins', 'escapeCount', 'courageGaugeCount', 'titles'].includes(sortType)) {
      res.status(400).json({ success: false, error: '올바르지 않은 랭킹 정렬 타입입니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();

    // 랭킹에는 은퇴 및 사망 상관없이 전체 등록
    const allTamas = await Tamagotchi.find();

    // 임시 포맷팅 및 정렬용 데이터 가공
    const formatted: RankItem[] = allTamas.map((t) => {
      let value = 0;
      if (sortType === 'battleWins') {
        value = t.battleWins || 0;
      } else if (sortType === 'escapeCount') {
        value = t.escapeCount || 0;
      } else if (sortType === 'courageGaugeCount') {
        value = t.courageGaugeCount || 0;
      } else if (sortType === 'titles') {
        value = t.unlockedTitles ? t.unlockedTitles.length : 0;
      }

      return {
        id: t._id.toString(),
        name: t.name,
        species: t.species,
        hat: t.hat,
        flower: t.flower,
        representativeTitle: t.representativeTitle,
        value,
        rank: 1, // 초기화
      };
    });

    // 정렬 (내림차순)
    formatted.sort((a, b) => b.value - a.value);

    // 공동 순위 연산
    let currentRank = 1;
    let prevValue = -1;
    let itemsAtCurrentRank = 0;

    for (let i = 0; i < formatted.length; i++) {
      if (i === 0) {
        formatted[i].rank = 1;
        prevValue = formatted[i].value;
        itemsAtCurrentRank = 1;
      } else {
        if (formatted[i].value === prevValue) {
          formatted[i].rank = currentRank;
          itemsAtCurrentRank++;
        } else {
          currentRank += itemsAtCurrentRank;
          formatted[i].rank = currentRank;
          prevValue = formatted[i].value;
          itemsAtCurrentRank = 1;
        }
      }
    }

    // Top 50까지만 리턴
    const top50 = formatted.slice(0, 50);

    res.json({
      success: true,
      data: top50,
    });
  } catch (error) {
    next(error);
  }
};
