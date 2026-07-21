require('dotenv').config();

module.exports = {
    apps: [
        {
            name: 'box-fe-test',
            script: 'npm',
            args: 'start -- -p 3004 -H 127.0.0.1',
            env: {
                NODE_ENV: 'production',
                NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
                MONGODB_URI: process.env.MONGODB_URI,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
                NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
                KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
                KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,
                NEXT_PUBLIC_KAKAO_API_KEY: process.env.NEXT_PUBLIC_KAKAO_API_KEY,
                NEXT_PUBLIC_SIGNATURE_SECRET: process.env.NEXT_PUBLIC_SIGNATURE_SECRET,
                GAME_SESSION_SECRET: process.env.GAME_SESSION_SECRET
            },
        },
    ],
};
