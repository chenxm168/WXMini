// miniprogram/pages/asd/main/asdMain.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    pageheight: 500

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (result) => {
        this.data.pageheight = result.windowHeight
        this.setData(
          {
            pageheight: this.data.pageheight
          }
        )
      },
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
  userChangeCick: function (res) {
    wx.redirectTo({

      url: '../login/userLogin?CHANGEENV=Y',
    })
  },
  libraryClick: function (res) {
    let userinfo = app.globalData.userinfo.oic
    console.log("libraryClick")
    console.log(userinfo)
    let success = function (res) {
      wx.navigateTo({
        url: '../library/selectPage',
      })
    }

    let locationfail = function (err) {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel:false,
        title:"位置验证失败",
        content:"手机位置验证失败,您无法继续使用此功能"
      })
    }
   
    let privilegefail=function(res)
    {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel:false,
        title:"权限验证失败",
        content:"权限验证失败,您无法使用此功能"
      })
    }

    let loginfail=function(res)
    {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel:false,
        title:"登陆过期",
        content:"用户登陆过期，请重新登陆",
        success:(res)=>
        {
          let url = "../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=2&LABELTEXT=OIC登陆过期,请重新登陆OIC！"
            wx.navigateTo({
              url: url,
            })
        }
      })
    }

    console.log(userinfo)
    if (userinfo.userid == null || userinfo.userid.length < 1) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: "未登陆OIC系统",
        content: "继续将转至OIC登陆界面",
        success(res) {
          if (res.confirm) {
            let url = "../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=2&LABELTEXT=你还未登陆OIC,请先登陆OIC！"
            wx.navigateTo({
              url: url,
            })
          }
        }
      })
    } else {
      app.verifyUserLoginTime(
        {
          systemmodule:'oic',
          durationhour:app.globalData.userinfo.env=='test'? app.globalData.userperiod.test:app.globalData.userperiod.prod,
          success:(res)=>
          {
            console.log("Start verify user privilege")
            app.verifyUserPrivilege(
              {
                
                  env:app.globalData.userinfo.oic.env,
                  userid:app.globalData.userinfo.oic.userid,
                  password:app.globalData.userinfo.oic.password,
                  privilegekey:'btnStorageIn',
                  success:success,
                  fail:privilegefail
              }
            )
            
          },
          fail:(err)=>
          {
            loginfail(err)
          }
        }
      )
    }

    console.log(app.globalData.userinfo)

  },
  inspectionClick: function (res) {
    let success = function (res) {
      wx.navigateTo({
        url: '../dailyCheck/selectPage',
      })
    }

    let locationfail = function (err) {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel:false,
        title:"位置验证失败",
        content:"手机位置验证失败,您无法继续使用此功能"
      })
    }
    let loginfail=function(res)
    {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel:false,
        title:"登陆过期",
        content:"PMS用户登陆过期，请重新登陆PMS",
        success:(res)=>
        {
          let url = "../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=1&LABELTEXT=PMS登陆过期,请重新登陆PMS！"
            wx.navigateTo({
              url: url,
            })
        }
      })
    }
    if (app.globalData.userinfo.pms.userid == null) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: "未登陆PMS系统",
        content: "继续将转至PMS登陆界面",
        success(res) {
          if (res.confirm) {
            let url = "../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=1&LABELTEXT=您还未登陆PMS,请先登陆PMS！"
            wx.navigateTo({
              url: url,
            })
          }
        }
      })
    } else {
      app.verifyUserLoginTime(
        {
          systemmodule:'pms',
          durationhour:app.globalData.userinfo.env=='test'? app.globalData.userperiod.test:app.globalData.userperiod.prod,
          success:(res)=>
          {
            success(null)
            
          },
          fail:(err)=>
          {
            loginfail(err)
          }
        }
      )
      

    }

  },
  filterClick: function (res) {
    wx.navigateTo({
      url: '../task/planTask',
    })
    /* disable for test
    let userinfo =app.globalData.userinfo.oic
    if(userinfo.userid==null||userinfo.userid.length<1)
    {
       
        let url="../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=1&LABELTEXT=你还未登陆PMS,请先登陆PMS！"
        wx.redirectTo({
          url: url,
        })
    }else
    {
    
      
     app.verifyUserPrivilege(
       {
         userid:userinfo.userid,
         password:userinfo.password,
         env:userinfo.env,
         privilegekey:"btnStorageIn",
         success:(res)=>
         {

         },
         fail:(res)=>
         {
           console.log(res)
           //TODO
         }
       } 
     )
     

    }*/
  },//end function
  balanceClick:function(res)
  {
    let userinfo = app.globalData.userinfo.oic
    console.log("libraryClick")
    console.log(userinfo)
    let success = function (res) {
      wx.navigateTo({
        url: '../balance/cellBalanceReport',
      })
    }

    let locationfail = function (err) {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel:false,
        title:"位置验证失败",
        content:"手机位置验证失败,您无法继续使用此功能"
      })
    }
   
    let privilegefail=function(res)
    {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel:false,
        title:"权限验证失败",
        content:"权限验证失败,您无法使用此功能"
      })
    }

    let loginfail=function(res)
    {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel:false,
        title:"登陆过期",
        content:"用户登陆过期，请重新登陆",
        success:(res)=>
        {
          let url = "../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=2&LABELTEXT=OIC登陆过期,请重新登陆OIC！"
            wx.navigateTo({
              url: url,
            })
        }
      })
    }

    console.log(userinfo)
    if (userinfo.userid == null || userinfo.userid.length < 1) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: "未登陆OIC系统",
        content: "继续将转至OIC登陆界面",
        success(res) {
          if (res.confirm) {
            let url = "../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=2&LABELTEXT=你还未登陆OIC,请先登陆OIC！"
            wx.navigateTo({
              url: url,
            })
          }
        }
      })
    } else {
      app.verifyUserLoginTime(
        {
          systemmodule:'oic',
          durationhour:app.globalData.userinfo.env=='test'? app.globalData.userperiod.test:app.globalData.userperiod.prod,
          success:(res)=>
          {
           success(null)
            
          },
          fail:(err)=>
          {
            loginfail(err)
          }
        }
      )
    }

    console.log(app.globalData.userinfo)

  },//end function
  plantaskClick:function(res)
  {
    let success = function (res) {
      wx.navigateTo({
        url: '../task/planTask',
      })
    }

    let locationfail = function (err) {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel:false,
        title:"位置验证失败",
        content:"手机位置验证失败,您无法继续使用此功能"
      })
    }
    let loginfail=function(res)
    {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel:false,
        title:"登陆过期",
        content:"PMS用户登陆过期，请重新登陆PMS",
        success:(res)=>
        {
          let url = "../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=1&LABELTEXT=PMS登陆过期,请重新登陆PMS！"
            wx.navigateTo({
              url: url,
            })
        }
      })
    }
    if (app.globalData.userinfo.pms.userid == null) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: "未登陆PMS系统",
        content: "继续将转至PMS登陆界面",
        success(res) {
          if (res.confirm) {
            let url = "../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=1&LABELTEXT=您还未登陆PMS,请先登陆PMS！"
            wx.navigateTo({
              url: url,
            })
          }
        }
      })
    } else {
      app.verifyUserLoginTime(
        {
          systemmodule:'pms',
          durationhour:app.globalData.userinfo.env=='test'? app.globalData.userperiod.test:app.globalData.userperiod.prod,
          success:(res)=>
          {
            success(null)
            
          },
          fail:(err)=>
          {
            loginfail(err)
          }
        }
      )
      

    }

  },//end function

  prodlistClick:function(arg)
  {
    wx.navigateTo({
      url: '../prodlist/prodlist',
    })
    /*
    app.queryWxPrivilege(
      {
        page:'prodlist',
        key:'prodlist',
        userid:app.globalData.userinfo.oic.userid,
        success:(res)=>
        {
          console.log(res)
        },
        fail:(err)=>
        {
          console.log(err)
        }
      }
    )*/

  },//end function

})