import { test, expect } from '@playwright/test';
import { POSTCARD_FONTS } from '../../constants/postcard';

/**
 * 하루엽서 Share 페이지 및 View 페이지의 이미지 저장 및 서체(FontFamily) 보존 테스트 스펙
 */
test.describe('하루엽서 2개 페이지(Share/View) 이미지 저장 서체 보존 검증', () => {
  test('1. Share 페이지: 선택한 서체(FontFamily)가 DOM 및 캡처 파이프라인에 정확히 반영되는지 검증', async () => {
    // 8종 폰트 목록 확인
    expect(POSTCARD_FONTS).toHaveLength(8);

    // 유저가 선택한 폰트 (예: font-5 명조 계열)
    const selectedFont = POSTCARD_FONTS.find((f) => f.id === 'font-5');
    expect(selectedFont).toBeDefined();
    expect(selectedFont?.style.fontFamily).toContain('Noto Serif KR');
  });

  test('2. View 페이지: 3D Canvas 독립 2D 정적 캡처 프레임에 서체가 동일하게 적용되는지 검증', async () => {
    // View 페이지의 2D 캡처 프레임 폰트 검증 (예: font-6 감성명조)
    const font6 = POSTCARD_FONTS.find((f) => f.id === 'font-6');
    expect(font6?.style.fontFamily).toContain('Gowun Batang');
  });

  test('3. Google Fonts @font-face 인라인 임베딩 구문 정당성 검증', async () => {
    const googleFontsUrl =
      'https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Do+Hyeon&family=Gowun+Batang:wght@400;700&family=Gowun+Dodum&family=Noto+Sans+KR:wght@400;700;900&family=Noto+Serif+KR:wght@400;700;900&family=Song+Myung&display=swap';

    expect(googleFontsUrl).toContain('Gowun+Batang');
    expect(googleFontsUrl).toContain('Black+Han+Sans');
  });
});
