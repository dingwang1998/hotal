// 存放userJson的仓库,export const state={}是固定格式 export const state={}是固定写法
export const state={
    // 登录成功后接口返回的用户数据，里面包含token，对象形式
    userJson:{}
}

// 修改上面state的值,export const mutations={}是固定写法
export const mutations={
    // mutations声明一个函数,自定义函数
    // 函数中传入两个参数,第一个是上面的state，第二个参数是传入的参数
    saveData(state,data){
        // 通过state.的方法修改上面state的值
        state.userJson=data;
    }
}