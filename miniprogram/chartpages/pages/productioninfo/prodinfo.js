// chartpages/pages/productioninfo/prodinfo.js
import * as echarts from '../components/ec-canvas/echarts';
const app = getApp()
const util = require("../utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    factory: null,
    type: null,
    prodspec: null,
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (result) => {
        this.setData(
          {
            wHeight: result.windowHeight
          }
        )
      },
    })

    this.data.factory = options.factory,
      this.data.type = options.type,
      this.data.prodspec = options.prodspec
    console.log(options)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    this.getLotList(
      {
        prodspec: this.data.prodspec,
        type: this.data.type,
        factory: this.data.factory,
        success: (res) => {
          console.log("getlot success")
          let datalist = res.result.Message.Body.lotlistsumary.DATALIST
          // console.log(datalist)
          let list = util.MesDATALIST2List(datalist)
          console.log(list)
          if (this.MakeChartData(list))
            this.initChart()

        },
        fail: (err) => {

        }
      }
    )

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getLotList: function (arg) {
    let factory = arg.factory
    let type = arg.type
    let env = app.globalData.userinfo.oic.env
    let userid = app.globalData.userinfo.oic.userid
    let product = arg.prodspec
    let map = { FACTORYNAME: factory, PRODUCTIONTYPE: type, PRODUCTSPECNAME: product, PAGE_NAME: 'lotlistsumary', TABLE_NAME: 'lotlistsumary', TABLE_SETTING: 'Y', HEADER_SETTING: 'Y' }
    let success = arg.success
    let fail = arg.fail
    console.log(env, product, type)
    util.sendQueryMsg(
      {
        env: env,
        userid: userid,
        map: map,
        queryid: 'GetLotListSumaryForWX',
        service: 'asdcommonquerysrv',
        success: (res) => {
          console.log(res)
          let data = res.result.Message.Body.lotlistsumary
          this.setData(
            {
              tabledata: { datalist: data.DATALIST, headers: data.headers, attachseq: true, sumrequest: [{ valuekey: 'GROUPCOUNT', value: 0, desc: '总数' }] },
              setting: data.setting
            }
          )
          success(res)

        },
        fail: (err) => {

        }
      })
  },//end function
  initChart: function () {
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setChartOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
    })

  },//end function
  MakeChartData: function (rawdata) {
    let source = ['OPE', 'COUNT']
    // console.log('makeCHartData rawdata:',rawdata)
    for (let i = 0; i < 10; i++) {
      let el = rawdata[i]
      let data = (el.DATA != undefined && el.DATA != null) ? el.DATA : el
      let d = []
      chtopt.xAxis.data=[]
      chtopt.series[0].data=[]

      chtopt.xAxis.data.push(data.PROCESSOPERATIONNAME)
      chtopt.series[0].data.push(parseFloat(data.GROUPCOUNT))
    }
    /*
    rawdata.forEach(el => {
        let data= (el.DATA!=undefined&&el.DATA!=null)? el.DATA:el
        let d=[]
        d.push(data.PROCESSOPERATIONNAME)
        d.push(parseFloat(data.GROUPCOUNT) )
        source.push(d)
        
        chtopt.xAxis.data.push(data.PROCESSOPERATIONNAME)
        chtopt.series[0].data.push(parseFloat(data.GROUPCOUNT) )
        chtopt.xAxis.data.length=10
        chtopt.series[0].data.length=10 

    }); */
    source.length = 10
    console.log('chtope::', chtopt)
    // chtopt.source=source
    return true
  }
})

var chtopt = {
  title: { text: 'TOP10' },
  legend: {},
  tooltip: {},
  /*
  dataset: {
      // 提供一份数据。
     // dimensions: ['OPE', 'COUNT'],
      source: [
        
      ]
  },  */
  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  xAxis: {
    type: 'category',
    data: []
  },
  // 声明一个 Y 轴，数值轴。
  yAxis: {},
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  series: [
    {
      type: 'bar',
      name: 'COUNT',
      data: [],
      label: {
        show: true,
        /*
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate, */
   
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 5,
        formatter:  ' {b}:  {c}',
        fontSize: 13,
        showBackground: true,
        backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    }

  ],
  grid: {
    left: 5,
    right: 5,
    height: 300,
    top: 30,
    containLabel: true
  },
};

var setChartOption = function (chart) {
  chart.setOption(chtopt)
  return true
};