import axios from 'axios'

// 不是默认导出 是因为如果要请求多个服务器的话 可以返回多个请求方法在同一个页面方便管理
export function request(config) {
  // 创建一个axios实例
  const instance = axios.create(
    {
      baseURL: '/api',
      timeout: 10000,
    }
  )
  return instance(config)
}
