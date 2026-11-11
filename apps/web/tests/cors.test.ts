import { test, expect } from '@playwright/test';
import { isAllowedOrigin } from '../lib/cors';

test.describe('CORS allowlist policy', () => {
  test('allows official subdomains and localhost', () => {
    expect(isAllowedOrigin('https://box.harooo.co.kr')).toBe(true);
    expect(isAllowedOrigin('https://dumpit-web.harooo.co.kr')).toBe(true);
    expect(isAllowedOrigin('https://advent-calendar.harooo.co.kr')).toBe(true);
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('http://localhost:5173')).toBe(true);
  });

  test('blocks untrusted third-party origins', () => {
    expect(isAllowedOrigin('https://malicious.com')).toBe(false);
    expect(isAllowedOrigin('https://harooo.co.kr.attacker.com')).toBe(false);
    expect(isAllowedOrigin('null')).toBe(false);
  });
});
