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
    wx.hideLoading()
    let user = app.globalData.appUserInfo
    console.log(user)
    if (user.env == "prod") {

      if (app.globalData.globalconfig != null) {
        wx.setNavigationBarColor({
          frontColor: app.globalData.globalconfig.prodnavcolor,
          backgroundColor: app.globalData.globalconfig.prodnavbackcolor,
        })

        wx.setNavigationBarTitle({
          title: app.globalData.globalconfig.prodnavtitle,
        })

      }


    } else {
      if (app.globalData.globalconfig != null) {
        wx.setNavigationBarColor({
          frontColor: app.globalData.globalconfig.devnavcolor,
          backgroundColor: app.globalData.globalconfig.devnavbackcolor,
        })

        wx.setNavigationBarTitle({
          title: app.globalData.globalconfig.devnavtitle,
        })
      }


    }
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

  onEqidChange: function(e) {
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

    //verify privilege success, excute this.scanCode
    this.verifyPrivilege(this.scanCode, null)


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
    let env = (app.globalData.appUserInfo != null) ? app.globalData.appUserInfo.env : "dev"
    let data = {
      codeid: this.data.codeid,
      point: null,
      codeurl: arg,
      verifyaccuracy: this.data.verifyaccuracy,
      page: this.data.page,
      category: this.data.category,
      verifyflag: this.data.verifyflag,
      eqid: this.data.eqid,
      args: this.data.args,
      env: env
    }

    app.getCurrentLocation(res => {
      data.point = res
      console.log(JSON.stringify(data))
      wx.cloud.callFunction({
        name: "bindingCodeLocation",
        data: data,
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

  verifyPrivilege: function(resolve, reject) {

    wx.showLoading({
      title: '权限验证中',
    })
    wx.cloud.callFunction({
      name: "verifyPrivilege",
      data: {
        page: "bindingCode"
      },
      success: (res) => {
        wx.hideLoading()
       
        if (res.result.returnCode < 0) {
          app.navigateToMessage("权限验证失败", res.result.returnText, "warn")
        } else {
          if (res.result.userinfo != undefined && res.result.userinfo != null) {
            app.globalData.appUserInfo = res.result.userinfo
          }
          resolve(res)
        }
      },
      fail: (err) => {
        wx.hideLoading()
        app.navigateToMessage("权限验证出错", err, "warn")
      }
    })


  }, //end function


  scanCode: function(arg) {

    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        this.data.codeurl = res.result
        this.data.readySumit = true
        let data = {

          env: app.globalData.appUserInfo.env,
          codeurl: res.result

        }

        console.log(JSON.stringify(data))
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
          name: "getCodeInfo",
          data: data,
          /*  }
          )

          // this.sumitCodeLocation(res.result)
        
          var db = wx.cloud.database()
          db.collection("codelocation").where({
            codeurl: res.result
          }).get({ */
          success: (res) => {
            wx.hideLoading()
            if (res.result != null&&res.result.data!=null) {
              let resdata = res.result.data
              this.data.readySumit = true,
                this.data.verifyflag = resdata.verifyflag,
                this.data.codeid = resdata.codeid,
                this.data.args = resdata.args,
                this.data.page = resdata.page,
                this.data.verifyaccuracy = resdata.verifyaccuracy,
                this.data.eqid = resdata.eqid,
                this.data.category = resdata.category,
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
              this.data.readySumit = true,
              app.get2DCodeUrlArgs(this.data.codeurl,(res)=>
              {
                this.data.args= (res.eqid==undefined||res.eqid==null||res.eqid.length<1)? "?eqid=" :"?eqid="+res.eqid
                this.data.verifyflag=true
                this.data.codeid = (res.codeid != undefined && res.codeid != null && res.codeid.length > 0) ? res.codeid : "" 
                this.data.eqid = (res.eqid != undefined && res.eqid != null &&res.eqid.length >0) ? res.eqid : "" 
                this.data.verifyaccuracy = (res.verifyaccuracy != undefined && res.verifyaccuracy != null && res.verifyaccuracy.length > 0) ? res.verifyaccuracy : 30
                this.data.page = (res.page != undefined || res.page != null && res.page.length > 0) ? res.page : "/pages/dailyCheck/dailyCheck" 
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

              },(err)=>
              {
                this.setData({
                  readySumit: true
                })

              })

              
            }

          },
          fail: (err) => {
            wx.hideLoading()
            this.setData({
              readySumit: true
            })

          }

        })


      }
    })


  }, //end scan2DCode


})