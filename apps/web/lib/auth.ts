import { NextAuthOptions } from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import GoogleProvider from 'next-auth/providers/google';
import { getDatabase } from './mongodb';
import { getSharedCookieDomain } from './cookie-domain';

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
    maxAge: 30 * 24 * 60 * 60, // 30일
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
    async signIn({ user, account, profile }) {
      if (!account?.provider || !account?.providerAccountId) {
        return false;
      }

      try {
        const db = await getDatabase();
        const users = db.collection('users');

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

        const providerIdKey =
          account.provider === 'google'
            ? `google:${account.providerAccountId}`
            : account.providerAccountId;

        await users.updateOne(
          { providerId: providerIdKey },
          {
            $set: {
              providerId: providerIdKey,
              provider: account.provider,
              name: displayName,
              profileImage: profileImg,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );

        return true;
      } catch (error) {
        console.error('MongoDB 유저 저장 오류:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account?.provider && account?.providerAccountId) {
        const providerIdKey =
          account.provider === 'google'
            ? `google:${account.providerAccountId}`
            : account.providerAccountId;

        token.provider = account.provider as 'kakao' | 'google';
        token.providerId = providerIdKey;
        if (account.provider === 'kakao') {
          token.kakaoId = account.providerAccountId;
        }

        try {
          const db = await getDatabase();
          const users = db.collection('users');
          const dbUser = await users.findOne({ providerId: providerIdKey });
          if (dbUser) {
            token.userId = dbUser._id.toString();
            token.nickname = dbUser.nickname || null;
            token.nicknameUpdatedAt = dbUser.nicknameUpdatedAt?.toISOString() || null;
          }
        } catch (error) {
          console.error('유저 정보 조회 오류:', error);
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
