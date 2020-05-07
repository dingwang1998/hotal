<template>
  <div class="container">
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

    <!-- 搜索框 -->
    <div class="banner-content">
      <div class="search-bar">
        <!-- tab栏 -->
        <el-row type="flex" class="search-tab">
          <span
            v-for="(item,index) in options"
            :class="{active:current==index}"
            :key="index"
            @click="handleBtn(item,index)"
          >
            <i>{{item.title}}</i>
          </span>
        </el-row>

        <!-- 输入框 -->
        <el-row type="flex" align="middle" class="search-input">
          <input
            :placeholder="options[current].placeholder"
            v-model="inputdata"
            @keyup.enter="search(options[current].placeholder)"
          />
          <i class="el-icon-search"></i>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 存放轮播图
            banner: [],
            // 搜索3按钮
            options: [
                {
                    title: '攻略',
                    placeholder: '搜索目的地',
                    id: 1
                },
                {
                    title: '酒店',
                    placeholder: '请输入城市搜索酒店',
                    id: 2
                },
                {
                    title: '机票',
                    placeholder: '搜索机票',
                    id: 3
                }
            ],
            // 搜索按钮是否高亮
            current: '0',
            // 输入框的默认值
            placeholder: '',
            inputdata: ''
        }
    },
    mounted() {
        // 请求轮播图
        this.$axios({
            url: '/scenics/banners'
        }).then(res => {
            const { data } = res.data
            this.banner = data
            // console.log(this.banner);
        })
    },
    methods: {
        // 点击搜索按钮高亮按钮
        handleBtn(item, index) {
            this.current = index
            this.placeholder = item.placeholder
            console.log(item)
            if (item.placeholder == '搜索机票') {
                this.$router.push('/hotel')
                return
            }
            if (item.placeholder == '请输入城市搜索酒店') {
                this.$router.push('/hotel')
                return
            }
        },
        search(value) {
            if (!this.inputdata) return
            if (value == '搜索目的地') {
                this.$store.commit('post/searchPost', this.inputdata)
                this.$router.push('/post')
                return
            }
        }
    }
}
</script>

<style scoped lang='less'>
.container {
    min-width: 1000px;
    margin: 0 auto;
    position: relative;

    /deep/ .el-carousel__container {
        height: 700px;
    }

    .banner-image {
        width: 100%;
        height: 100%;
    }

    .banner-content {
        z-index: 9;
        width: 1000px;
        position: absolute;
        left: 50%;
        top: 45%;
        margin-left: -500px;
        border-top: 1px transparent solid;

        .search-bar {
            width: 552px;
            margin: 0 auto;
        }

        .search-tab {
            .active {
                i {
                    color: #333;
                }
                &::after {
                    background: #eee;
                }
            }

            span {
                width: 82px;
                height: 36px;
                display: block;
                position: relative;
                margin-right: 8px;
                cursor: pointer;

                i {
                    position: absolute;
                    z-index: 2;
                    display: block;
                    width: 100%;
                    height: 100%;
                    line-height: 30px;
                    text-align: center;
                    color: #fff;
                }

                &:after {
                    position: absolute;
                    left: 0;
                    top: 0;
                    display: block;
                    content: '';
                    width: 100%;
                    height: 100%;
                    border: 1px rgba(255, 255, 255, 0.2) solid;
                    border-bottom: none;
                    transform: scale(1.1, 1.3) perspective(0.7em)
                        rotateX(2.2deg);
                    transform-origin: bottom left;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 1px 2px 0 0;
                    box-sizing: border-box;
                }
            }
        }

        .search-input {
            width: 550px;
            height: 46px;
            background: #fff;
            border-radius: 0 4px 4px 4px;
            border: 1px rgba(255, 255, 255, 0.2) solid;
            border-top: none;
            box-sizing: unset;

            input {
                flex: 1;
                height: 20px;
                padding: 13px 15px;
                outline: none;
                border: 0;
                font-size: 16px;
            }

            .el-icon-search {
                cursor: pointer;
                font-size: 22px;
                padding: 0 10px;
                font-weight: bold;
            }
        }
    }
}
</style>