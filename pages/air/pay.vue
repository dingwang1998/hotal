<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{$store.state.air.allPrice}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
  data() {
    return {
      //生成定时器的对象
      timer: '',
      //机票订单信息
      ticketInfo: {}
    }
  },
  mounted() {
    //资源加载后，要获取订单详情。 而mounted资源加载就执行，还没有等待获取机票信息，用setTimeout延迟下
    setTimeout(async () => {
      const res = await this.$axios({
        url: '/airorders/' + this.$route.query.id,
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userJson.token
        }
      })
      this.ticketInfo = res.data
      //price 用于展示
      const { payInfo, price } = res.data
      // 生成二维码到canvas
      const stage = document.querySelector('#qrcode-stage')
      QRCode.toCanvas(stage, payInfo.code_url, {
        width: 200
      })
    }, 200)

    //设置定时器对象
    this.timer = setInterval(async () => {
      const checkPayState = await this.$axios({
        url: '/airorders/checkpay',
        method: 'POST',
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userJson.token
        },
        data: {
          id: this.ticketInfo.id,
          nonce_str: this.ticketInfo.price,
          out_trade_no: this.ticketInfo.orderNo
        }
      })
      console.log(checkPayState)
      //判断是否支付完成
      if (checkPayState.data.statusTxt == '支付完成') {
        this.$alert('订单支付完成', '温馨提示', {
          confirmButtonText: '确定',
          type: 'success',
          callback: action => {
            this.$router.replace('/air')
          }
        })
        clearInterval(this.timer)
      }
    }, 3000)
  },
  destroyed(){
      clearInterval(timer);
  }
}
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>