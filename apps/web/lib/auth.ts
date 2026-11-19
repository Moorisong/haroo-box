import { NextAuthOptions } from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import GoogleProvider from 'next-auth/providers/google';
import { getSharedCookieDomain } from './cookie-domain';
import { ensureBoxUser } from './ensure-box-user';
import { normalizeProviderId } from './unified-service-user';
import { SESSION_MAX_AGE_SECONDS } from './unified-auth-constants';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      image?: string | null;
      kakaoId?: string;
      provider?: 'kakao' | 'google';
      providerId?: string;
      nickname?: string | null;
      nicknameUpdatedAt?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    kakaoId?: string;
    provider?: 'kakao' | 'google';
    providerId?: string;
    nickname?: string | null;
    nicknameUpdatedAt?: string | null;
    boxProvisioned?: boolean;
  }
}

interface KakaoProfileFields {
  kakao_account?: {
    name?: string;
    profile?: { nickname?: string; profile_image_url?: string };
  };
}

const cookieDomain = getSharedCookieDomain();
const useSecure = process.env.NODE_ENV === 'production' && true;

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || process.env.HAROO_COMMON_KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || process.env.HAROO_COMMON_KAKAO_CLIENT_SECRET!,
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  cookies: cookieDomain
    ? {
        sessionToken: {
          name: useSecure ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: useSecure,
            domain: cookieDomain,
          },
        },
      }
    : undefined,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on any *.harooo.co.kr or *.haroo.site subdomain
      try {
        const parsed = new URL(url);
        if (
          parsed.hostname === 'harooo.co.kr' ||
          parsed.hostname.endsWith('.harooo.co.kr') ||
          parsed.hostname === 'haroo.site' ||
          parsed.hostname.endsWith('.haroo.site') ||
          parsed.hostname === 'localhost' ||
          parsed.hostname === '127.0.0.1'
        ) {
          return url;
        }
      } catch {
        // invalid URL
      }
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      if (
        (account?.provider !== 'google' && account?.provider !== 'kakao') ||
        !account.providerAccountId
      ) {
        return false;
      }

      try {
        let displayName = user.name;
        let profileImg = user.image;

        if (account.provider === 'kakao') {
          const kakaoProfile = profile as KakaoProfileFields | undefined;
          displayName =
            kakaoProfile?.kakao_account?.name ||
            kakaoProfile?.kakao_account?.profile?.nickname ||
            user.name;
          profileImg = kakaoProfile?.kakao_account?.profile?.profile_image_url || user.image;
        }

        // Resolve old Google IDs (raw and google:-prefixed) before inserting.
        // Never create a new box _id when a matching legacy account exists.
        const boxUser = await ensureBoxUser({
          provider: account.provider,
          providerId: account.providerAccountId,
          name: displayName,
          image: profileImg,
        });
        return Boolean(boxUser);
      } catch (error) {
        console.error('MongoDB 유저 저장 오류:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (
        (account?.provider === 'google' || account?.provider === 'kakao') &&
        account.providerAccountId
      ) {
        const providerIdKey = normalizeProviderId(account.provider, account.providerAccountId);
        token.provider = account.provider;
        token.providerId = providerIdKey;
        if (account.provider === 'kakao') {
          token.kakaoId = account.providerAccountId;
        }

        try {
          // Use exactly the same legacy-aware lookup as signIn and JIT.
          const boxUser = await ensureBoxUser({
            provider: account.provider,
            providerId: providerIdKey,
            name: user?.name || (token.name as string) || null,
            image: user?.image || (token.picture as string) || null,
          });
          if (boxUser) {
            token.userId = boxUser.userId;
            token.nickname = boxUser.nickname;
            token.nicknameUpdatedAt = boxUser.nicknameUpdatedAt;
            token.boxProvisioned = true;
          }
        } catch (error) {
          console.error('유저 정보 조회 오류:', error);
        }
      } else if (token.providerId && (token.provider === 'google' || token.provider === 'kakao') && !token.boxProvisioned) {
        try {
          const boxUser = await ensureBoxUser({
            provider: token.provider,
            providerId: token.providerId,
            name: (token.name as string) || null,
            image: (token.image as string) || (token.picture as string) || null,
          });
          if (boxUser) {
            token.userId = boxUser.userId;
            token.nickname = boxUser.nickname;
            token.nicknameUpdatedAt = boxUser.nicknameUpdatedAt;
            token.boxProvisioned = true;
          }
        } catch (error) {
          console.error('하루상자 JIT 유저 생성 오류:', error);
        }
      }

      if (user) {
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.provider = token.provider;
        session.user.providerId = token.providerId;
        session.user.kakaoId = token.kakaoId;
        session.user.nickname = token.nickname;
        session.user.nicknameUpdatedAt = token.nicknameUpdatedAt;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
