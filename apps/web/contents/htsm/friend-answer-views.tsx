import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

interface BaseViewProps {
  shareId: string;
}

export function CreatorView({ shareId }: BaseViewProps) {
  const router = useRouter();
  
  return (
    <div className={styles.pageContainer}>
      <div className={styles.submittedContainer}>
        <div className={styles.submittedContent}>
          <div className={styles.submittedEmoji}>🚫</div>
          <h1 className={styles.submittedTitle}>본인의 테스트입니다</h1>
          <p className={styles.submittedSubtitle}>
            자신의 테스트에는 답변을 남길 수 없어요.<br />
            친구들에게 링크를 공유해보세요!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
            <button className={`${styles.btnPrimary} ${styles.btnFull}`} onClick={() => router.push(`/htsm/share/${shareId}`)}>
              공유하기
            </button>
            <button className={`${styles.btnSecondary} ${styles.btnFull}`} onClick={() => router.push(`/htsm/result/${shareId}`)}>
              결과 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClosedView({ shareId }: BaseViewProps) {
  const router = useRouter();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.submittedContainer}>
        <div className={styles.submittedContent}>
          <div className={styles.submittedEmoji}>🔒</div>
          <h1 className={styles.submittedTitle}>이미 많은 친구들이 참여했어요!</h1>
          <p className={styles.submittedSubtitle}>
            최대 인원(10명)이 모두 참여하여 더 이상 응답을 남길 수 없습니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
            <button className={`${styles.btnPrimary} ${styles.btnFull}`} onClick={() => router.push(`/htsm/result/${shareId}`)}>
              친구 결과 보기
            </button>
            <button className={`${styles.btnSecondary} ${styles.btnFull}`} onClick={() => router.push('/htsm')}>
              나도 테스트 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubmittedView({ shareId }: BaseViewProps) {
  const router = useRouter();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.submittedContainer}>
        <div className={styles.submittedContent}>
          <div className={styles.submittedEmoji}>✨</div>
          <h1 className={styles.submittedTitle}>답변해주셔서 감사합니다!</h1>
          <p className={styles.submittedSubtitle}>
            친구가 종합된 결과를 확인할 수 있게 되었습니다
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
            <button className={`${styles.btnPrimary} ${styles.btnFull}`} onClick={() => router.push(`/htsm/result/${shareId}`)}>
              친구 결과 보기
            </button>
            <button className={`${styles.btnSecondary} ${styles.btnFull}`} onClick={() => router.push('/htsm')}>
              나도 테스트 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingView() {
  return (
    <div className={styles.pageContainer}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>로딩 중...</p>
      </div>
    </div>
  );
}
