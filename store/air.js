// 机票的数据
export const state=()=>{
    return{
        // 搜索记录
        searchList:[]
    }
}

// 同步修改state的数据
export const mutations={
    setSearchList(state,data){
        state.searchList.unshift(data);
        if(state.searchList.length>5)return state.searchList.length=5;
    }
}