//app.js
App({
    onLaunch: function() {

      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        wx.cloud.init({
          env: 'asd-smart-cloud-dev-kwtq8',
          traceUser: true,
        })

        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        })





      }


    },
    globalData: {

      asdBaseInfo: null,
      userInfo: null,
      openid: null,
      roleInfo: null,
      deptInfo: null,
      appUserInfo: null,
      fabs: null,

      accessToken: {
        accessKey: null,
        expires_in: null
      },













    }, //end data


    /**
     * show message function
     */
    navigateToMessage: function(title, message, iconType) {

      let str = "?title=" + title + "&message=" + message + "&iconType=" + iconType
      wx.navigateTo({
        //url: '../msg/message' + str,
        url: '../msg/message' + str,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }, //end function

    /**
     * get roleInfo from db
     */
    getRoleInfo: function(resolve, reject) {
      const db = wx.cloud.database();
      db.collection('roleinfo').get({
        success: (res) => {
          // app.globalData.roleInfo = res.data;
          this.globalData.roleInfo = res.data
          console.log(res)
          if (resolve != null) {
            resolve(res)
          }

        },
        fail: (err) => {
          if (reject != null) {
            reject(err);
          }
        }
      })

    }, // end getRoleInfo fuction


    /**
     * get dept base info from db
     */

    getDeptInfo: function(resolve, reject) {

      const db = wx.cloud.database();
      db.collection('deptinfo').get({
        success: (res) => {
          this.globalData.deptInfo = res.data;
          console.log(res)
          if (resolve != null) {
            resolve(res)
          }
        },
        fail: (err) => {
          if (reject != null) {
            reject(err);
          }

        }
      })


    }, //end getDeptInfo fuction



    checkAccessToken: function(successs, fail) {

      success(true)
    }, //end function


    /**
     * get fabs base info from db ARRAY/CELL/CF/OTHER
     */

    getFabs: function(resolve, reject) {

      const db = wx.cloud.database();
      db.collection('fabs').get({
        success: (res) => {
          this.globalData.fabs = res.data;
          console.log(res)
          if (resolve != null) {
            resolve(res)
          }
        },
        fail: (err) => {
          if (reject != null) {
            reject(err);
          }

        }
      })


    }, //end fabs fuction


    /**
     * get all user
     */

    getAllUser: function(resolve, reject) {

      wx.cloud.callFunction({
        name: 'getAllUserInfo',
        data: {},
        success: (res) => {
          console.log(res)
          if (resolve != undefined && resolve != null) {
            resolve(res)
          }
        },
        fail: (err) => {
          console.log(err)
          if (reject != undefined && reject != null) {
            reject(err)
          }
        }
      })





    }, //end getAllUser fuction

    get2DCodeUrlArgs: function(httpString, resolve, reject) {
      var args = httpString.split("?");
      if (args[0] == httpString || args.length < 2) {
        if (reject != null && reject != null) {
          reject(new Error("无效的二维码"))
        }
      }
      var arr = args[1].split("&");
      var obj = {};

      let str = "{"

      for (var i = 0; i < arr.length; i++) {
        var arg = arr[i].split("=");
        if (i != arr.length - 1) {
          str = str + "\"" + arg[0] + "\":\"" + arg[1] + "\","
        } else {
          str = str + "\"" + arg[0] + "\":\"" + arg[1] + "\""
        }


      }
      str = str + "}"

      console.log(str)
      try {
        var t = JSON.parse(str)
        if (resolve != null && resolve != null) {
          resolve(t)
        }
      } catch (e) {
        console.log("无效的二维码");
        if (reject != null && reject != null) {
          reject(new Error("无效的二维码"))
        }
      }
    }, //end function



    /**
     * 
     * verify code 
     * 
     */

    verifyCode: function(arg, resolve, reject) {
      var argData = arg


      this.getCurrentLocation(
        (res) => {
          argData.codepoint = res

          wx.cloud.callFunction({
            name: "verifyCodeLocation",
            data:argData,
            success: (res) => {
              wx.hideLoading()
              resolve(res)
            },
            fail: (err) => {
              wx.hideLoading()
              reject(new Error(err))
            }

          })
        }, (err) => {
          wx.hideLoading()
          reject(new Error("获取当前位置失败\n" + err))
        }
      )

    }, //end verifyCode



    /**
     * 
     * get current loacation for binding
     */

    getCurrentLocation: function(resolve, reject) {
      wx.showLoading({
        title: '获取当前位置中',
      })
      wx.authorize({
        scope: 'scope.userLocation',
        success: (res) => {
          console.log(res)
          wx.getLocation({
            type: 'wgs84',
            success: function(res2) {


              console.log(res2)

              var point = {
                latitude: res2.latitude,
                longitude: res2.longitude,
                horizontalAccuracy: res2.horizontalAccuracy,
                speed: res2.speed,
                verticalAccuracy: res2.verticalAccuracy,
                accuracy: res2.accuracy
              }
              resolve(point)

            },
            fail: (err) => {
              console.log(err)
              reject(new Error("获取位置失败"))
              //app.navigateToMessage("获取位置失败!", err, "warm")
            }
          }) //end wx scan
        },
        fail: (err) => {
          console.log(err)
          reject(new Error(err))
        }
      })

    }, //end get current loaction






  }




)