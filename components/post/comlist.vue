<template>
  <div class="other-user">
    <div class="other">
        <comlist :data="data.parent" v-if="data.parent" @replybtn="replySomeone"/>
      <div class="other-left">
          
        <div>
          <span>{{data.account.nickname}}</span>
          <span>{{moment(data.created_at).format('YYYY-MM-DD hh:mm')}}</span>
        </div>
        <el-button type="primary" size="mini" @click="replySomeone(data)">回复</el-button>
      </div>
      <p>{{data.content}}</p>
      <div>
        <img
        :src="$axios.defaults.baseURL+item2.url"
        v-for="(item2,index2) in data.pics"
        :key="index2"
      />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
    name: 'comlist',
    props: {
        data: {
            type: Object,
            parent: {},
            pics: []
        }
    },
    data() {
        return {
            moment,
            // 回复对象
            reply: {
                isShow: false,
                showReplyObject: '',
                id:''
            }
        }
    },
    methods:{
        replySomeone(data){
            this.$emit('replybtn',data);
        }
    }
}
</script>

<style scoped lang='less'>
.other-user {
    background-color: #f6f6f6;
    // padding: 5px;
    box-sizing: border-box;
    border-radius: 5px;
    border:1px solid gray;
    p {
        padding: 0;
        padding: 5px 0;
    }
}
.other {
    display: flex;
    flex-direction: column;
    padding: 5px;
    font-size: 12px;
    p {
        margin-bottom: 5px;
    }
    img {
        width: 80px;
        height: 80px;
    }
}
.other-left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
}
</style>