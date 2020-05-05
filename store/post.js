import { Message } from 'element-ui'
// 草稿箱数据
export const state = () => {
  return {
    darftList: [] //草稿数据
  }
}

//同步修改数据
export const mutations = {
  saveDarftList(state, data) {
    state.darftList.unshift(data)
    if (state.darftList.length > 5) return (state.darftList.length = 5)
  },

  //删除草稿箱数据
  deleteDarfList(state, idnex) {
    if (state.darftList.length == 1) {
      state.darftList = []
    } else {
      state.darftList.splice(1, idnex)
    }
    Message.success('删除成功')
  }
}
