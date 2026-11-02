/**
 * 라우트 경로 상수
 * 2회 이상 사용되는 라우트 경로는 반드시 여기서 관리
 */

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    MYPAGE: '/mypage',
    ROLLING_PAPER: 'https://r-paper-web.harooo.co.kr/',
    HTSM: '/htsm',
    U_KNOW: '/u-know',
    TOBY: '/toby',
    PUZZLE: '/puzzle',
    GAMSS: 'https://dumpit-web.harooo.co.kr',
    TERMS: '/terms',
    PRIVACY: '/privacy',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

// Shared ordering for desktop and mobile content menus, matching homepage cards.
export const NAV_LINKS = [
  { label: '감쓰.exe', href: ROUTES.GAMSS, newTab: true },
  { label: '하루퍼즐', href: ROUTES.PUZZLE, newTab: true },
  { label: '롤링페이퍼', href: ROUTES.ROLLING_PAPER, newTab: true },
  { label: 'TOBY', href: ROUTES.TOBY, newTab: true },
  { label: '너잘알', href: ROUTES.U_KNOW },
  { label: '자아탐험', href: ROUTES.HTSM },
] as const;
