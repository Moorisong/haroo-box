// Offline-only copy: shown when the MongoDB translation endpoint is unreachable.
// Keep outside normal puzzle UI components so all standard UI copy remains DB-owned.
export const PUZZLE_TRANSLATION_ERROR_COPY = {
  ko: {
    title: '퍼즐 번역을 불러오지 못했어요',
    description: '잠시 후 다시 시도해 주세요. 문제가 계속되면 서버 상태를 확인해 주세요.',
    retry: '다시 시도',
  },
  en: {
    title: 'Puzzle translations are unavailable',
    description: 'Please try again. If the problem continues, check the API server.',
    retry: 'Retry',
  },
} as const;
