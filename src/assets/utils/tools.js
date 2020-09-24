import qs from 'qs'

/**
 * 获取url参数
 */
export const getParamsFromUrl = variable => {
  // return qs.parse(window.location.search.split('?')[1]) || {};
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) {
      return qs.parse(vars[i])
    }
  }
  return false
}
