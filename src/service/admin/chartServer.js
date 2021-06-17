import { request } from '../request'

export const getTableName = () => request(
  {
    url: 'tableName',
    method: "post",
  }
)
export const getTableData = params => request(
  {
    url: 'tableData',
    method: "get",
    params
  }
)
export const getTableColumn = tableName => request(
  {
    url: 'listing',
    method: "get",
    params: {
      tableName
    }
  }
)
export const getShuJuBiao = data => request(
  {
    url: 'shujubiao',
    method: "post",
    data
  }
)
export const chongmingm = data => request(
  {
    url: 'chongmingm',
    method: "put",
    data
  }
)
export const createZhuXingTu = data => request(
  {
    url: 'zhuxingtu',
    method: "post",
    data
  }
)