// 机票的数据
export const state=()=>{
    return{
        // 搜索记录
        searchList:[],
        // 选中机票信息
        ticketData:{
            seat_infos:{}
        }
    }
}

// 同步修改state的数据
export const mutations={
    //存储历史查询的数据
    setSearchList(state,data){
        // 把新的查询追加到第一个
        state.searchList.unshift(data);
        // 判断超出5条数据，让列表永远只有5条数据
        if(state.searchList.length>5)return state.searchList.length=5;
    },

    // 存储选中的机票信息
    setticketData(state,data){
        state.ticketData=data;
    }
}