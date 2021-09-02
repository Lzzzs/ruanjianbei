import { request } from '../request'

export const connectDB = connectInfo => request({
    url: 'lianjieDB',
    method: "post",
    data: connectInfo
})