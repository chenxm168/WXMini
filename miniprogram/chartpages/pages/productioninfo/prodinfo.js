// chartpages/pages/productioninfo/prodinfo.js
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
            wHeight:result.windowHeight
           }
         )
       },
     })

    this.data.factory = options.factory,
      this.data.type = options.type,
      this.data.prodspec = options.prodspec
      console.log(options)
      this.getLotList(
        {
          prodspec:options.prodspec,
          type:options.type,
          factory:options.factory,
          success:(res)=>
          {
             console.log("getlot success")
             let datalist=res.result.Message.Body.DATALIST
            // console.log(datalist)
            let list=  util.MesDATALIST2List(datalist)
          //  console.log(list)
            let rs= util.GroupBy(list,(item)=>{
              return item.PROCESSFLOWNAME
            })
            console.log(rs)
            let sumgroup= util.SumaryBy(rs,['PRODUCTQUANTITY'])
            console.log(sumgroup)
          },
          fail:(err)=>
          {

          }
        }
      )
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
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
    let map = { FACTORYNAME: factory, PRODUCTIONTYPE: type, PRODUCTSPECNAME: product,PAGE_NAME:'lotlistsumary',TABLE_NAME:'lotlistsumary',TABLE_SETTING:'Y',HEADER_SETTING:'Y'}
    let success = arg.success
    let fail = arg.fail
    console.log(env,product,type)
    util.sendQueryMsg(
      {
        env: env,
        userid: userid,
        map: map,
        queryid: 'GetLotListSumaryForWX',
        service: 'asdcommonquerysrv',
        success: (res) => {
          console.log(res)
          let data=res.result.Message.Body.lotlistsumary
          this.setData(
            {
              tabledata:{datalist:data.DATALIST,headers:data.headers,attachseq:true,sumrequest:[{valuekey:'GROUPCOUNT',value:0,desc:'总数'}]},
              setting:data.setting
            }
          )
          
        },
        fail: (err) => {

        }
      })
  },//end function
  initChart:function()
  {
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
})
setChartOption(chart)
{
  
 
};
var  chtopt={
  title:{text:'TOP10'},
  legend: {},
  tooltip: {},
  dataset: {
      // 提供一份数据。
      dimensions: ['name', 'age', 'profession', 'score', 'date'],
      source: [
        /*
          ['product', '2015', '2016', '2017'],
          ['Matcha Latte', 43.3, 85.8, 93.7],
          ['Milk Tea', 83.1, 73.4, 55.1],
          ['Cheese Cocoa', 86.4, 65.2, 82.5],
          ['Walnut Brownie', 72.4, 53.9, 39.1] */
      ]
  },
      // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
xAxis: {type: 'category'},
// 声明一个 Y 轴，数值轴。
yAxis: {},
// 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
series: [
    {type: 'bar'},
],
grid: {
  left: 5,
  right: 5,
  height:300,
  top: 200,
  containLabel: true
},
}