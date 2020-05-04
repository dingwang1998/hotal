<template>
  <div class="mainconteniner">
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>酒店</el-breadcrumb-item>
      <el-breadcrumb-item>xx酒店</el-breadcrumb-item>
      <el-breadcrumb-item>酒店预订</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
    mounted(){
        console.log(this.$route.query);
        
    }
}
</script>

<style scoped lang='less'>
.mainconteniner{
    width:1000px;
    margin: 0 auto;
}
</style>