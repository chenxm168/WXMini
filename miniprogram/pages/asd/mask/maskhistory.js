// miniprogram/pages/asd/mask/maskhistory.js
const app = getApp()
const util = require("../utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskname: null,
    du: 3,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.maskname = options.maskname
    this.getMaskHistory({
      userinfo: app.globalData.userinfo.oic,
      maskname: options.maskname,
      du: 3,

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.userinfo.oic.env == 'test') {
      // this.data.locationod = true

      wx.setNavigationBarColor({
        backgroundColor: app.globalData.testnavbackcolor,
        frontColor: app.globalData.testnavbarfontcolor,
        success(res) {
          console.log(res)
        },
        fail: (err) => {
          console.log(err)
        }
      })
    }
    wx.getSystemInfo({
      success: (result) => {
        let maskheight = result.windowHeight - 60
        let width = result.windowWidth
        this.setData({
          height: result.windowHeight,
          maskheight: maskheight,
          width: width
        })
      },
    })

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
  getMaskHistory(arg) {
    let uf = arg.userinfo
    let maskname = arg.maskname
    let du = arg.du

    let fdate = new Date()
    fdate.setMonth(fdate.getMonth() - du)
    let fdatestr = fdate.getFullYear().toString() + (fdate.getMonth() + 1).toString().padStart(2, '0') + fdate.getDate().toString().padStart(2, '0') + fdate.getHours().toString().padStart(2, '0') + fdate.getMinutes().toString().padStart(2, '0') + fdate.getSeconds().toString().padStart(2, '0')
    let tdate = new Date()
    let tdatestr = tdate.getFullYear().toString() + (tdate.getMonth() + 1).toString().padStart(2, '0') + tdate.getDate().toString().padStart(2, '0') + tdate.getHours().toString().padStart(2, '0') + tdate.getMinutes().toString().padStart(2, '0') + tdate.getSeconds().toString().padStart(2, '0')
    util.sendQueryMsg({
      env: uf.env,
      userid: uf.userid,
      queryid: 'GetDurableHistoryList',
      service: 'asdcommonquerysrv',
      map: { DURABLENAME: maskname, FROMTIME: fdatestr, TOTIME: tdatestr, PAGE_NAME: 'maskhistory', TABLE_NAME: 'history', TABLE_SETTING: 'Y', HEADER_SETTING: 'Y' },
      success: (res) => {
        console.log('getMaskHistory res:', res)
        let body = res.result.Message.Body
        this.setData(
          {
            setting: body.history.setting,
            tabledata: { datalist: body.history.DATALIST, headers: body.history.headers }
          }
        )
      },
      fail: (err) => {

      }
    })

  },

  duChange(arg) {
   if( this.data.du != arg.detail.value)
   {
    this.data.du = arg.detail.value
    this.refresh()
   }
    

  },//end function

  refresh()
  {
    let that=this.data
    this.getMaskHistory(
      {
        maskname:that.maskname,
        userinfo:app.globalData.userinfo.oic,
        du:that.du
      }
    )

  },//end function

})