// miniprogram/pages/asd/mask/mask.js
const app = getApp()
const util = require("../utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableTitleContent:'Mask信息列表',
    masknamelist:null,
    selectmaskinfo:null,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:',options)
    let liststr=options.masklist
    let ls= liststr.split(';')
    this.data.masknamelist=ls
    this.getmasklistinfo({
      masklist:ls
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
        let maskheight = result.windowHeight - 100
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

  getmasklistinfo(arg)
  {
    let uf=app.globalData.userinfo.oic
    let ls=arg.masklist
    let str=' AND DURABLENAME IN ('
   for(let i=0;i<ls.length;i++)
   {
     console.log('masklist '+i+':',ls[i])
     if(i==ls.length-1)
     {
       let s="'"+ls[i]+"') "
       str+=s
     }
     else
     {
       let s=" '"+ls[i]+"', "
       str+=s
     }
   }
   console.log('SQL IN STR:',str)
   /*
    let cdn=" AND (:FACTORYNAME IS NULL OR D.FACTORYNAME = :FACTORYNAME) AND (:DURABLESPECNAME IS NULL OR D.DURABLESPECNAME =:DURABLESPECNAME) AND (:DURABLETYPE IS NULL OR D.DURABLETYPE = :DURABLETYPE) AND (:DURABLESTATE IS NULL OR D.DURABLESTATE =:DURABLESTATE) AND (:DURABLEHOLDSTATE IS NULL OR D.DURABLEHOLDSTATE = :DURABLEHOLDSTATE) AND (:DURABLECLEANSTATE IS NULL OR DURABLECLEANSTATE = :DURABLECLEANSTATE) AND D.DURABLETYPE = 'PhotoMask' " +str+" ORDER BY D.DURABLENAME"
    */
    let cdn= "AND (:FACTORYNAME IS NULL OR D.FACTORYNAME = :FACTORYNAME)  AND D.DURABLETYPE = :DURABLETYPE " +str+" ORDER BY D.DURABLENAME"
    util.sendQueryMsg({
      env:uf.env,
      userid:uf.userid,
      queryid:'GetMaskList',
      service: 'asdcommonquerysrv',
      map:{EVENTUSER:uf.userid,CONDITION:cdn,FACTORYNAME:uf.factory,PAGE_NAME: 'mask', TABLE_NAME: 'masklist', TABLE_SETTING: 'Y', HEADER_SETTING: 'Y'},
      success:(res)=>
      {
        console.log('GetMaskList res:',res)
        this.setMasklistData(res)
      },
      fail:(err)=>
      {

      }
      
    })

  },//end function

  setMasklistData(res)
  {
    let body = res.result.Message.Body
    let mts = body.masklist
    let setting = mts.setting
    let headers = mts.headers
    let rowothercolors = null
    // let tabledata =mts.DATALIST
    if (setting.rowothercolors != undefined && setting.rowothercolors != null) {
      rowothercolors = setting.rowothercolors
    }
    this.data.datalist = (mts.DATALIST.DATA == undefined || mts.DATALIST.DATA == null) ? mts.DATALIST : [{ DATA: mts.DATALIST.DATA }]
    this.setData(
      {

        setting: setting,
        tabledata: { datalist: mts.DATALIST, headers: headers, attachcolor: { rowothercolors: rowothercolors } },
        selectrowinfo: this.data.selectrowinfo
      }
    )

  }
})