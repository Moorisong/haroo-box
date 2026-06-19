import { Request, Response } from 'express';
import { generateProofToken, verifyProofToken } from '../services/htsm/proof-token.service';
import { HTSM_KEYWORD_WHITELIST, HTSM_CONFIG, HTSM_ERRORS } from '../services/htsm/constants';
import * as htsmService from '../services/htsm/htsm.service';

/**
 * GET /api/htsm/proof-token
 * Proof Token 발급
 */
export async function getProofToken(req: Request, res: Response): Promise<void> {
    const token = generateProofToken();
    res.json({ success: true, data: { proofToken: token } });
}

/**
 * POST /api/htsm/tests
 * 테스트 생성
 */
export async function createTest(req: Request, res: Response): Promise<void> {
    try {
        const { selfKeywords, proofToken, fingerprintHash, userId, name } = req.body;

        if (!proofToken || typeof proofToken !== 'string') {
            res.status(403).json({ success: false, error: HTSM_ERRORS.INVALID_PROOF_TOKEN });
            return;
        }
        if (!verifyProofToken(proofToken)) {
            res.status(403).json({ success: false, error: HTSM_ERRORS.INVALID_PROOF_TOKEN });
            return;
        }

        if (
            !Array.isArray(selfKeywords) ||
            selfKeywords.length < HTSM_CONFIG.MIN_KEYWORD_COUNT ||
            selfKeywords.length > HTSM_CONFIG.MAX_KEYWORD_COUNT
        ) {
            res.status(400).json({ success: false, error: HTSM_ERRORS.INVALID_KEYWORD_COUNT });
            return;
        }
        const allValid = selfKeywords.every(
            (kw: unknown) =>
                typeof kw === 'string' &&
                (HTSM_KEYWORD_WHITELIST as readonly string[]).includes(kw)
        );
        if (!allValid) {
            res.status(400).json({ success: false, error: HTSM_ERRORS.INVALID_KEYWORDS });
            return;
        }
        if (!userId || typeof userId !== 'string') {
            res.status(400).json({ success: false, error: '로그인이 필요합니다.' });
            return;
        }

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            res.status(400).json({ success: false, error: '이름을 입력해주세요.' });
            return;
        }
        if (name.length > 20) {
            res.status(400).json({ success: false, error: '이름은 20자 이내로 입력해주세요.' });
            return;
        }

        const isLimitReached = await htsmService.checkDailyTestLimit(userId);
        if (isLimitReached) {
            res.status(429).json({ success: false, error: '하루에 생성할 수 있는 테스트 개수(5개)를 초과했습니다.' });
            return;
        }

        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.get('User-Agent') || 'unknown';

        const shareId = await htsmService.createNewTest(
            selfKeywords,
            userId,
            name.trim(),
            fingerprintHash,
            ip,
            userAgent
        );

        console.log(`[HTSM] Test created: ${shareId} (fingerprint: ${fingerprintHash})`);
        res.status(201).json({ success: true, data: { shareId } });
    } catch (error) {
        console.error('[HTSM] Create test error:', error);
        res.status(500).json({ success: false, error: HTSM_ERRORS.INTERNAL_ERROR });
    }
}

/**
 * GET /api/htsm/my-test/:userId
 * 내 최근 테스트 조회
 */
export async function getMyTest(req: Request, res: Response): Promise<void> {
    try {
        const { userId } = req.params;

        if (!userId || typeof userId !== 'string') {
            res.status(400).json({ success: false, error: '유저 ID가 필요합니다.' });
            return;
        }

        const shareId = await htsmService.getLatestTestByUserId(userId);
        res.json({ success: true, data: { shareId } });
    } catch (error) {
        console.error('[HTSM] Get my test error:', error);
        res.status(500).json({ success: false, error: HTSM_ERRORS.INTERNAL_ERROR });
    }
}

/**
 * POST /api/htsm/answers
 * 친구 응답 제출
 */
export async function submitAnswer(req: Request, res: Response): Promise<void> {
    try {
        const { shareId, keywords, fingerprintHash, userId } = req.body;

        if (!shareId || typeof shareId !== 'string' || !htsmService.SHARE_ID_REGEX.test(shareId)) {
            res.status(400).json({ success: false, error: HTSM_ERRORS.INVALID_SHARE_ID });
            return;
        }

        if (
            !Array.isArray(keywords) ||
            keywords.length < HTSM_CONFIG.MIN_KEYWORD_COUNT ||
            keywords.length > HTSM_CONFIG.MAX_KEYWORD_COUNT
        ) {
            res.status(400).json({ success: false, error: HTSM_ERRORS.INVALID_KEYWORD_COUNT });
            return;
        }
        const allValid = keywords.every(
            (kw: unknown) =>
                typeof kw === 'string' &&
                (HTSM_KEYWORD_WHITELIST as readonly string[]).includes(kw)
        );
        if (!allValid) {
            res.status(400).json({ success: false, error: HTSM_ERRORS.INVALID_KEYWORDS });
            return;
        }

        if (
            !fingerprintHash ||
            typeof fingerprintHash !== 'string' ||
            fingerprintHash.length > HTSM_CONFIG.MAX_FINGERPRINT_HASH_LENGTH
        ) {
            res.status(400).json({ success: false, error: HTSM_ERRORS.INVALID_FINGERPRINT });
            return;
        }

        const test = await htsmService.getTestByShareId(shareId);
        if (!test) {
            res.status(404).json({ success: false, error: HTSM_ERRORS.TEST_NOT_FOUND });
            return;
        }
        if (test.isClosed) {
            res.status(403).json({ success: false, error: HTSM_ERRORS.TEST_CLOSED });
            return;
        }

        const isCreator = (userId && test.userId === userId) || (fingerprintHash && test.creatorFingerprint === fingerprintHash);
        if (isCreator) {
            res.status(403).json({ success: false, error: '본인의 테스트에는 답변을 남길 수 없습니다.' });
            return;
        }

        const existingAnswer = await htsmService.checkExistingAnswer(test._id, fingerprintHash);
        if (existingAnswer) {
            res.status(409).json({ success: false, error: '이미 참여하셨습니다 😊 친구 결과를 확인해 보세요!' });
            return;
        }

        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.get('User-Agent') || 'unknown';

        try {
            const isClosed = await htsmService.createNewAnswer(
                test._id,
                keywords,
                fingerprintHash,
                ip,
                userAgent,
                test.answerCount
            );

            console.log(`[HTSM] Answer submitted for test ${shareId}`);
            res.json({
                success: true,
                data: { isClosed },
            });
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
                res.status(409).json({ success: false, error: HTSM_ERRORS.DUPLICATE_ANSWER });
                return;
            }
            throw err;
        }
    } catch (error) {
        console.error('[HTSM] Submit answer error:', error);
        res.status(500).json({ success: false, error: HTSM_ERRORS.INTERNAL_ERROR });
    }
}

/**
 * GET /api/htsm/result/:shareId
 * 결과 조회
 */
export async function getResult(req: Request, res: Response): Promise<void> {
    try {
        const shareId = req.params.shareId as string;

        if (!shareId || !htsmService.SHARE_ID_REGEX.test(shareId)) {
            res.status(400).json({ success: false, error: HTSM_ERRORS.INVALID_SHARE_ID });
            return;
        }

        const data = await htsmService.getResultData(shareId);
        if (!data) {
            res.status(404).json({ success: false, error: HTSM_ERRORS.TEST_NOT_FOUND });
            return;
        }

        console.log(`[HTSM] Result viewed for test ${shareId}`);
        res.json({ success: true, data });
    } catch (error) {
        console.error('[HTSM] Get result error:', error);
        res.status(500).json({ success: false, error: HTSM_ERRORS.INTERNAL_ERROR });
    }
}

/**
 * GET /api/htsm/tests/:shareId
 * 테스트 정보 조회
 */
export async function getTestInfo(req: Request, res: Response): Promise<void> {
    try {
        const shareId = req.params.shareId as string;
        const userId = req.query.userId as string | undefined;
        const fingerprintHash = req.query.fp as string | undefined;

        if (!shareId || !htsmService.SHARE_ID_REGEX.test(shareId)) {
            res.status(400).json({ success: false, error: HTSM_ERRORS.INVALID_SHARE_ID });
            return;
        }

        const data = await htsmService.getTestInfoData(shareId, userId, fingerprintHash);
        if (!data) {
            res.status(404).json({ success: false, error: HTSM_ERRORS.TEST_NOT_FOUND });
            return;
        }

        console.log(`[HTSM] Test info viewed for ${shareId}`);
        res.json({ success: true, data });
    } catch (error) {
        console.error('[HTSM] Get test info error:', error);
        res.status(500).json({ success: false, error: HTSM_ERRORS.INTERNAL_ERROR });
    }
}

/**
 * GET /api/htsm/stats
 * 전체 통계 조회
 */
export async function getStats(req: Request, res: Response): Promise<void> {
    try {
        const data = await htsmService.getGlobalStatsData();
        res.json({ success: true, data });
    } catch (error) {
        console.error('[HTSM] Get stats error:', error);
        res.status(500).json({ success: false, error: HTSM_ERRORS.INTERNAL_ERROR });
    }
}
