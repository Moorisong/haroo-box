'use client';

import ErrorScreen from './error';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>
        <ErrorScreen error={error} reset={reset} />
      </body>
    </html>
  );
}
