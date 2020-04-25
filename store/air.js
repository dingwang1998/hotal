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
    setSearchList(state,data){
        state.searchList.unshift(data);
        if(state.searchList.length>5)return state.searchList.length=5;
    },

    // 存储选中的机票信息
    setticketData(state,data){
        state.ticketData=data;
    }
}