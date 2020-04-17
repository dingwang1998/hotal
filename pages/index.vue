<template>
  <div>
    <!-- 轮播图组件 -->
    <el-carousel height="700px" style="min-width:1000px">
      <el-carousel-item v-for="(item,index) in banner" :key="index">
        <div
          :style="`
                background:url(${$axios.defaults.baseURL+item.url}) center center no-repeat;
                background-size:contain contain;
                height:700px;
                `"
        ></div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data(){
    return{
      // 存放轮播图
      banner:[]
    }
  },
  mounted(){
    // 请求轮播图
    this.$axios({
      url:'/scenics/banners'
    }).then(res=>{
      const{data}=res.data;
      this.banner=data;
      console.log(this.banner);
    })
  }
}
</script>

<style scoped lang='less'>
</style>