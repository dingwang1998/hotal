<template>
  <div style="width:1000px;margin:0 auto;padding:50px 0;">
    <script
      type="text/javascript"
      src="https://webapi.amap.com/maps?v=1.4.15&key=fba3fa19294ea55fb391428ba742810d"
    ></script>

    <div id="container"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    var map = new AMap.Map('container', {
      mapStyle: 'amap://styles/c1987cd5bc196058f204f0b5522094cb', //设置地图的显示样式
      zoom: 11, //级别
      center: [113.3245904, 23.1066805]
      // pitch:75, // 地图俯仰角度，有效范围 0 度- 83 度
      // viewMode:'3D' // 地图模式
    })
    // 创建一个 Marker 实例：
    var marker = new AMap.Marker({
      position: new AMap.LngLat(113.3245904, 23.1066805), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: '广州塔'
    })

    map.add(marker);
  }
}
</script>

<style scoped lang='less'>
#container {
  width: 800px;
  height: 480px;
}
</style>