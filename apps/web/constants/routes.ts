/**
 * 라우트 경로 상수
 * 2회 이상 사용되는 라우트 경로는 반드시 여기서 관리
 */

export const ROUTES = {
    HOME: '/',
    ADVENT: 'https://advent-calendar.harooo.co.kr/',
    LOGIN: '/login',
    MYPAGE: '/mypage',
    ROLLING_PAPER: 'https://r-paper-web.harooo.co.kr/',
    HTSM: '/htsm',
    TOBY: '/toby',
    PUZZLE: '/puzzle',
    // from=haroo-box: 감쓰가 카카오 자동 로그인(prompt=none)을 시도하기 위한 진입 표시. 인증 정보는 담지 않는다.
    GAMSS: 'https://dumpit-web.harooo.co.kr/?from=haroo-box',
    TERMS: '/terms',
    PRIVACY: '/privacy',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

// Shared ordering for desktop and mobile content menus, matching homepage cards.
export const NAV_LINKS = [
  { label: '어드벤트 초콜릿', href: ROUTES.ADVENT, newTab: true },
  { label: '감쓰.exe', href: ROUTES.GAMSS, newTab: true },
  { label: '하루퍼즐', href: ROUTES.PUZZLE, newTab: true },
  { label: '롤링페이퍼', href: ROUTES.ROLLING_PAPER, newTab: true },
  { label: 'TOBY', href: ROUTES.TOBY, newTab: true },
  { label: '자아탐험', href: ROUTES.HTSM },
] as const;
