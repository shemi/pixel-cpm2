/**
 * Created by pixel on 23/07/2015.
 */

module.exports = {
    hostname: process.env.hostname || 'localhost',
    port: process.env.PORT || '3000',
    companyName: 'Pixel',
    projectName: 'Pixel-cpm',
    systemEmail: 'shemi.perez@gmail.com',
    cryptoKey: 'gZh2F3uH2w',
    mongodb: {
        uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/CPM'
    },
    loginAttempts: {
        forIp: 50,
        forIpAndUser: 7,
        logExpiration: '25m'
    },
    requireAccountVerification: false,
    smtp: {
        from: {
            name: process.env.SMTP_FROM_NAME || this.projectName,
            address: process.env.SMTP_FROM_ADDRESS || this.systemEmail
        },
        credentials: {
            user: process.env.SMTP_USERNAME || 'shemi.perez@gmail.com',
            password: process.env.SMTP_PASSWORD || 'vbgrfaedxkdxxupw',
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            ssl: true
        }
    }
}