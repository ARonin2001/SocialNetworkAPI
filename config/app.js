module.exports = {
    appPort: 3000,
    mongoUri: 'mongodb://localhost:27017/socialNetwork',
    jwt: {
        secret: '7234kdfjwef-234l2k3jf-234234',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '50m',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '60m',
            }
        }
    }
}