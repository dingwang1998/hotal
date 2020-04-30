<template>
  <div class="comment-container">
      <div class="userinfo">
          <img src="http://127.0.0.1:1337/assets/images/avatar.jpg">
          <span>管理员</span>
          <span>2020-20-20</span>
          <span>11:12</span>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang='less'>
.comment-container{
    width: 100%;
    margin-top: 15px;
    border: 1px solid #eee;
    padding: 10px;
    .userinfo{
        display: flex;
        align-items: center;
        font-size: 12px;
        span{
            margin-right: 10px;
        }
        img{
            width: 20px;
            height: 20px;
            margin-right: 5px;
        }
    }
}
</style>