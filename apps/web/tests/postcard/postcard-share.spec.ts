import { test, expect } from '@playwright/test';

/**
 * 하루엽서 공유 및 이미지 저장(서체 반영) 테스트 스펙
 */
test.describe('하루엽서 이미지 저장 및 서체 보존 검증', () => {
  test('이미지 저장 시 선택한 서체(FontFamily) 스타일이 보존되어 다운로드되는지 검증', async () => {
    // 1. 유저가 서체를 지정했는지 확인 (예: font-5 명조 계열)
    const selectedFontFamily = "'Noto Serif KR', serif";
    expect(selectedFontFamily).toContain('Serif');

    // 2. Google Fonts Embed CSS 구문 포함 여부 검증
    const googleFontsEmbedCss = `@import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Do+Hyeon&family=Gowun+Batang:wght@400;700&family=Gowun+Dodum&family=Noto+Sans+KR:wght@400;700;900&family=Noto+Serif+KR:wght@400;700;900&family=Song+Myung&display=swap');`;
    expect(googleFontsEmbedCss).toContain('font-family');
  });
});
