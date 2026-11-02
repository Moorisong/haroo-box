import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ROUTES } from '@/constants';
import AdBanner from '@/components/ads/ad-banner';
import styles from './page.module.css';

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

interface ContentItem {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    badge?: string;
    badgeType?: string;
    newTab?: boolean;
    active: boolean;
}

export default function Home() {
    const contents: ContentItem[] = [
        {
            id: 'gamss',
            title: '감쓰.exe',
            description: '참지 마. 여기다 버려.\n쓰고 버리는 감정쓰레기통!',
            image: '/sample/gamss-icon.png',
            link: ROUTES.GAMSS,
            badge: 'New',
            badgeType: styles.badgeNew,
            newTab: true,
            active: true,
        },
        {
            id: 'puzzle',
            title: '하루퍼즐',
            description: '매주 찾아오는 고요하고 평화로운 퍼즐.\n나만의 기록으로 주간 랭킹 도전!',
            image: '/sample/puzzle-logo-balanced.png',
            link: ROUTES.PUZZLE,
            badge: 'New',
            badgeType: styles.badgeNew,
            newTab: true,
            active: true,
        },
        {
            id: 'rolling-paper',
            title: '롤링페이퍼',
            description: '친구들과 추억을 나누는 익명 롤링페이퍼.\n마음을 전하는 따뜻한 시간!',
            image: '/sample/r-paper-logo.png',
            link: 'https://r-paper-web.harooo.co.kr',
            badge: 'Hot',
            badgeType: styles.badgeHot,
            active: true,
        },
        {
            id: 'toby',
            title: 'TOBY',
            description: '학교 선생님들을 위한 서비스 툴 모음.\n수업과 학급 관리에 유용한 도구들!',
            image: '/sample/toby-logo.png',
            link: '/toby',
            newTab: true,
            active: true,
        },
        {
            id: 'u-know',
            title: '너잘알',
            description: '친구 반응 예상하고 실제 답변과 비교!\n단톡방 투척용 병맛 관계 놀이 ㅋㅋ',
            image: '/u-know-logo-v2.png',
            link: ROUTES.U_KNOW,
            active: true,
        },
        {
            id: 'htsm',
            title: '자아탐험',
            description: '친구들의 익명 평가로 발견하는 나.\nJohari Window 기반 심리 분석!',
            image: '/htsm-logo-v6.png',
            link: '/htsm',
            active: true,
        },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>하루상자</h1>
                <p className={styles.subtitle}>매일 새로운 즐거움과 유익함이 담긴 곳</p>
            </header>

            <div className={styles.grid}>
                {contents.map((content) => (
                    content.active ? (
                        <Link
                            href={content.link}
                            key={content.id}
                            className={styles.card}
                            {...(content.newTab || content.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                            <div className={styles.cardImageWrapper}>
                                {content.badge && (
                                    <div className={styles.badgeGroup}>
                                        <span className={`${styles.badge} ${content.badgeType || ''}`}>{content.badge}</span>
                                    </div>
                                )}

                                <Image
                                    src={content.image}
                                    alt={content.title}
                                    width={140}
                                    height={140}
                                    className={styles.cardImage}
                                    style={content.id === 'puzzle' ? { mixBlendMode: 'multiply' } : undefined}
                                    priority
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <h2 className={styles.cardTitle}>{content.title}</h2>
                                <p className={styles.cardDescription}>{content.description}</p>
                            </div>
                        </Link>
                    ) : (
                        <div key={content.id} className={`${styles.card} ${styles.disabled}`}>
                            <div className={styles.cardImageWrapper}>
                                <Image
                                    src={content.image}
                                    alt={content.title}
                                    width={140}
                                    height={140}
                                    className={styles.cardImage}
                                    style={{ filter: 'grayscale(100%)', opacity: 0.5 }}
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <h2 className={styles.cardTitle}>{content.title}</h2>
                                <p className={styles.cardDescription}>{content.description}</p>
                            </div>
                        </div>
                    )
                ))}
            </div>

            <AdBanner className={styles.adBanner} />
        </div>
    );
}

