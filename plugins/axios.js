// Plugin的所有文件都会导入项目中，并且是全局的
// 类似于在普通的vue项目中的main.js里面的内容，对整个项目有效

import { Message } from "element-ui";

// 用于拦截axios的错误
// 插件要求暴露出一个函数
export default (nuxt)=>{
  nuxt.$axios.onError(err=>{
    const{statusCode,message}=err.response.data;
    if(statusCode==400) return Message.error('用户不存在')
  })
 
}