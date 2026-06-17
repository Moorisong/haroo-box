import { Request, Response, NextFunction } from 'express';
import { getTamagotchiModel } from '../../models/tamagotchi.model';
import { processOfflineStats } from '../../services/tamagotchi/offline.service';
import * as interactionService from '../../services/tamagotchi/interaction.service';

/**
 * POST /api/tamagotchi/interact
 * 바디로 전달된 { action: 'stroke' | 'clap' | 'read' | 'feed' } 형식에 맞춰 일상 행동 처리
 */
export const interactWithTamagotchi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: '인증이 필요합니다.' });
      return;
    }

    const { action } = req.body;
    if (!['stroke', 'clap', 'read', 'feed'].includes(action)) {
      res.status(400).json({ success: false, error: '잘못된 상호작용 액션입니다.' });
      return;
    }

    const Tamagotchi = getTamagotchiModel();
    const tama = await Tamagotchi.findOne({ userId: user._id, isRetired: false, isDead: false });

    if (!tama) {
      res.status(404).json({ success: false, error: '활동 중인 다마고치가 존재하지 않습니다.' });
      return;
    }

    // 1. 방치 수치 차감 및 위급 상태 판정 보정 선적용
    processOfflineStats(tama);

    let resultMsg = '';

    // 2. 비즈니스 로직 연동
    if (action === 'stroke') {
      const resVal = interactionService.executeStroke(tama);
      resultMsg = resVal.msg;
    } else if (action === 'clap') {
      const resVal = interactionService.executeClap(tama);
      resultMsg = resVal.msg;
    } else if (action === 'read') {
      const resVal = interactionService.executeRead(tama);
      resultMsg = resVal.msg;
    } else if (action === 'feed') {
      const resVal = interactionService.executeFeed(tama);
      resultMsg = resVal.msg;
    }

    await tama.save();

    res.json({
      success: true,
      data: tama,
      message: resultMsg,
    });
  } catch (error) {
    next(error);
  }
};
export const removeDecoration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    tama.flower = null;
    await tama.save();
    res.json({ success: true, data: tama, message: '장식을 해제했습니다.' });
  } catch (error) {
    next(error);
  }
};
