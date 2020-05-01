// Plugin的所有文件都会导入项目中，并且是全局的
// 类似于在普通的vue项目中的main.js里面的内容，对整个项目有效

import { Message } from "element-ui";

// 用于拦截axios的错误
// 插件要求暴露出一个函数,onError是错误捕捉的方法
// export default (nuxt)=>{
//   nuxt.$axios.onError(err=>{
//     const{statusCode,message}=err.response.data;
//     if(statusCode==400) return Message.error('用户不存在')
//   })
// }

// 响应拦截器
export default function (nuxt) {
  nuxt.$axios.interceptors.response.use(res => {
    return res;
  }, error => {
    const { statusCode, message } = error.response.data;
    // console.log(statusCode);
    
    if (statusCode == 400) {
      Message.error('用户不存在')
    }; //这里Message对应的是第4行的Message
    if(statusCode == 401){
      Message.error('当前没有登录页');
      nuxt.redirect('/user/login')
    };
    if(statusCode==403){
      Message.error('发表评论需要登陆账户');
      nuxt.redirect('/user/login');
    }
    return Promise.reject(error)
  })
}