import { nanoid } from 'nanoid';
import { getJohariTestModel } from '../../models/johari-test.model';
import { getJohariAnswerModel } from '../../models/johari-answer.model';
import { getHtsmStatsModel } from '../../models/htsm-stats.model';
import { getUserModel } from '../../models/user.model';
import { calculateJohari } from './johari.service';
import { generateDescription } from './utils/description-generator';
import { HTSM_CONFIG } from './constants';

export const SHARE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function getTodayDate(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function incrementStats(testCount: number, answerCount: number) {
    try {
        const HtsmStats = getHtsmStatsModel();
        const today = getTodayDate();

        await HtsmStats.findOneAndUpdate(
            { date: today },
            {
                $inc: {
                    newTests: testCount,
                    newAnswers: answerCount,
                    totalTests: testCount,
                    totalAnswers: answerCount
                }
            },
            { upsert: true, new: true }
        );

        await HtsmStats.findOneAndUpdate(
            { date: new Date(0) },
            {
                $inc: {
                    totalTests: testCount,
                    totalAnswers: answerCount
                }
            },
            { upsert: true }
        );

    } catch (e) {
        console.error('Failed to update stats:', e);
    }
}

export async function checkDailyTestLimit(userId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const JohariTest = getJohariTestModel();
    const dailyCount = await JohariTest.countDocuments({
        userId,
        createdAt: { $gte: today }
    });

    return dailyCount >= 5;
}

export async function createNewTest(
    selfKeywords: string[],
    userId: string,
    name: string,
    fingerprintHash: string,
    ip: string,
    userAgent: string
) {
    const JohariTest = getJohariTestModel();
    const shareId = nanoid(HTSM_CONFIG.SHARE_ID_LENGTH);

    const test = await JohariTest.create({
        shareId,
        selfKeywords,
        userId,
        name,
        creatorFingerprint: fingerprintHash,
        createdIp: ip,
        createdUserAgent: userAgent,
    });

    incrementStats(1, 0).catch(console.error);
    return test.shareId;
}

export async function getLatestTestByUserId(userId: string) {
    const JohariTest = getJohariTestModel();
    const test = await JohariTest.findOne({ userId }).sort({ createdAt: -1 });
    return test?.shareId || null;
}

export async function getTestByShareId(shareId: string) {
    const JohariTest = getJohariTestModel();
    return JohariTest.findOne({ shareId });
}

export async function checkExistingAnswer(testId: any, fingerprintHash: string) {
    const JohariAnswer = getJohariAnswerModel();
    return JohariAnswer.findOne({ testId, fingerprintHash });
}

export async function createNewAnswer(
    testId: any,
    keywords: string[],
    fingerprintHash: string,
    ip: string,
    userAgent: string,
    currentAnswerCount: number
) {
    const JohariAnswer = getJohariAnswerModel();
    
    await JohariAnswer.create({
        testId,
        keywords,
        fingerprintHash,
        ip,
        userAgent,
    });

    const updatedTest = await getJohariTestModel().findByIdAndUpdate(
        testId,
        {
            $inc: { answerCount: 1 },
            ...(currentAnswerCount + 1 >= HTSM_CONFIG.MAX_ANSWERS_PER_TEST
                ? { $set: { isClosed: true } }
                : {}),
        },
        { new: true }
    );

    incrementStats(0, 1).catch(console.error);
    return updatedTest?.isClosed ?? false;
}

export async function getResultData(shareId: string) {
    const JohariTest = getJohariTestModel();
    const test = await JohariTest.findOne({ shareId });
    if (!test) return null;

    const JohariAnswer = getJohariAnswerModel();
    const answers = await JohariAnswer.find({ testId: test._id });
    const friendAnswers = answers.map((a) => a.keywords);

    const johari = calculateJohari(test.selfKeywords, friendAnswers);

    const totalFriends = HTSM_CONFIG.MIN_FRIENDS_FOR_RESULT;
    const participationPercent = Math.min(Math.round((test.answerCount / totalFriends) * 100), 100);
    const friendsNeeded = Math.max(0, totalFriends - test.answerCount);

    const cards = [
        {
            title: '개방된 자아',
            area: 'open',
            theme: 'green',
            keywords: johari.open.keywords,
            description: generateDescription('open', johari.open.keywords, shareId)
        },
        {
            title: '눈먼 자아',
            area: 'blind',
            theme: 'blue',
            keywords: johari.blind.keywords,
            description: generateDescription('blind', johari.blind.keywords, shareId)
        },
        {
            title: '숨겨진 자아',
            area: 'hidden',
            theme: 'purple',
            keywords: johari.hidden.keywords,
            description: generateDescription('hidden', johari.hidden.keywords, shareId)
        },
        {
            title: '미지의 자아',
            area: 'unknown',
            theme: 'cyan',
            keywords: test.answerCount === 0 ? [] : johari.unknown.keywords,
            description: generateDescription('unknown', test.answerCount === 0 ? [] : johari.unknown.keywords, shareId)
        }
    ];

    let displayName = test.name;
    if (test.userId) {
        const user = await getUserModel().findOne({ providerId: test.userId });
        if (user) {
            displayName = user.nickname;
        }
    }

    return {
        name: displayName,
        answerCount: test.answerCount,
        isClosed: test.isClosed,
        johari,
        participationPercent,
        friendsNeeded,
        cards,
    };
}

export async function getTestInfoData(shareId: string, userId?: string, fingerprintHash?: string) {
    const JohariTest = getJohariTestModel();
    const test = await JohariTest.findOne({ shareId });
    if (!test) return null;

    const isCreator = (userId && test.userId === userId) || (fingerprintHash && test.creatorFingerprint === fingerprintHash);

    let displayName = test.name;
    if (test.userId) {
        const user = await getUserModel().findOne({ providerId: test.userId });
        if (user) {
            displayName = user.nickname;
        }
    }

    return {
        name: displayName,
        answerCount: test.answerCount,
        isClosed: test.isClosed,
        isCreator,
    };
}

export async function getGlobalStatsData() {
    const HtsmStats = getHtsmStatsModel();
    let globalStats = await HtsmStats.findOne({ date: new Date(0) });

    if (!globalStats) {
        const JohariTest = getJohariTestModel();
        const currentTotal = await JohariTest.countDocuments();

        const answerStats = await JohariTest.aggregate([
            { $group: { _id: null, totalAnswers: { $sum: '$answerCount' } } }
        ]);
        const currentTotalAnswers = answerStats.length > 0 ? answerStats[0].totalAnswers : 0;

        globalStats = await HtsmStats.create({
            date: new Date(0),
            totalTests: currentTotal,
            totalAnswers: currentTotalAnswers,
        });
    }

    const totalCreated = globalStats.totalTests;
    const totalAnswers = globalStats.totalAnswers;

    const avgFriends = totalCreated > 0
        ? Math.round((totalAnswers / totalCreated) * 10) / 10
        : 0;

    return {
        totalCreated,
        avgFriends,
    };
}
