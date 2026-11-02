import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ROUTES } from '@/constants';
import AdBanner from '@/components/ads/ad-banner';
import styles from './page.module.css';
import './home-chrome.css';

export const dynamic = 'force-dynamic';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://box.harooo.co.kr';

export const metadata: Metadata = {
    title: '하루상자 | 즐거움과 유익함이 가득한 일일 콘텐츠 플랫폼',
    description: '힐링 퍼즐, 감정 배출 유틸리티, 소통형 미니게임, 그리고 교사를 위한 서비스 툴까지. 하루상자에서 매일 새로운 즐거움과 유용한 도구를 만나보세요.',
    keywords: [
        '하루상자', 'Haroo Box', '미니콘텐츠', '웹 플랫폼',
        '감쓰', '감쓰.exe', '감정쓰레기통', '스트레스 해소',
        '하루퍼즐', '주간 랭킹', '직소퍼즐', '웹 퍼즐 게임', '힐링 게임',
        '롤링페이퍼', '온라인 롤링페이퍼', '익명 롤링페이퍼',
        '너잘알', '친구 테스트', '단톡방 게임', '자아탐험', '조하리의 창',
        'TOBY', '토비', '교사 도구', '교사 전용 툴', '선생님 도구', '학급 관리'
    ],
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: '하루상자 | 즐거움과 유익함이 가득한 일일 콘텐츠 플랫폼',
        description: '퍼즐, 감쓰, 롤링페이퍼부터 교사 도구(TOBY)까지! 즐거움과 유익함이 공존하는 하루상자.',
        url: baseUrl,
        type: 'website',
        images: [
            {
                url: '/haroo-og-image-v2.png',
                width: 1200,
                height: 630,
                alt: '하루상자 메인 이미지',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '하루상자 | 즐거움과 유익함이 가득한 일일 콘텐츠 플랫폼',
        description: '퍼즐, 감쓰, 롤링페이퍼부터 교사 도구(TOBY)까지! 즐거움과 유익함이 공존하는 하루상자.',
        images: ['/haroo-og-image-v2.png'],
    },
};


type CardTone = 'gamss' | 'puzzle' | 'rolling' | 'toby' | 'uknow' | 'htsm';

interface ContentItem {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    category: string;
    tone: CardTone;
    badge?: string;
    badgeType?: string;
    newTab?: boolean;
    active: boolean;
}

const contents: ContentItem[] = [
    {
        id: 'gamss',
        title: '감쓰.exe',
        description: '쌓인 감정을 쓱 적고 버려요.\n오늘의 답답함은 여기까지.',
        image: '/sample/gamss-icon.png',
        link: ROUTES.GAMSS,
        category: '마음 정리',
        tone: 'gamss',
        badge: 'NEW',
        badgeType: styles.badgeNew,
        newTab: true,
        active: true,
    },
    {
        id: 'puzzle',
        title: '하루퍼즐',
        description: '매주 찾아오는 퍼즐을 맞추고\n기록과 랭킹에도 도전해요.',
        image: '/sample/puzzle-logo-v2.png',
        link: ROUTES.PUZZLE,
        category: '퍼즐 게임',
        tone: 'puzzle',
        badge: 'NEW',
        badgeType: styles.badgeNew,
        newTab: true,
        active: true,
    },
    {
        id: 'rolling-paper',
        title: '롤링페이퍼',
        description: '익명으로 마음을 전하고\n친구들과 추억을 이어가요.',
        image: '/sample/r-paper-logo.png',
        link: 'https://r-paper-web.harooo.co.kr',
        category: '마음 나누기',
        tone: 'rolling',
        badge: 'HOT',
        badgeType: styles.badgeHot,
        active: true,
    },
    {
        id: 'toby',
        title: 'TOBY',
        description: '수업과 학급 관리에 필요한\n선생님을 위한 도구 모음.',
        image: '/sample/toby-logo.png',
        link: '/toby',
        category: '선생님 도구',
        tone: 'toby',
        newTab: true,
        active: true,
    },
    {
        id: 'u-know',
        title: '너잘알',
        description: '친구들의 반응을 예상해 보고\n진짜 답과 비교하는 관계 놀이.',
        image: '/sample/u-know-logo-v3.png',
        link: ROUTES.U_KNOW,
        category: '친구와 함께',
        tone: 'uknow',
        active: true,
    },
    {
        id: 'htsm',
        title: '자아탐험',
        description: '친구들의 익명 평가로\n몰랐던 내 모습을 발견해요.',
        image: '/htsm-logo-v6.png',
        link: '/htsm',
        category: '나 알아보기',
        tone: 'htsm',
        active: true,
    },
];

export default function Home() {
    const activeCount = contents.filter((content) => content.active).length;

    return (
        <div className={styles.container}>
            <div className={styles.pageInner}>
                <section className={styles.collection} aria-labelledby="contents-heading">
                    <div className={styles.sectionHead}>
                        <div className={styles.sectionIntro}>
                            <span className={styles.sectionMark} aria-hidden="true"><span /><span /><span /><span /></span>
                            <div className={styles.sectionCopy}>
                                <p className={styles.sectionKicker}>하루상자에서 놀기</p>
                                <h2 id="contents-heading" className={styles.sectionTitle}>마음 가는 대로, <span className={styles.titleHighlight}>하나 골라.</span></h2>
                                <p className={styles.sectionSubcopy}>작은 재미부터 쓸모 있는 도구까지.</p>
                            </div>
                        </div>
                        <div className={styles.contentCount} aria-label={'콘텐츠 ' + activeCount + '개'}>
                            <span className={styles.countDot} aria-hidden="true" />
                            <strong>{activeCount}개의 콘텐츠</strong>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        {contents.map((content, index) => {
                            const cardClass = [styles.card, styles[content.tone]].join(' ');
                            const cardBody = (
                                <>
                                    <div className={styles.cardImageWrapper}>
                                        {content.badge && (
                                            <span className={[styles.badge, content.badgeType || ''].join(' ')}>
                                                {content.badge}
                                            </span>
                                        )}
                                        <span className={styles.imageAccent} aria-hidden="true" />
                                        <Image
                                            src={content.image}
                                            alt=""
                                            width={160}
                                            height={160}
                                            className={styles.cardImage}
                                            priority={index < 3}
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardHeadingRow}>
                                            <h3 className={styles.cardTitle}>{content.title}</h3>
                                            <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
                                        </div>
                                        <p className={styles.cardDescription}>{content.description}</p>
                                        <div className={styles.cardBottom}>
                                            <span>{content.active ? '열어보기' : '준비 중'}</span>
                                            <span className={styles.cardArrow} aria-hidden="true">↗</span>
                                        </div>
                                    </div>
                                </>
                            );

                            return content.active ? (
                                <Link
                                    href={content.link}
                                    key={content.id}
                                    className={cardClass}
                                    {...(content.newTab || content.link.startsWith('http')
                                        ? { target: '_blank', rel: 'noopener noreferrer' }
                                        : {})}
                                >
                                    {cardBody}
                                </Link>
                            ) : (
                                <div key={content.id} className={[cardClass, styles.disabled].join(' ')}>
                                    {cardBody}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <AdBanner className={styles.adBanner} />
            </div>
        </div>
    );
}
