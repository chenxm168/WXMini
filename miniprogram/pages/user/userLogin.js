// miniprogram/pages/user/userLogin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    isWxLogin: true,
    // sumitBtnTex:"微信账号登陆"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   /*
    if (app.globalData.deptInfo == null) {
      app.getDeptInfo((res) => {}, (err) => {
        app.navigateToMessage("程序出错了", err, "warn")
      })
    }

    if (app.globalData.roleInfo == null) {
      app.getRoleInfo((res) => {}, (err) => {
        app.navigateToMessage("程序出错了", err, "warn")
      })
    }  */
    this.login()
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.onUserLogin()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   // this.login()
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

  onUserLogin: function() {



    wx.showLoading({
      title: '登陆验证',
    })
    // this.getUserOpenid(this.login) 

    this.login();
  },






  getUserOpenid: function(resolve, fail) {
    if (app.globalData.openid == undefined || app.globalData.openid == null) {

      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: (res) => {

          console.log("======call cloud fuction[login] success!")
          console.log(res)
          app.globalData.openid = res.result.openid

          if (resolve != undefined && resolve != null) {
            resolve(res.result.openid)
          } else {
            console.log("resolve is undefined or is null")
          }

          // return res.result.openid
        },
        fail: (err) => {
          console.log("======call cloud fuction[login] fail!=====\n")
          console.log(err)
          if (reject != undefined && reject != null) {
            reject(err)
          }
        }
      })
    } else {
      if (resolve != undefined && resolve != null) {
        resolve(app.globalData.openid)
      }
    }

  }, //end fuction

  login: function(res) {
    wx.cloud.callFunction({
      name: "login",
      data: {},
      success: (res) => {
        console.log(res)
        switch (res.result.loginReturnCode)
        {
          

          case -1:
          {
              app.navigateToMessage("您的用户审核中", "您提交的资料等待部门负责人审核中，如有任何问题，请与部门负责人联系！", "waiting")
              break
          }
          case -2 :
          {
              app.navigateToMessage("禁止使用！", "您的账号被管理员禁止使用，如有任何问题，请与部门负责人联系！", "warn")
              break
          }

          default :
          {
            app.globalData.appUserInfo =res.result.rows[0]
              wx.redirectTo({
                url: '../main/main',
              })
              break
          }
        }  //end switch
        /*
        if (res.result.returnCode == -1 || res.result.dataCount < 1) {
          wx.navigateTo({
            url: 'userRegist',
          })
        } else {
          app.globalData.appUserInfo = res.result.rows[0]
          let user = res.result.rows[0]
          if (user.auth) {
            wx.redirectTo({
              url: '../main/main',
            })
            
          } else {
            app.navigateToMessage("您提交的资料审核中", "您提交的资料等待部门负责人审核中，如有任何问题，请与部门负责人联系！", "waiting")
          }
        } */
      },
      fail: (err) => {
        app.navigateToMessage("程序出错了！", "登陆失败，请联系系统管理员排查故障\n" + err, "warn")
      }
    })

    /*
    const db = wx.cloud.database();
    db.collection('users').where({
      openid: res
    }).get({
      success: (res) => {
        if (res.data.length < 1) {
          wx.navigateTo({
            url: 'userRegist',
          })
        } else {
          if (res.data.authentication == undefined || res.data.authentication == null) {
           /* wx.hideLoading()
            wx.navigateTo({
              url: '../msg/waitforauthmsg',
            })
            app.navigateToMessage("您提交的资料审核中","您提交的资料等待部门负责人审核中，如有任何问题，请与部门负责人联系！","waiting")
          } else {
            //app.globalData.userinfo.push(res.data)
          }
        }
      },
      fail: (err) => {
        console.log("=====access db[userinfo] error!\n")
        console.log(err)
      }

    })*/

  }, //end function










})