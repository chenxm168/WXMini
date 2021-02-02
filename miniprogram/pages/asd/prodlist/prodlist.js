// miniprogram/pages/asd/prodlist.js
const app=getApp()
const utils=require("../utils")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    factory:(app.globalData.userinfo.factory==null||app.globalData.userinfo.factory.length<1)? 'ARRAY': app.globalData.userinfo.factory,
  // factory:'ARRAY',
    productiontype:['P','E'],
    type:'P',
    factories:['ARRAY','CELL','CF'],
    orgintext:'点我选择',
    product:'点我选择',
    products:[],
    operationlist:[],
    operation:'点我选择',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getProductList(
      {
        success:(res)=>
        {

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
    if (app.globalData.userinfo.oic.env == 'test') {
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

  getProductList:function(arg)
  {
    let factory=this.data.factory
    let type=this.data.type
    let userid= app.globalData.userinfo.oic.userid
    let env= app.globalData.userinfo.oic.env
    let success=arg.success
    let fail=arg.fail
    let map={PRODUCTIONTYPE:type,FACTORYNAME:factory,USERID:userid}
    let queryid='GetProductSpecListForProduction'
    app.sendQueryMsg(
      {
        env:env,
        map:map,
        userid:userid,
        queryid:queryid,
        success:(res)=>
        {
          
          console.log(res)
          let datalist = res.result.Message.Body.DATALIST
          utils.DataList2List(
            {
              datalist:datalist,
              valuename:'PRODUCTSPECNAME',
              complete:(list)=>
              {
                console.log(list)
                this.data.products=list
                this.setData(
                  {
                    products:list
                  }
                )
              }
            }
          )
        },
        fail(err)
        {
          console.log(err)
        }
      }
    )
  },//end function

  getOperationList:function(arg)
  {
    let that=this.data
    let product=that.product==that.product==that.orgintext? "": that.product
    let map={FACTORYNAME:that.factory,PRODUCTIONTYPE:that.type,PRODUCTREQUESTNAME:product,USERID:app.globalData.userinfo.oic.userid}
    let queryid='GetOperationList'
    app.sendQueryMsg(
      {
        env:app.globalData.userinfo.oic.env,
        userid:app.globalData.userinfo.oic.userid,
        queryid:queryid,
        map:map,
        success:(res)=>
        {
          console.log(res)

        },
        fail:(err)=>
        {

        }
      }
    )

  },//end function

})