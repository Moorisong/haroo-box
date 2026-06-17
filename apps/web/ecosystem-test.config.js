module.exports = {
    apps: [
        {
            name: 'box-fe-test',
            script: 'npm',
            args: 'start -- -p 3003 -H 127.0.0.1',
            env: {
                NODE_ENV: 'production'
            },
        },
    ],
};
