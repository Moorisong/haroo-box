import cron from 'node-cron';
import fs from 'fs';
import { getPostcardModel } from '../models/postcard.model';

/**
 * 하루엽서 만료 데이터 배치 삭제 함수
 *
 * 알고리즘:
 * 1. expires_at < 현재시각 에 부합하는 만료 도큐먼트 전체 조회
 * 2. 각 도큐먼트의 image_path를 기준으로 물리 파일 삭제 (fs.promises.unlink)
 * 3. 물리 파일 삭제 완료(또는 이미 없음) 이후 DB deleteMany 처리
 * 4. 모든 단계에서 예외 발생 시 루프 정지 방지를 위해 개별 try-catch 적용
 */
const runCleanup = async (): Promise<void> => {
  console.log('[PostcardCron] 만료 엽서 배치 삭제 시작:', new Date().toISOString());

  try {
    const PostcardModel = getPostcardModel();
    const now = new Date();

    // 만료된 엽서 도큐먼트 목록 로딩
    const expiredPostcards = await PostcardModel.find({
      expires_at: { $lt: now },
    }).select('_id image_path').lean();

    if (expiredPostcards.length === 0) {
      console.log('[PostcardCron] 삭제할 만료 엽서 없음.');
      return;
    }

    console.log(`[PostcardCron] 만료 엽서 ${expiredPostcards.length}건 삭제 시작`);

    // 각 도큐먼트의 물리 파일을 순차 삭제 (개별 에러가 전체 루프를 중단하지 않도록 처리)
    for (const doc of expiredPostcards) {
      try {
        await fs.promises.unlink(doc.image_path);
        console.log(`[PostcardCron] 파일 삭제 완료: ${doc.image_path}`);
      } catch (fileErr: unknown) {
        // 파일이 이미 없는 경우(ENOENT)는 정상으로 간주하고 계속 진행
        const code = (fileErr as NodeJS.ErrnoException).code;
        if (code === 'ENOENT') {
          console.warn(`[PostcardCron] 파일 이미 없음 (무시): ${doc.image_path}`);
        } else {
          console.error(`[PostcardCron] 파일 삭제 실패 (${doc.image_path}):`, fileErr);
        }
      }
    }

    // 물리 파일 처리 완료 후 DB 레코드 일괄 삭제
    const result = await PostcardModel.deleteMany({ expires_at: { $lt: now } });
    console.log(`[PostcardCron] DB 레코드 ${result.deletedCount}건 삭제 완료`);
  } catch (err) {
    // 전체 스크립트 수준의 예외 처리 - 배치 스크립트 정지 방지
    console.error('[PostcardCron] 배치 실행 중 예외 발생:', err);
  }
};

/**
 * 하루엽서 Cron 배치 스케줄러 등록
 * - 기본: 매일 새벽 04:00 실행 (환경변수로 주기 오버라이드 가능)
 * - 서버 최소 트래픽 시간대에 스토리지 자원 회수
 */
export const registerPostcardCleanupCron = (): void => {
  const schedule = process.env.CRON_CLEANUP_SCHEDULE ?? '0 4 * * *';

  cron.schedule(schedule, runCleanup, {
    timezone: 'Asia/Seoul',
  });

  console.log(`[PostcardCron] 배치 스케줄 등록 완료: "${schedule}" (Asia/Seoul)`);
};
