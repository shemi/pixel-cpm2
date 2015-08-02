/**
 * Created by pixel on 23/07/2015.
 */

var path = require('path');

module.exports = {
    hostname: process.env.hostname || 'localhost',
    port: process.env.PORT || '3000',
    companyName: 'Pixel',
    projectName: 'Pixel-cpm',
    projectLogo: 'https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_logo_4.png',
    systemEmail: 'shemi.perez@gmail.com',
    cryptoKey: 'gZh2F3uH2w',
    lang: {
        locales: ['en', 'he'],
        defaultLocale: 'en',
        cookieName: 'locale',
        extension: ".json",
        directory: path.join(__dirname, '/logic/lang')
    },
    mongodb: {
        uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/CPM'
    },
    loginAttempts: {
        forIp: 50,
        forIpAndUser: 7,
        logExpiration: '25m'
    },
    requireAccountVerification: false,
    email: {
        from: {
            name: process.env.SMTP_FROM_NAME || this.projectName,
            address: process.env.SMTP_FROM_ADDRESS || this.systemEmail
        },
        credentials: {
            apiKey: 'MUJHCWjVSNuSG66bR7L6ew'
        }
    },
    socialLinks: [
        {name: 'Facebook', class: 'facebook', link: '#'},
        {name: 'Twitter', class: 'twitter', link: '#'},
        {name: 'Google +', class: 'google-plus', link: '#'}
    ]
}