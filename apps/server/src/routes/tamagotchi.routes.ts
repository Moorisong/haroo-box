import { Router } from 'express';
import { puzzleAuth } from '../middlewares/puzzle-auth';
import { getMyTamagotchi } from '../controllers/tamagotchi/core.controller';
import { hatchTamagotchi } from '../controllers/tamagotchi/hatch.controller';
import { interactWithTamagotchi, removeDecoration } from '../controllers/tamagotchi/interaction.controller';
import { walkTamagotchi, tryBathTamagotchi, resolveBath, resolveRunner } from '../controllers/tamagotchi/minigame.controller';
import { requestBattle, acceptBattle } from '../controllers/tamagotchi/battle.controller';
import { getPlazaList, searchTamagotchi, createShout, getShouts, likeShout, addComment } from '../controllers/tamagotchi/plaza.controller';
import { getTamagotchiRankings } from '../controllers/tamagotchi/rank.controller';
import {
  getGraveTamas,
  getRetiredHistory,
  updateRepresentativeTitle,
  getMyNotifications,
  getFamilyInfo,
} from '../controllers/tamagotchi/history.controller';

const router = Router();

// 1. 코어 다마고치 정보 조회 & 탄생
router.get('/me', puzzleAuth, getMyTamagotchi);
router.post('/hatch', puzzleAuth, hatchTamagotchi);

// 2. 상호작용 & 장식 탈착
router.post('/interact', puzzleAuth, interactWithTamagotchi);
router.post('/undecorate', puzzleAuth, removeDecoration);

// 3. 미니게임 & 산책
router.post('/walk', puzzleAuth, walkTamagotchi);
router.post('/bath/try', puzzleAuth, tryBathTamagotchi);
router.post('/bath/resolve', puzzleAuth, resolveBath);
router.post('/runner/resolve', puzzleAuth, resolveRunner);

// 4. 전투 매칭 (PvP)
router.post('/battle/request', puzzleAuth, requestBattle);
router.post('/battle/accept', puzzleAuth, acceptBattle);

// 5. 광장 & 소셜
router.get('/plaza/list', getPlazaList);
router.get('/plaza/search', searchTamagotchi);
router.get('/plaza/shouts', getShouts);
router.post('/plaza/shout', puzzleAuth, createShout);
router.post('/plaza/shout/like', puzzleAuth, likeShout);
router.post('/plaza/shout/comment', puzzleAuth, addComment);

// 6. 랭킹
router.get('/rank', getTamagotchiRankings);

// 7. 가문 묘지 & 히스토리 & 칭호
router.get('/family/info', puzzleAuth, getFamilyInfo);
router.get('/family/grave', puzzleAuth, getGraveTamas);
router.get('/family/history', puzzleAuth, getRetiredHistory);
router.post('/title/representative', puzzleAuth, updateRepresentativeTitle);
router.get('/notifications/list', puzzleAuth, getMyNotifications);

export default router;
