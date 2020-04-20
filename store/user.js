// 存放userJson的仓库,export const state={}是固定格式 export const state={}是固定写法
export const state = () => {
    return {
        // 登录成功后接口返回的用户数据，里面包含token，对象形式
        userJson: {}
    }
}

// 修改上面state的值,export const mutations={}是固定写法
export const mutations = {
    // mutations声明一个函数,自定义函数
    // 函数中传入两个参数,第一个是上面的state，第二个参数是传入的参数
    saveData(state, data) {
        // 通过state.的方法修改上面state的值
        state.userJson = data;
    }
}

// 异步的login请求封装 export const actions固定写法
export const actions = {
    // 封装login方法,第一个参数是store对象，第二个参数是传入的参数
    login(store, data) {
        return this.$axios({
            method: 'POST',
            url: '/accounts/login',
            data: data
        }).then(res => {
            // 请求成功后返回的数据data
            const { data } = res;
            // 通过store.commit调用mutations的方法,并且将返回的data传送给mutations,修改state的userJson数据
            store.commit('saveData', data)
            // 然后将这个结果return出去，让下一个then接受
            return data
        })
    },

    // 模拟验证码
    sendNum(store, username) {
        return this.$axios({
            url: '/captchas',
            method: 'POST',
            data: {
                tel: username
            }
        }).then(res => {
            const { code } = res.data;
            console.log(code);

            return code;
        })
    },

    // 注册功能封装
    register(store, data) {
        this.$axios({
            url: '/accounts/register',
            method: 'POST',
            data,
        }).then(res => {
            const { data } = res;
            console.log(data);

            // 通过commit来将返回的数据,修改到本地,实现注册完就登录的功能
            store.commit('saveData', data)
            return data;
        })
    }
}