const { protocol } = window.location
const basePath = '/football'

export default {
  baseUrl: 'http://183.230.174.110:11107', // 线上
  // baseUrl: 'http://192.168.1.12:7002', // 本地
  authKey: 'token',
  basePath,
  domin: `${protocol}//tokenrank.co` // 主域名
}
