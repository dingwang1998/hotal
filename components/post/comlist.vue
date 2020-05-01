<template>
    <div class="other-user">
      <div class="other">
        <div class="other-left">
          <span>耐温摩尔</span>
          <span>2020-20-20</span>
          <span>01：01</span>
        </div>
        <div class="other-right">
          <el-button type="primary" size="mini">回复</el-button>
        </div>
      </div>
      <p>我也不知道啊 我也没有去过那里</p>
    </div>
</template>

<script>
export default {
    name: 'comlist',
    props: {
        data: {
            type: Object,
            parent: {}
        }
    },
    mounted() {
        console.log(this.data)
    }
}
</script>

<style scoped lang='less'>
.other-user {
    background-color: #f6f6f6;
    padding: 5px 0 5px 5px;
    margin-bottom: 5px;
    box-sizing: border-box;
    p {
        padding: 0;
    }
}
.other {
    display: flex;
    justify-content: space-between;
}
</style>