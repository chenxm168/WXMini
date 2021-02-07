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
    prodspec: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    let map = { FACTORYNAME: factory, PRODUCTIONTYPE: type, PRODUCTSPECNAME: product}
    let success = arg.success
    let fail = arg.fail
    console.log(env,product,type)
    util.sendQueryMsg(
      {
        env: env,
        userid: userid,
        map: map,
        queryid: 'GetLotListForProduction',
        service: 'asdcommonquerysrv',
        success: (res) => {
          console.log(res)
          success(res)
          
        },
        fail: (err) => {

        }
      })
  },//end function
})