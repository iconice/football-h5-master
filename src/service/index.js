import qs from 'qs'
import request from '@/assets/utils/request'

// 登录
const login = params =>
  request('/login/mobileLogin', {
    method: 'post',
    body: params
  })

// 退出登录
const loginOut = params => request(`/login/mobileLogout?token=${params.token}`)

// 获取用户信息
const getUserinfo = params =>
  request(`/login/getMobileUserInfo?token=${params.token}`)

// 获取年级
const getGrade = params =>
  request(`/common/getGradeList?userId=${params.userId}`)

// 获取赛季
const getSeason = () => request('/common/getSeasonList')

// 获取班级
const getClass = params =>
  request(`/common/getClassList?gradeId=${params.gradeId}`)

// 获取轮次
const getBatchNo = params =>
  request('/common/getBatchNoList', {
    method: 'post',
    body: params
  })

// 获取赛事列表
const getList = params =>
  request('/event/getMobileEventList', {
    method: 'post',
    body: params
  })

// 获取赛事详情
const getDetail = params =>
  request(`/event/getMobileEventInfoById?id=${params.id}`, { method: 'post' })

// 获取球队信息
const getTeamInfo = params =>
  request('/team/getMobileTeamPlayer', {
    method: 'post',
    body: params
  })

// 球员加减球
const changeScore = params =>
  request(`/event/updatePlayersScore?${qs.stringify(params)}`, {
    method: 'post'
  })

// 结束比赛
const endRace = params => request(`/event/endEvent?enventId=${params.enventId}`)

// 获取赛季积分榜
const getSeasonScore = params =>
  request('/mobileStatistical/event/getSeasonScoreboardList', {
    method: 'post',
    body: params
  })

// 获取赛季射手榜
const getSeasonShot = params =>
  request('/mobileStatistical/event/getSeasonLeaderboardList', {
    method: 'post',
    body: params
  })

// 获取总积分榜
const getTotalScore = params =>
  request('/mobileStatistical/event/getScoreboardList', {
    method: 'post',
    body: params
  })

// 获取总射手榜
const getTotalShot = params =>
  request('/mobileStatistical/event/getTopScorerList', {
    method: 'post',
    body: params
  })

export {
  login,
  loginOut,
  getUserinfo,
  getGrade,
  getSeason,
  getClass,
  getBatchNo,
  getList,
  getDetail,
  getTeamInfo,
  changeScore,
  endRace,
  getSeasonScore,
  getSeasonShot,
  getTotalScore,
  getTotalShot
}
