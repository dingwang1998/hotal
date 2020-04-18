
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title:'梦游旅行',//修改title
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/mengyouwang.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/font_1168872_ehvuah8v57g.css'} //新增全局字体样式
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'assets/main.css' //新增自定义过渡样式
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
     // 新增本地持久化的插件
    { src: '~/plugins/localStorage.js', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    // baseURL: "http://127.0.0.1:1337" //新增axios默认请求路径
    baseURL: "http://157.122.54.189:9095" // 备用地址
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
