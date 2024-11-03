const dev = process.env.NODE_ENV !== 'production';
export const serverConfig = {
    uri: dev ? 'http://localhost:3000' : 'http://fileshare.bryceyoder.com',
    pathToRoot: dev ? '/var/www/fileshare' : '/var/www/fileshare.bryceyoder.com'
}