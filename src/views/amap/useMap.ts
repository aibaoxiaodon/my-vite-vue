import { onMounted } from 'vue'

declare const window: Window & { AMap: any }

let map: any
let marker: any
let AMap = window.AMap

function useMap() {
  // * 实例化地图图层
  const instantiationMap = () => {
    map = new AMap.Map('container', {
      zoom: 15, // 级别
    })

    map.on('mapmove', mapMove)
    map.on('moveend', mapMoveend)

    geolocationMap()
  }

  // * 定位
  const geolocationMap = () => {
    AMap.plugin('AMap.Geolocation', function () {
      let geolocation = new AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 10000,
        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        buttonOffset: new AMap.Pixel(10, 20),
        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        zoomToAccuracy: true,
        //  定位按钮的排放位置,  RB表示右下
        buttonPosition: 'RB',
      })

      geolocation.getCurrentPosition(function (status: string, result: object) {
        if (status == 'complete') {
          onComplete(result)
        } else {
          onError(result)
        }
      })
    })
  }

  // * 定位成功
  const onComplete = (result: any) => {
    const { status, position } = result
    if (status === 0) {
      let lnglat = new AMap.LngLat(position.lng, position.lat)

      // 设置地图的中心点
      map.setCenter(lnglat)
      createMarker(position.lng, position.lat)

      geocoder(lnglat)
    }
  }

  // * 定位失败
  const onError = (error: object) => {
    console.log(error, '定位失败')
  }

  // * 创建一个 Marker 实例
  const createMarker = (lng: number, lat: number) => {
    marker = new AMap.Marker({
      position: new AMap.LngLat(lng, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      offset: new AMap.Pixel(-10, -10),
      icon: '/src/assets/timg.jpeg',
      title: '北京',
    })

    map.add(marker)
  }

  // * 坐标转位置
  const geocoder = (lnglat: any) => {
    AMap.plugin('AMap.Geocoder', function () {
      var geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '010',
      })

      geocoder.getAddress(lnglat, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          const { regeocode } = result

          // 设置鼠标划过点标记显示的文字提示
          marker.setLabel({
            direction: 'top',
            offset: new AMap.Pixel(10, 0), //设置文本标注偏移量
            content: `<div class='info'>${regeocode.formattedAddress}</div>`, //设置文本标注内容
          })
          // result为对应的地理位置详细信息
        }
      })
    })
  }

  // * 地图移动事件
  const mapMove = () => {
    let center = map.getCenter() //获取当前地图级别
    let lnglat = new AMap.LngLat(center.lng, center.lat)
    // console.log(center.lng, center.lat);

    marker.setPosition(lnglat)
  }

  // * 地图移动结束
  const mapMoveend = () => {
    let center = map.getCenter() //获取当前地图级别
    let lnglat = new AMap.LngLat(center.lng, center.lat)

    geocoder(lnglat)
  }

  // * 初始化调用
  const initMap = () => {
    instantiationMap()
  }

  onMounted(() => {
    initMap()
  })
}

export default useMap
