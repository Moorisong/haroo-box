require('dotenv').config();

module.exports = {
    apps: [
        {
            name: 'box-be-test',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 3010,
                JWT_SECRET: process.env.JWT_SECRET,
                MONGODB_URI: process.env.MONGODB_URI,
                HTSM_MONGODB_URI: process.env.HTSM_MONGODB_URI,
                SIGNATURE_SECRET: process.env.SIGNATURE_SECRET,
                CLIENT_URL: 'https://test-box.haroo.site'
            }
        }
    ]
};
