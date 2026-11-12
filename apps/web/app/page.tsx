'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import Image from 'next/image';
import { ROUTES } from '@/constants';
import AdBanner from '@/components/ads/ad-banner';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://box.harooo.co.kr';


type CardTone = 'gamss' | 'puzzle' | 'rolling' | 'toby' | 'htsm' | 'advent';

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
    english?: boolean;
}

const contents: ContentItem[] = [
    {
        id: 'advent',
        title: '어드벤트 초콜릿',
        description: '나만의 초콜릿 캘린더를 만들고\n친구들의 비밀 메시지를 받아요.',
        image: '/sample/advent-logo.svg',
        link: ROUTES.ADVENT,
        category: '연말 이벤트',
        tone: 'advent',
        badge: 'NEW',
        badgeType: styles.badgeNew,
        newTab: true,
        active: true,
        english: true,
    },
    {
        id: 'puzzle',
        title: '하루퍼즐',
        description: '매주 찾아오는 퍼즐을 맞추고\n기록과 랭킹에도 도전해요.',
        image: '/sample/puzzle-logo-v2.png',
        link: ROUTES.PUZZLE,
        category: '퍼즐 게임',
        tone: 'puzzle',
        badge: 'HOT',
        badgeType: styles.badgeHot,
        newTab: true,
        active: true,
        english: true,
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
        english: true,
    },
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
    const { language, t } = useLanguage();
    const activeCount = contents.filter((content) => content.active).length;

    return (
        <div className={styles.container}>
            <div className={styles.pageInner}>
                <section className={styles.collection} aria-labelledby="contents-heading">
                    <div className={styles.sectionHead}>
                        <div className={styles.sectionIntro}>
                            <div className={styles.sectionCopy}>
                                <h1 id="contents-heading" className={styles.sectionTitle}>{t('마음 가는 대로, ', 'Pick your next ')}<span className={styles.titleHighlight}>{t('하나 골라.', 'little joy.')}</span></h1>
                                <p className={styles.sectionSubcopy}>{t('작은 재미부터 쓸모 있는 도구까지.', 'Little joys and useful tools, all in one place.')}</p>
                            </div>
                        </div>
                        <div className={styles.contentCount} aria-label={'콘텐츠 ' + activeCount + '개'}>
                            <strong>{activeCount} {t('개의 콘텐츠', 'experiences')}</strong>
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
                                        {content.english && (
                                            <span className={styles.englishBadge} aria-label="English available">EN <span aria-hidden="true">✓</span></span>
                                        )}
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
                                            <h3 className={styles.cardTitle}>{language === 'en' ? ({advent:'Advent Chocolate',gamss:'Dumpit.exe',puzzle:'Haroo Puzzle','rolling-paper':'Rolling Paper',toby:'TOBY',htsm:'Self Discovery'} as Record<string,string>)[content.id] : content.title}</h3>
                                            <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
                                        </div>
                                        <p className={styles.cardDescription}>{language === 'en' ? ({advent:'Create a chocolate calendar and collect secret messages from friends.',gamss:'Write it out, let it go, and feel a little lighter.',puzzle:'Solve a new puzzle every week and climb the rankings.','rolling-paper':'Share anonymous notes and make memories together.',toby:'Helpful classroom tools for teachers.',htsm:'Discover yourself through anonymous feedback.'} as Record<string,string>)[content.id] : content.description}</p>
                                        <div className={styles.cardBottom}>
                                            <span>{content.active ? t('열어보기', 'Explore') : t('준비 중', 'Coming soon')}</span>
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
