// miniprogram/pages/bindingCode/bindingCode.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    readySumit: false,
    verifyflag: true,
    codeid: '',
    args: '',
    page: '',
    verifyaccuracy: 20,
    eqid: '',
    category: '',
    codeurl: ''


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  onSwitchChange: function(e) {
    console.log(e.detail.value)
    this.data.verifyflag = e.detail.value
    this.setData({
      verifyflag: e.detail.value
    })
  },

  onCodeIdChange: function(e) {
    this.data.codeid = e.detail.value.toUpperCase()
    console.log(e.detail.value)
    this.setData({
      codeid: this.data.codeid
    })
  },

  onEqidChange:function(e)
  {
    this.data.eqid = e.detail.value.toUpperCase()

    this.setData({
      eqid: this.data.eqid
    })
  },

  onArgsChange: function(e) {
    this.data.args = e.detail.value
    console.log(e.detail.value)
    this.setData({
      args: e.detail.value
    })

  },

  onPageChange: function(e) {
    this.data.page = e.detail.value
    console.log(e.detail.value)
    this.setData({
      page: e.detail.value
    })
  },

  onVerifyAccuracyChange: function(e) {
    this.data.verifyaccuracy = e.detail.value
    console.log(e.detail.value)
    this.setData({
      verifyaccuracy: e.detail.value
    })
  },

  /**
   *  on Scan 
   */

  onScan: function() {

    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        // this.sumitCodeLocation(res.result)
        this.data.codeurl = res.result
        this.data.readySumit = true
        var db = wx.cloud.database()
        db.collection("codelocation").where({
          codeurl: res.result
        }).get({
          success: (res) => {
            if (res.data.length > 0) {
              this.data.readySumit = true,
                this.data.verifyflag = res.data[0].verifyflag,
                this.data.codeid = res.data[0].codeid,
                this.data.args = res.data[0].args,
                this.data.page = res.data[0].page,
                this.data.verifyaccuracy = res.data[0].verifyaccuracy,
                this.data.eqid = res.data[0].eqid,
                this.data.category = res.data[0].category,
                this.setData({
                  readySumit: this.data.readySumit,
                  verifyflag: this.data.verifyflag,
                  codeid: this.data.codeid,
                  args: this.data.args,
                  page: this.data.page,
                  verifyaccuracy: this.data.verifyaccuracy,
                  eqid: this.data.eqid,
                  category: this.data.category,


                })
            } else {
              this.setData({
                readySumit: true
              })
            }

          },
          fail: (err) => {
            this.setData({
              readySumit: true
            })

          }

        })


      }
    })

  }, //end function


  onSumitBinding: function() {
    this.sumitCodeLocation(this.data.codeurl,
      (res) => {
        wx.hideLoading()
      },
      (err) => {
        wx.hideLoading()
      })

  },

  resetValues: function() {
    this.data.readySumit = false,
      this.data.verifyflag = true,
      this.data.codeid = '',
      this.data.args = '',
      this.data.page = '',
      this.data.verifyaccuracy = 20,
      this.data.eqid = '',
      this.data.category = '',
      this.data.codeurl = ''

    this.setData({
      readySumit: false,
      verifyflag: true,
      codeid: '',
      args: '',
      page: '',
      verifyaccuracy: 20,
      eqid: '',
      category: '',
      codeurl: ''

    })


  },


  /**
   * 
   * sumit code loaction to server db
   * 
   */
  sumitCodeLocation: function(arg, resolve, reject) {
    wx.showLoading({
      title: '位置信息绑定中',
    })
    app.getCurrentLocation(res => {
      wx.cloud.callFunction({
        name: "bindingCodeLocation",
        data: {
          codeid: this.data.codeid,
          point: res,
          codeurl: arg,
          verifyaccuracy: this.data.verifyaccuracy,
          page: this.data.page,
          category: this.data.category,
          verifyflag: this.data.verifyflag,
          eqid: this.data.eqid,
          args: this.data.args


        },

        success: (res) => {
          this.resetValues()
          app.navigateToMessage("绑定成功", "二维码位置已成功绑定", "success")
        },
        fail: (err) => {
          app.navigateToMessage("绑定信息提交失败!", err, "warm")
        }

      })


    }, (err) => {
      app.navigateToMessage("获取当前位置失败!", err, "warn")
    })



  }, //end function


})