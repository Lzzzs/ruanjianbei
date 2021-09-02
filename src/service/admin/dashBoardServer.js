import { request } from '../request'

export const addDashBoardServer = data => request(
  {
    url: 'addYBP',
    method: 'post',
    data
  }
)

export const findAllDashBoardsServer = () => request(
  {
    url: 'findYBP',
    method: 'get',
  }
)

export const updateDashBoardServer = data => request(
  {
    url: 'updateYBP',
    method: 'put',
    data
  }
)

export const deleteDashBoardServer = deleteId => request(
  {
    url: `outYBP/${deleteId}`,
    method: 'delete',
  }
)

export const addDashServer = data => request(
  {
    url: 'addMeter',
    method: 'post',
    data
  }
)

export const findDashBoardChildServer = dashId => request(
  {
    url: `findMeter?dashBoardID=${dashId}`,
    method: 'get',
  }
)

export const updateDashServer = data => request(
  {
    url: 'updateMeter',
    method: 'put',
    data
  }
)

export const updateDashNameServer = data => request(
  {
    url: 'updateMeterName',
    method: 'put',
    data
  }
)
export const findDashBoardIdBindNameServer = dashBoardName => request(
  {
    url: `findYBPName?dashBoardName=${dashBoardName}`,
    method: 'get',
  }
)