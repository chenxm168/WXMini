//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      /* develop env
      wx.cloud.init({
        env: 'asd-smart-cloud-dev-kwtq8',
        traceUser: true,
      })*/

      //prod env
      wx.cloud.init({
        env: 'asd-smart-cloud-k2u5e',
        traceUser: true,
        fail: (err) => {
          wx.showModal({
            cancelColor: 'cancelColor',
            showCancel: false,
            title: "系统初始化失败",
            content: "小程序系统环境初始化失败，将无法继续使用！"
          })
        }
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



    wx.getSystemInfo({
      success: (result) => {
        this.globalData.wHeight = result.windowHeight
      },
    })



  },
  globalData: {



    //for asd
    msg: { data: { JsonMessage: { Url: "", Service: "asdquerysrv", Userinfo: { ENV: "prod", USERID: "", MOBILEMODE: "", SYSTEMMODULE: "", USERGROUP: "", LATITUDE: 0, LONGITUDE: 0, PRIVILEGEKEY: null, OPENID: null }, Message: { MODULE: "qry", MESSAGENAME: "GetQueryResult", QUERYID: "GetInspectionRecordList", VERSION: "", PARAMMAP: {}, PARAMLIST: [], Body: {} } } } },

    userinfo: { pms: { division: "", usergroup: "", factory: "", userid: null, password: "", loginisok: false, lastlogin: null, env: "test" }, oic: { factory: "", userid: null, password: "", loginisok: false, lastlogin: null, env: "test" } },
    userinfo: { pms: { division: "", usergroup: "", factory: "", userid: null, password: "", loginisok: false, lastlogin: null, env: "test" }, oic: { factory: "", userid: null, password: "", loginisok: false, lastlogin: null, env: "test" } },
    userlocation: { latitude: null, longitude: null, lasttime: null },
    wHeight: 500,
    testnavbackcolor: "#FF7F50",
    testnavbarfontcolor: "#000000",
    prodnavbackcolor: null,
    prodnavbarfontcolor: null,
    asdlocation: { latitude: 22.854119, longitude: 115.36502, accuracy: 5000, verifyflag: true },
    userperiod: { test: 200, prod: 12 },
    wifissid: null,
    wifissidlist: ['CIM_WIFI'],
    wifibssidlist: [],
    wifissidverify: true,
    wifibssidverify: false,
    requesturls: { 'CIM_WIF': "", 'ASD-guest': "http://172.28.64.21/" }





















  }, //end data


  /**
   * show message function
   */
  navigateToMessage: function (title, message, iconType) {

    let str = "?title=" + title + "&message=" + message + "&iconType=" + iconType
    wx.navigateTo({
      //url: '../msg/message' + str,
      url: '../msg/message' + str,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }, //end function



  redirectToMessage: function (title, message, iconType) {

    let str = "?title=" + title + "&message=" + message + "&iconType=" + iconType
    wx.redirectTo({
      url: '../msg/message' + str,
    })

  }, //end function



  get2DCodeUrlArgs: function (httpString, resolve, reject) {
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




  //start for asd

  sendMessage: function (msg, success) {
    wx.showLoading({
      title: '数据加载中',
    })
    wx.cloud.callFunction({
      name: "sendReceive",
      data: msg,
      complete: (res) => {
        wx.hideLoading({
          success: (res) => { },
        })
        success(res)
      }
    })

  },

  sendMsg: function (arg) {
    let msg = arg.msg
    let title = arg.title
    let success = arg.success
    let fail = arg.fail
    wx.showLoading({
      title: title,
    })
    wx.cloud.callFunction({
      name: "sendReceive",
      data: msg,
      success: (res) => {
        wx.hideLoading({
          success: (res) => { },
        })
        if (success != undefined && success != null) {
          success(res)
        }
      },
      fail: (err) => {
        wx.hideLoading({
          success: (res) => { },
        })
        if (err != null)
          fail(err)
      }
    })

  },
  //for test
  /*
   sendMsg: function (arg) {
     let msg = arg.msg
     let title = arg.title
     let success = arg.success
     let fail = arg.fail
     
 
 
 
     let wifiFail=(arg)=>
     {
       let success=arg.success
       let fail=arg.fail
       let msg=arg.msg
       wx.cloud.callFunction({
         name: "sendReceive",
         data: msg,
         success: (res) => {
           wx.hideLoading({
             success: (res) => { },
           })
           if (success != undefined && success != null) {
             success(res)
           }
         },
         fail: (err) => {
           wx.hideLoading({
             success: (res) => { },
           })
           if (err != null)
             fail(err)
         }
       })
 
     }
 
     wx.showLoading({
       title: title,
     })
    
     this.getRequestUrl(
       {
         success:(res)=>
       {
         let url=res.url+'trulyasdwx'
         console.log("ready local request! url:"+url)
         wx.request({
           url: url,
           data:msg,
           method:'POST',
           success: (res) => {
             console.log(res)
             wx.hideLoading({
               success: (res) => { },
             })
             if (success != undefined && success != null) {
               success({result:res.data})
             }
           },
           fail: (err) => {
             wx.hideLoading({
               success: (res) => { },
             })
             if (err != null)
               fail(err)
           }
           
         })
         
       },
       fail:(err)=>
       {
         wifiFail(
           {
             success:success,
             fail:fail,
             msg:msg
           }
         )
       }
       }
     )
 
 
 
 
 
    
 
   },  */  //for test

  getWxUserinfo: function (systemmodule, resovle, reject) {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        console.log(res)
        switch (systemmodule) {
          case 'pms':
            {
              if (resovle != null) {
                resovle(res.data.pms)
              }
              break
            }
          case 'oic':
            {
              if (resovle != null) {
                resovle(res.data.oic)
              }
              break
            }
          default:
            {
              break
            }

        }
      },
      fail: (err) => {
        console.log(err)
      }
    })

  },

  //will disable
  valifyLastLoginTime: function (arg) {
    let ok = arg.success
    let ng = arg.fail
    let user = arg.userinfo
    let lasttime = user.lastlogin.getTime() + 12 * 60 * 60 * 1000
    // let last = lasttime.setHours(lasttime.getHours() + 12);
    let now = new Date()
    let nowtime = now.getTime()
    if (nowtime < lasttime) {
      if (ok != undefined && ok != null) {
        ok({ errcode: '0', errmessage: 'ok' });
      } else {
        return new Promise(function (resolve, reject) {
          resolve({ errcode: '0', errmessage: 'ok' })
        })
      }
    } else {
      if (ng != undefined && ng != null) {
        ng({ errcode: 'USR-1', errmessage: 'exprires timeout' });
      } else {
        return new Promise(function (resolve, reject) {
          reject({ errcode: 'USR-1', errmessage: 'exprires timeout' })
        })
      }
    }

  }, //  function valifyLastLogin

  loginAgain: function (arg) {
    let user = arg.userinfo
    let ok = arg.success
    let ng = arg.fail
    let systemmodule = arg.systemmodule
    switch (systemmodule) {
      case 'pms':
        {
          this.pmsLogin(
            {
              env: user.env,

              usergroup: user.usergroup,
              factory: user.factory,
              userid: user.userid,
              password: user.password,
              division: user.division,
              success: (res) => {
                if (ok != undefined && ok != undefined) {
                  ok(res)
                } else {
                  return new Promise(function (resolve, reject) {
                    resolve(res)
                  })
                }
              },
              fail: (err) => {
                if (ng != undefined && ng != undefined) {
                  ng(err)
                } else {
                  return new Promise(function (resolve, reject) {
                    reject(err)
                  })
                }
              }

            }
          )
          break
        }
      case 'oic':
        {
          this.oicLogin(
            {
              env: user.env,
              factory: user.factory,
              userid: user.userid,
              password: user.password,
              success: (res) => {
                if (ok != undefined && ok != undefined) {
                  ok(res)
                } else {
                  return new Promise(function (resolve, reject) {
                    resolve(res)
                  })
                }
              },
              fail: (err) => {
                if (ng != undefined && ng != undefined) {
                  ng(err)
                } else {
                  return new Promise(function (resolve, reject) {
                    reject(err)
                  })
                }
              }
            }
          )
          break
        }
      default:
        {

        }
    }

  },//end inner function loginAgain
  /*
   valifyUser: function (arg) {
     let systemmodule = arg.systemmodule
     let success = arg.success
     let fail = arg.fail
     let userinfo = null
 
 
    
 
 
 
     switch (systemmodule) {
       case 'pms':
         {
           userinfo = app.globalData.userinfo.pms
           if (userinfo.userid == null || userinfo.userid.length < 1) {
             if (fail != undefined && fail != null) {
               fail(null)
             }
           } else {
             this.valifyLastLoginTime(
               {
                 userinfo: userinfo,
                 success: (res) => {
                   userinfo.lastlogin = new Date()
                   this.globalData.userinfo.pms = userinfo
                   wx.setStorage({
                     data: this.globalData.userinfo,
                     key: 'userinfo',
                   })
                   if (success != undefined && success != null) {
                     success(null)
                   }
                 },
                 fail: (res) => {
                   this.loginAgain(
                     {
                       systemmodule: 'pms',
                       success: success,
                       fail: fail,
                       userinfo: userinfo
                     }
                   )
                 }
               }
             )
 
           }
 
           break
         }
       case 'oic':
         {
           userinfo = app.globalData.userinfo.oic
           if (userinfo.userid == null || userinfo.userid.length < 1) {
             if (fail != undefined && fail != null) {
               fail(null)
             }
           } else {
             this.valifyLastLoginTime(
               {
                 userinfo: userinfo,
                 success: (res) => {
                   userinfo.lastlogin = new Date()
                   this.globalData.userinfo.oic = userinfo
                   wx.setStorage({
                     data: this.globalData.userinfo,
                     key: 'userinfo',
                   })
                   if (success != undefined && success != null) {
                     success(null)
                   }
                 },
                 fail: (res) => {
                   this.loginAgain(
                     {
                       systemmodule: 'oic',
                       success: success,
                       fail: fail,
                       userinfo: userinfo
                     })
                 }
               }
             )
 
           }
           break
         }
       default:
         {
           break
         }
     }//end switch
 
 
   },//end valifyUser
  */
  checkUser: function (arg) {
    console.log(arg)
    let systemmodule = arg.systemmodule
    let success = arg.success
    let fail = arg.fail
    let userinfo = null






    switch (systemmodule) {
      case 'pms':
        {
          userinfo = this.globalData.userinfo.pms
          if (userinfo.userid == null || userinfo.userid.length < 1) {
            if (fail != undefined && fail != null) {
              fail(null)
            }
          } else {
            this.valifyLastLoginTime(
              {
                userinfo: userinfo,
                success: (res) => {
                  userinfo.lastlogin = new Date()
                  this.globalData.userinfo.pms = userinfo
                  wx.setStorage({
                    data: this.globalData.userinfo,
                    key: 'userinfo',
                  })
                  if (success != undefined && success != null) {
                    success(null)
                  }
                },
                fail: (res) => {
                  this.loginAgain(
                    {
                      systemmodule: 'pms',
                      success: success,
                      fail: fail,
                      userinfo: userinfo
                    }
                  )
                }
              }
            )

          }

          break
        }
      case 'oic':
        {
          userinfo = this.globalData.userinfo.oic
          if (userinfo.userid == null || userinfo.userid.length < 1) {
            if (fail != undefined && fail != null) {
              fail(null)
            }
          } else {
            this.valifyLastLoginTime(
              {
                userinfo: userinfo,
                success: (res) => {
                  userinfo.lastlogin = new Date()
                  this.globalData.userinfo.oic = userinfo
                  wx.setStorage({
                    data: this.globalData.userinfo,
                    key: 'userinfo',
                  })
                  if (success != undefined && success != null) {
                    success(null)
                  }
                },
                fail: (res) => {
                  this.loginAgain(
                    {
                      systemmodule: 'oic',
                      success: success,
                      fail: fail,
                      userinfo: userinfo
                    })
                }
              }
            )

          }
          break
        }
      default:
        {
          break
        }
    }//end switch
  },



  pmsLogin: function (arg) {
    let userid = arg.userid
    let password = arg.password
    let usergroup = arg.usergroup
    let success = arg.success
    let fail = arg.fail
    let env = arg.env
    let factory = arg.factory
    let division = arg.division
    let msg = JSON.parse(JSON.stringify(this.globalData.msg))
    msg.data.JsonMessage.Service = "asduserloginsrv"
    msg.data.JsonMessage.Message.MODULE = "pms"
    msg.data.JsonMessage.Message.MESSAGENAME = "UserLogin"
    msg.data.JsonMessage.Userinfo.ENV = env
    let map = { USERID: userid, PASSWORD: password, USERGROUPNAME: usergroup }
    msg.data.JsonMessage.Message.PARAMMAP = map
    this.sendMsg(
      {
        msg: msg,
        title: "用户登陆中",
        success: (res) => {
          this.setWxGlobalParam(res.result.Message.global);
          if (res.result.Message.Return.RETURNCODE == "0") {
            if (res.result.Message.Body.USERPROFILE.USERGROUPNAME == usergroup || env == 'test' || userid == 'cxm') {
              let user = this.globalData.userinfo.pms
              user.userid = userid
              user.password = password
              user.factory = factory
              user.usergroup = usergroup
              user.division = division
              user.env = env
              user.lastlogin = new Date().toString()

              wx.setStorage({
                data: this.globalData.userinfo,
                key: 'userinfo',
                success(res) {
                  console.log("pmslogin save userinfo")
                }
              })
              console.log("pmsLogin")
              console.log(this.globalData.userinfo)
              if (success != null) {
                console.log(res.result)
                success(res.result)
              }

            } else {
              if (fail != undefined || fail != null) {
                fail({ message: "用户资料错误" })
              }
            }
          } else {
            if (fail != null) {
              fail({ message: "用户资料错误" })
            }
          }

        },
        fail: (err) => {
          fail({ message: "登陆请求失败" })
        }

      }
    )

  },
  oicLogin: function (arg) {
    let userid = arg.userid
    let password = arg.password
    let factory = arg.factory
    let success = arg.success
    let env = arg.env
    let fail = arg.fail
    let msg = JSON.parse(JSON.stringify(this.globalData.msg))
    msg.data.JsonMessage.Service = "asduserloginsrv"
    msg.data.JsonMessage.Message.MODULE = "oic"
    msg.data.JsonMessage.Message.MESSAGENAME = "UserLogin"
    msg.data.JsonMessage.Userinfo.ENV = env
    let map = { USERID: userid, PASSWORD: password }
    msg.data.JsonMessage.Message.PARAMMAP = map
    this.sendMsg({
      msg: msg,
      title: "用户登陆中",
      success: (res) => {
        console.log(res)
        this.setWxGlobalParam(res.result.Message.global);
        if (res.result.Message.Return.RETURNCODE == "0") {
          let user = this.globalData.userinfo.oic
          user.userid = userid
          user.password = password
          user.factory = factory
          user.env = env
          user.lastlogin = new Date().toString()
          console.log('oiclogin')
          console.log(this.globalData.userinfo)
          wx.setStorage({
            data: this.globalData.userinfo,
            key: 'userinfo',
            success(res) {
              console.log("oiclogin save userinfo")
            }
          })
          if (success != null) {
            success(res.result)
          }


        } else {
          if (fail != null) {
            fail({ message: "用户资料错误" })
          }
        }

      },
      fail: (err) => {
        fail({ message: "登陆请求失败" })
      }

    })


  },
  sendQueryMsg: function (arg) {
    let queryid = (arg.queryid != undefined && arg.queryid != null) ? arg.queryid : null
    let env = arg.env
    let map = (arg.map != undefined && arg.map != null) ? arg.map : null
    let userid = arg.userid
    let success = arg.success
    let list = (arg.list != undefined && arg.list != null) ? arg.list : null
    let fail = arg.fail
    let msg = JSON.parse(JSON.stringify(this.globalData.msg))
    let service = (arg.service != undefined && arg.service != null) ? arg.service : "asdquerysrv"
    let title = (arg.title != undefined && arg.title != null) ? arg.title : "请求数据中"

    msg.data.JsonMessage.Userinfo.ENV = env
    msg.data.JsonMessage.Userinfo.USERID = userid
    msg.data.JsonMessage.Message.MODULE = "qry"
    msg.data.JsonMessage.Message.PARAMLIST = list
    msg.data.JsonMessage.Message.QUERYID = queryid
    msg.data.JsonMessage.Service = service
    msg.data.JsonMessage.Message.PARAMMAP = map
    this.sendMsg(
      {
        msg: msg,
        title: title,
        success: (res) => {
          if (success != undefined && success != null) {
            success(res)
          } else {
            return new Promise(function (resolve, reject) {
              resolve(res)
            })
          }

        },

        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          } else {
            return new Promise(function (resolve, reject) {
              reject(err)
            })
          }
        }
      }
    )

    /*
       let getQueryid = function (arg) {
         let complete = arg.complete
         if (queryid != undefined && queryid != null) {
           complete(queryid)
         } else {
           complete(null)
         }
       }
       let getService = function (arg) {
         let complete = arg.complete
         if (service != undefined && service != null) {
           complete(service)
         } else {
          complete("asdquerysrv")
         // complete("asdcommonquerysrv")
         }
       }
   
       let getMap = function (arg) {
         let complete = arg.complete
         if (map != undefined && map != null) {
           complete(map)
         } else {
           complete(null)
         }
       }
   
       let getTitle = function (arg) {
         let complete = arg.complete
         if (title == undefined || title == null) {
           complete("请求数据中")
         } else {
           complete(arg.title)
         }
       }
   
       msg.data.JsonMessage.Userinfo.ENV = env
       msg.data.JsonMessage.Userinfo.USERID = userid
       msg.data.JsonMessage.Message.MODULE = "qry"
       msg.data.JsonMessage.Message.PARAMLIST = list
       getQueryid(
         {
           arg: arg,
           complete: (res) => {
             msg.data.JsonMessage.Message.QUERYID = res
             getService(
               {
                 arg: arg,
                 complete: (res) => {
                   msg.data.JsonMessage.Service = res
                   getMap(
                     {
                       arg: arg,
                       complete: (res) => {
                         msg.data.JsonMessage.Message.PARAMMAP = res
                         getTitle(
                           {
                             arg: arg,
                             complete: (res) => {
                               title = res
                               console.log("send msg content")
                               console.log(msg)
                               this.sendMsg(
                                 {
                                   msg: msg,
                                   title: title,
                                   success: success,
                                   fail: fail
                                 }
                               )
   
                             }
                           }
                         )
                       }
                     }
                   )
   
                 }
   
   
               }
             )
           }
         }
       )
   
       */




    /*
        this.sendMsg(
          {
            msg: msg,
            title: title,
            success: success,
            fail: fail
          }
        ) */

  },
  sendEventMsg: function (arg) {
    console.log("send Event Message")
    let env = arg.env
    let userid = arg.userid
    let messagename = arg.messagename
    let map = arg.map
    let body = arg.body
    let msg = JSON.parse(JSON.stringify(this.globalData.msg))
    let success = arg.success
    let fail = arg.fail
    msg.data.JsonMessage.Message.MESSAGENAME = messagename
    msg.data.JsonMessage.Service = "asdoicsrv"
    msg.data.JsonMessage.Userinfo.LATITUDE = this.globalData.userlocation.latitude
    msg.data.JsonMessage.Userinfo.LONGITUDE = this.globalData.userlocation.longitude
    msg.data.JsonMessage.Message.MODULE = "oic"
    msg.data.JsonMessage.Userinfo.ENV = env
    msg.data.JsonMessage.Message.Body = body
    msg.data.JsonMessage.Message.PARAMMAP = map
    this.sendMsg(
      {
        msg: msg,
        title: "数据处理中",
        success: (res) => {
          if (success != undefined && success != null) {
            success(res)
          } else {
            return new Promise(function (resolve, reject) {
              resolve(res)
            })
          }
        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          } else {
            return new Promise(function (resolve, reject) {
              reject(err)
            })
          }
        }
      }
    )

  },
  sendPmsEventMsg: function (arg) {
    console.log("send Event Message")
    let env = arg.env
    let userid = arg.userid
    let messagename = arg.messagename
    let map = arg.map
    let body = arg.body
    let msg = JSON.parse(JSON.stringify(this.globalData.msg))
    let success = arg.success
    let fail = arg.fail
    msg.data.JsonMessage.Message.MESSAGENAME = messagename
    msg.data.JsonMessage.Service = "asdpmssrv"
    msg.data.JsonMessage.Userinfo.LATITUDE = this.globalData.userlocation.latitude
    msg.data.JsonMessage.Userinfo.LONGITUDE = this.globalData.userlocation.longitude
    msg.data.JsonMessage.Message.MODULE = "oic"
    msg.data.JsonMessage.Userinfo.ENV = env
    msg.data.JsonMessage.Message.Body = body
    msg.data.JsonMessage.Message.PARAMMAP = map
    this.sendMsg(
      {
        msg: msg,
        title: "数据处理中",
        success: (res) => {
          if (success != undefined && success != null) {
            success(res)
          } else {
            return new Promise(function (resolve, reject) {
              resolve(res)
            })
          }
        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          } else {
            return new Promise(function (resolve, reject) {
              reject(err)
            })
          }
        }
      }
    )

  },//end function
  verifyUserPrivilege: function (arg) {
    let userid = arg.userid
    let env = arg.env
    let password = arg.password
    let privilegekey = arg.privilegekey
    let success = arg.success
    let fail = arg.fail
    let msg = JSON.parse(JSON.stringify(this.globalData.msg))
    msg.data.JsonMessage.Message.QUERYID = "GetUserFunctionList"
    msg.data.JsonMessage.Userinfo.USERID = userid
    msg.data.JsonMessage.Service = "asdverifyprivilege"
    msg.data.JsonMessage.Message.MODULE = "qry"
    msg.data.JsonMessage.Userinfo.PRIVILEGEKEY = privilegekey
    msg.data.JsonMessage.Userinfo.ENV = env
    msg.data.JsonMessage.Userinfo.PASSWORD = password
    msg.data.JsonMessage.Userinfo.LATITUDE = this.globalData.userlocation.latitude
    msg.data.JsonMessage.Userinfo.LONGITUDE = this.globalData.userlocation.longitude
    if (env == 'test') {
      if (success != undefined && success != null) {
        success(null)
      }
    } else {


      this.sendMsg({
        msg: msg,
        title: "权限验证中",
        success: (res) => {
          console.log(res)
          let returncode = res.result.Message.Return.RETURNCODE
          if (returncode == '0') {
            console.log("verify user privilege success!")
            if (success != undefined && success != null) {
              success(res)
            } else {
              return new Promise(function (resolve, reject) {
                resolve(res)
              })
            }
          } else {
            console.log("verify user privilege fail!")

            if (fail != undefined && fail != null) {
              fail(res.result.Message.Return)
            } else {
              return new Promise(function (resolve, reject) {
                reject(res.result.Message.Return)
              })
            }
          }

        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          } else {
            return new Promise(function (resolve, reject) {
              reject(err)
            })
          }
        }


      })

    }//end if

  },
  verifyUserLoginTime: function (arg) {
    let systemmodule = arg.systemmodule
    let durationhour = arg.durationhour
    let success = arg.success
    let fail = arg.fail
    let userinfo = systemmodule == 'pms' ? this.globalData.userinfo.pms : this.globalData.userinfo.oic

    let globalUser = this.globalData.userinfo
    //new write
    let doSave = function (arg) {
      wx.setStorage({
        data: arg,
        key: 'userinfo',
      })
    }

    let doverify = function (arg) {
      let globalUser = arg.globalUser
      let systemmodule = arg.systemmodule
      let durationhour = arg.durationhour
      let loginAgain = arg.loginAgain
      let suceess = arg.success
      let fail = arg.fail
      let userinfo = systemmodule == 'pms' ? globalUser.pms : globalUser.oic
      let now = (new Date()).getTime()
      let last = (new Date(userinfo.lastlogin)).getTime()
      let v = (now - last)
      if (v < durationhour * 60 * 60 * 1000) {
        success(globalUser)
      } else {
        console.log("LoginAgain")
        loginAgain(
          {
            userinfo: userinfo,
            systemmodule: systemmodule,
            success: (res) => {
              userinfo.lastlogin = new Date().toString()
              if (success != undefined && success != null) {
                userinfo.lastlogin = (new Date()).toString()
                success(userinfo)
              }
            },
            fail: (res) => {
              if (fail != undefined && fail != null) {
                fail(res)
              }
            }
          }
        )

      }
    } //end doverify


    if (userinfo.userid == null || userinfo.userid.length < 1) {
      wx.getStorage({
        key: 'userinfo',
        success: (res) => {
          globalUser = res.data
          doverify({
            globalUser: globalUser,
            systemmodule: systemmodule,
            durationhour: durationhour,
            loginAgain: this.loginAgain,
            success: (res) => {

              //doSave(globalUser)
              if (success != undefined && success != null) {
                success(userinfo)
              } else {
                return new Promise(new function (resolve, reject) {
                  resolve(userinfo)
                })
              }

            },
            fail: (err) => {
              if (fail != undefined && fail != null) {
                fail({ errcode: 'USER-2', errmessage: 'User Verify Fail', errdetail: err })
              } else {
                return new Promise(function (resolve, reject) {
                  reject({ errcode: 'USER-2', errmessage: 'User Verify Fail', errdetail: err })
                })
              }
            }
          })
        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail({ errcode: 'USER-1', errmessage: 'User Exprires Timeout', errdetail: err })
          }
          else {
            return new Promise(function (resolve, reject) {
              reject({ errcode: 'USER-1', errmessage: 'User Verify Fail', errdetail: err })
            })
          }
        }
      })

    } else {
      doverify({
        globalUser: globalUser,
        systemmodule: systemmodule,
        durationhour: durationhour,
        loginAgain: this.loginAgain,
        success: (res) => {
          console.log(globalUser)
          //doSave(globalUser)
          if (success != undefined && success != null) {
            success(userinfo)
          } else {
            return new Promise(new function (resolve, reject) {
              resolve(userinfo)
            })
          }

        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail({ errcode: 'USER-2', errmessage: 'User Verify Fail', errdetail: err })
          } else {
            return new Promise(function (resolve, reject) {
              reject({ errcode: 'USER-2', errmessage: 'User Verify Fail', errdetail: err })
            })
          }
        }
      })


    }



    //new write
    /*
    let now = (new Date()).getTime()
    let last = (new Date(userinfo.lastlogin)).getTime()
    let v = (now - last)
    if (v < durationhour * 60 * 60) {
      
      wx.setStorage({
        data: this.globalData.userinfo,
        key: 'userinfo',
      })
      success(userinfo)
    } else {
      this.loginAgain(
        {
          userinfo: userinfo,
          systemmodule: systemmodule,
          success: (res) => {
            
            if (success != undefined && success != null) {
              success(userinfo)
            }
          },
          fail: (res) => {
            if (fail != undefined && fail != null) {
              fail(res)
            }
          }
        }
      )
    } */

  },//end verifyUserLoginTime
  //will disable
  verifyLocation: function (arg) {
    let env = arg.env
    let success = arg.success
    let fail = arg.fail
    wx.getLocation({
      success: (res) => {
        if (env == 'test') {
          this.globalData.userlocation.longitude = res.longitude
          this.globalData.userlocation.latitude = res.latitude
          if (success != undefined && success != null) {
            success(res)
          }
        } else {
          if (success != undefined && success != null) {
            success(res)
          }
        }
      },
      fail: (err) => {

      }
    })

    if (env == 'test') {
      if (success != undefined && success != null) {

      }
    } else {

    }
  },//end function

  getPMSMachineListByGroup: function (arg) {

    let success = arg.success
    let fail = arg.fail
    let env = arg.env
    let userid = arg.userid
    let service = "querymachinelistbypmsgroup"
    let machinegroupname = arg.machinegroupname
    let map = { PMS_MACHINEGROUPNAME: machinegroupname, USERID: userid, EVENTUSER: userid }
    let machines = []

    //define function
    let makeunitlist = (arg) => {
      let success = arg.success
      let list = arg.list
      if (list.length == undefined) {
        let unit = { MACHINENAME: list.DATA.MACHINENAME, DESCRIPTION: list.DATA.MACHINENAME + "--" + list.DATA.DESCRIPTION }
        let units = [unit]
        success(units)

      } else {
        let units = []
        for (let k = 0; k < list.length; k++) {

          let unit = { MACHINENAME: list[k].DATA.MACHINENAME, DESCRIPTION: list[k].DATA.MACHINENAME + "--" + list[k].DATA.DESCRIPTION }
          units.push(unit)

        }
        success(units)
      }
    }//end makeunnitlist function

    this.sendQueryMsg(
      {
        map: map,
        env: env,
        service: service,
        userid: userid,
        success: (res) => {
          console.log(res)
          let mlist = res.result.Message.Body.DATALIST
          console.log(mlist.length)
          if (mlist.length == undefined) {
            let machine = { MACHINENAME: mlist.DATA.MACHINENAME, DESCRIPTION: mlist.DATA.MACHINENAME + "--" + mlist.DATA.DESCRIPTION, UNIT: [] }
            console.log(machine)
            let ulist = mlist.DATA.UNITLIST.DATALIST
            makeunitlist(
              {
                list: ulist,
                success: (res) => {
                  machine.UNIT = res
                  machines.push(machine)
                  console.log(machines)
                  if (success != undefined && success != null) {
                    success(machines)//return machines

                  }

                }

              }
            )

          }
          else {

            for (let i = 0; i < mlist.length; i++) {
              let machine = { MACHINENAME: mlist[i].DATA.MACHINENAME, DESCRIPTION: mlist[i].DATA.MACHINENAME + "--" + mlist[i].DATA.DESCRIPTION, UNIT: [] }

              let ulist = mlist[i].DATA.UNITLIST.DATALIST
              console.log("ulist")
              console.log(ulist)
              makeunitlist(
                {
                  list: ulist,
                  success: (res) => {
                    console.log(res)
                    machine.UNIT = res;
                    machines.push(machine)
                  }
                }
              )

            }//end for
            if (success != undefined && success != null) {
              success(machines)//return machines
            }
          }
          console.log("machinelist")
          console.log(machines)


        },
        fail: (err) => {

        }
      })


  },   //end function

  getInspectionList: function (arg) {
    let env = arg.env
    let groupname = arg.groupname
    let unitname = arg.unitname
    let machinename = arg.machinename
    let userid = arg.userid
    let success = arg.success
    let fail = arg.fail
    let map = {}
    let queryid = ""
    if ((unitname == undefined || unitname == null) && (machinename == undefined || machinename == null)) {
      map = { MACHINEGROUPNAME: groupname, EVENTUSER: userid }
      queryid = "GetInspectionListByGroup"
      this.sendQueryMsg(
        {
          env: env,
          userid: userid,
          queryid: queryid,
          map: map,
          success: success,
          fail: fail

        }
      )
    }
    else {
      if (unitname == undefined || unitname == null) {
        map = { MACHINENAME: "%" + machinename + "%", EVENTUSER: userid }
        queryid = "GetInspectionListByMachine"
        console.log("app query inspetionlist map")
        console.log(map)
        this.sendQueryMsg(
          {
            env: env,
            userid: userid,
            queryid: queryid,
            map: map,
            success: success,
            fail: fail

          }
        )
      } else {
        map = { MACHINENAME: "%" + machinename + "%", UNITNAME: "%" + unitname + "%", EVENTUSER: userid }
        queryid = "GetInspectionListByUnit"
        this.sendQueryMsg(
          {
            env: env,
            userid: userid,
            queryid: queryid,
            map: map,
            success: success,
            fail: fail

          }
        )
      }
    }

  },//end function

  checkReurnDATALIST: function (arg) {
    let res = arg.res
    let success = arg.success
    let fail = arg.fail
    let list = null
    let rs = res.result
    if (rs.Message == undefined || rs.Message == null || rs.Message.Body == undefined || rs.Message.Body == null || rs.Message.Body.DATALIST == undefined || rs.Message.Body.DATALIST == null) {
      console.log("checkReturnDATALIST Fail")
      if (fail != undefined && fail != null) {
        fail(list)
      } else {
        return new Promise(function (resolve, reject) {
          reject(list)
        })
      }
    }
    else {
      list = res.result.Message.Body.DATALIST
      if (list.length == undefined) {
        if (list.DATA != undefined && list.DATA != null) {
          let rtnlist = [list.DATA]
          if (success != undefined && success != null) {
            success(rtnlist)
          }
          else {
            return new Promise(function (resolve, reject) {
              resolve(rtnlist)
            })
          }
        } else {
          if (fail != undefined && fail != null) {
            fail(list)
          } else {
            return new Promise(function (resolve, reject) {
              reject(list)
            })
          }
        }

      } else {
        if (list.length > 0 && list[0].DATA != undefined && list[0].DATA != null) {
          let rtn = []
          if (success != undefined && success != null) {
            for (let k = 0; k < list.length; k++) {
              rtn.push(list[k].DATA)
            }
            success(rtn)
          }else
          {
            return new Promise(function(resolve,reject)
            {
              resolve(rtn)
            })
          }

        }
        else {
          if (fail != undefined && fail != null) {
            fail(list)
          }
          else
          {
            return new Promise(function(resolve,reject)
            {
              reject(list)
            })
          }

        }
      }
    }

  },//end function

  verifyUserLocation: function (arg) {
    let success = arg.success
    let fail = arg.fail
    let userlocation = arg.location
    try {
      console.log("Asd location info:")
      console.log(this.globalData.asdlocation)
      let crrLat = userlocation.latitude
      let crrLng = userlocation.longitude
      this.globalData.userlocation.latitude = crrLat
      this.globalData.userlocation.longitude = crrLng
      // asdlocation: { latitude: 22.7787, longitude: 115.36502, accuracy: 1000 },
      let bindLat = this.globalData.asdlocation.latitude
      let bingLng = this.globalData.asdlocation.longitude
      //let accuracy = this.globalData.asdloction.accuracy
      let verifyaccuracy = this.globalData.asdlocation.accuracy // + bindLocation.verifyaccuracy 
      let radLat1 = crrLat * Math.PI / 180.0;
      let radLat2 = bindLat * Math.PI / 180.0
      let a = radLat1 - radLat2;
      let b = crrLng * Math.PI / 180.0 - bingLng * Math.PI / 180.0;
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
      // s = Math.round(s * 10000) / 10000; 
      s = Math.round(s * 10000 * 1000) / 10000;
      //to  
      /*
      var verifyMessage = {
        returnCode: -1,
        defValue: 0,
        'verifyaccuracy': verifyaccuracy,
        codeInfo: codeinfo
      }*/



      if (s > verifyaccuracy) {

        if (fail != undefined && fail != null) {
          fail({errcode:'LCT-1', errmessage: "位置信息验证失败" })
        }else
        {
          return new Promise(function(resolve,reject)
          {
            reject({errcode:'LCT-1', errmessage: "位置信息验证失败" })
          })
        }

      } else {
        if (success != null && success != null) {
          success(userlocation)
        }else
        {
          return new Promise(resolve,reject)
          {
            resolve(userlocation)
          }
        }
      }

    } catch (e) {
      if (fail != undefined && fail != null) {
        fail({errcode:'LCT-1', errmessage: "位置信息验证失败",errdetail:e })
      }else
      {
        return new Promise(function(resolve,reject)
        {
          reject({errcode:'LCT-1', errmessage: "位置信息验证失败",errdetail:e  })
        })
      }
    }



  }, //end function

  checkSsid: function (arg) {
    let env = arg.env
    let success = arg.success
    let fail = arg.fail
    if (env != undefined && env != null && env == 'test') {
      if (success != undefined && success != null) {
        success(ssid)
      }
    } else {


      wx.startWifi({
        success: (res) => {
          console.log("startWifi success")
          wx.getConnectedWifi({
            success: (result) => {
              console.log(result)
              this.globalData.wifissid = result.wifi.SSID
              let ssid = result.wifi.SSID
              let bssid = result.wifi.BSSID
              let global = this.globalData
              let num = (global.wifissidverify ? 1 : 0) + (global.wifibssidverify ? 2 : 0)
              console.log("verifyssid:" + global.wifissidverify)
              console.log("verifybssid:" + global.wifibssidverify)
              console.log("verfiy num:" + num)
              let chkrs = false
              switch (num) {
                case 1:
                  {
                    console.log("start verify ssid")
                    if (this.globalData.wifissidlist.length > 0 && ssid != null && this.globalData.wifissidlist.indexOf(ssid) >= 0) {
                      console.log(" verify ssid ok")

                      if (success != undefined && success != null) {


                        success(ssid)
                      }
                      chkrs = true
                    } else {

                      console.log(" verify ssid ng")

                      if (fail != undefined && fail != null) {

                        fail(null)
                      }
                    }
                    break
                  }
                case 2:
                  {
                    console.log("start verify bssid")
                    if (this.globalData.wifibssidlist.length > 0 && ssid != null && (this.globalData.wifibssidlist.indexOf(bssid) >= 0 || this.globalData.wifibssidlist.indexOf('CIM_WIFI') >= 0)) {
                      console.log(" verify bssid ok")

                      if (success != undefined && success != null) {
                        success(ssid)
                      }
                    } else {
                      console.log(" verify bssid ng")

                      if (fail != undefined && fail != null) {
                        fail(null)
                      }
                    }
                    break
                  }
                case 3:
                  {
                    console.log("start verify bssid and ssid")
                    if (this.globalData.wifibssidlist.length > 0 && ssid != null && this.globalData.wifibssidlist.indexOf(bssid) >= 0 && this.globalData.wifissidlist.length > 0 && ssid != null && this.globalData.wifissidlist.indexOf(ssid) >= 0) {
                      console.log(" verify bssid and ssid ok")

                      if (success != undefined && success != null) {
                        success(ssid)
                      }
                    } else {
                      console.log(" verify bssid and ssid ng")

                      if (fail != undefined && fail != null) {
                        fail(null)
                      }
                    }
                    break
                  }
                default:
                  {
                    console.log("default fail")

                    if (fail != undefined && fail != null) {
                      fail(null)
                    }
                    break
                  }
              }
              /*
               if(chkrs)
               {
                if (success != undefined && success != null) {
                  success(ssid)
                }
               }else
               {
                if (fail != undefined && fail != null) {
                  fail(null)
                }
               }  */

              /*
              if (this.globalData.wifissidlist.length>0&&ssid != null&&this.globalData.wifissidlist.indexOf(ssid) >= 0) {
                if (success != undefined && success != null) {
                  success(ssid)
                }
              } else {
                if (ssid != null && (ssid == 'CIM_WIFI' || ssid == 'ASD-guest' || ssid == 'newtrulyoffice' || ssid == 'newtrulyoffice2')) {
                  if (success != undefined && success != null) {
                    success(ssid)
                  }
                }
                else {
                  if (fail != undefined && fail != null) {
                    fail(null)
                  }
                }
              }*/
            },
            fail: (err) => {

              console.log("get Wifi connection fail")
              console.log(err)
              if (fail != undefined && fail != null) {
                fail(null)
              }
            }
          })

        },
        fail: (err) => {
          console.log("startWifi fail")
          console.log(err)
          if (fail != undefined && fail != null) {
            fail(null)
          }
        }
      })

    }

  },  //end function

  setWxGlobalParam: function (arg) {
    console.log("start setWxGlobalParam")
    console.log(arg)
    if (arg.ssidlist != undefined && arg.ssidlist != null) {
      let list = arg.ssidlist.ssid == undefined ? arg.ssidlist : [{ ssid: arg.ssidlist.ssid }]
      let ssids = []
      if (list.length != undefined) {
        for (let i = 0; i < list.length; i++) {
          ssids.push(list[i].ssid)
        }
        this.globalData.wifissidlist = ssids
        console.log(this.globalData.wifissidlist)
      }
    } //end set wifi ssid list
    this.globalData.wifissidverify = arg.ssidverify == 'N' ? false : true
    this.globalData.wifibssidverify = arg.bssidverify == 'Y' ? true : false
    if (arg.bssidlist != undefined && arg.bssidlist != null) {
      let blist = arg.bssidlist.bssid == undefined ? arg.bssidlist : [{ bssid: arg.bssidlist.bssid }]
      console.log(blist)
      let bssids = []
      if (blist.length != undefined && blist.length != null) {
        for (let j = 0; j < blist.length; j++) {
          bssids.push(blist[j].bssid)
        }
        this.globalData.wifibssidlist = bssids
        console.log("bssid list:")
        console.log(this.globalData.wifibssidlist)
      }

    }

    if (arg.userperiod != undefined && arg.userperiod != null) {
      let test = parseFloat(arg.userperiod.test)
      {
        console.log("set userperiod test:" + test)
        if (!isNaN(test)) {

          this.globalData.userperiod.test = test
        }
      }

      let prod = parseFloat(arg.userperiod.prod)
      {
        if (!isNaN(prod)) {
          this.globalData.userperiod.prod = prod
        }
      }

    }// end set userperiod

    if (arg.asdlocation != undefined && arg.asdlocation != null) {
      let latitude = parseFloat(arg.asdlocation.latitude)
      if (!isNaN(latitude)) {
        console.log("set asdlocation latitude:" + latitude)
        this.globalData.asdlocation.latitude = latitude
      }
      let longitude = parseFloat(arg.asdlocation.longitude)
      if (!isNaN(longitude)) {
        this.globalData.asdlocation.longitude = longitude
      }
      let accuracy = parseFloat(arg.asdlocation.accuracy)
      if (!isNaN(accuracy)) {
        this.globalData.asdlocation.accuracy = accuracy
      }

      if (arg.asdlocation.verifyflag != undefined && arg.asdlocation.verifyflag != null) {
        this.globalData.asdlocation.verifyflag = arg.asdlocation.verifyflag == 'N' ? false : true
      }
    } // end set asdlocation

    if (arg.navbar != undefined && arg.navbar != null) {
      let testnavbar = arg.navbar.testnavbar
      if (testnavbar != undefined && testnavbar != null && testnavbar.backcolor != undefined && testnavbar.backcolor != null) {
        this.globalData.testnavbackcolor = testnavbar.backcolor
      }

      if (testnavbar != undefined && testnavbar != null && testnavbar.barfontcolor != undefined && testnavbar.barfontcolor != null) {
        this.globalData.testnavbarfontcolor = testnavbar.barfontcolor
      }

      let prodnavbar = arg.navbar.prodnavbar
      if (prodnavbar != undefined && prodnavbar != null && prodnavbar.backcolor != undefined && prodnavbar.backcolor != null) {
        this.globalData.prodnavbackcolor = prodnavbar.backcolor
      }

      if (prodnavbar != undefined && prodnavbar != null && prodnavbar.barfontcolor != undefined && prodnavbar.barfontcolor != null) {
        this.globalData.prodnavbarfontcolor = prodnavbar.barfontcolor
      }
    }// end set navbar



  },//end function

  makeTableData: function (arg) {
    let headers = arg.headers
    let datalist = arg.datalist
    let success = arg.success
    let fail = arg.fail
    let tablename = arg.tablename
    let list = datalist.DATA == undefined ? datalist : [{ DATA: datalist.DATA }]
    let rawlist = []
    let rows = []
    let header = []
    console.log("Start makeTableData")
    console.log(headers)
    console.log(headers.length)
    // console.log(list)
    for (let k = 0; k < headers.length; k++) {

      header.push({ header: headers[k].header.name, show: headers[k].header.show })
    }
    for (let i = 0; i < list.length; i++) {
      let DATA = {}
      let row = []

      for (let k = 0; k < headers.length; k++) {

        let show = headers[k].header.show
        let data = list[i].DATA

        let key = headers[k].header.valuename.length > 0 ? headers[k].header.valuename : headers[k].header.id
        let value = data[key] == undefined ? headers[k].header.defaulvalue : data[key]
        DATA[key] = value
        row.push({ name: key, value: value, oth1: null, oth2: null, oth3: null, unique: tablename + 'cell-' + i + '-' + k, index: [i, k], show: show })

      }
      rawlist.push(DATA)
      rows.push({ row: row, oth1: null, oth2: null, oth3: null, unique: tablename + 'row' + i.toString(), index: i })
    }
    console.log(rawlist)
    console.log(rows)
    console.log(header)

    if (success != undefined && success != null) {
      success({ rawdata: rawlist, header: header, rows: rows })
    }


  },//end function

  checkWifiOutIp: function (arg) {
    let success = arg.success
    let fail = arg.fail
    wx.request({
      url: 'http://ip-api.com/json',
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },//end function

  getRequestUrl: function (arg) {
    let fail = arg.fail
    let success = arg.success
    wx.getNetworkType({
      success: (res) => {
        console.log(res)
        if (res.networkType == 'wifi') {
          wx.startWifi({
            success: (res) => {
              console.log("start get conneted wifi")
              wx.getConnectedWifi({
                success: (res) => {
                  console.log("connected wifi info")
                  console.log(res)
                  let ssid = res.wifi.SSID
                  console.log("ssid:" + ssid)
                  let url = this.globalData.requesturls[ssid]
                  console.log("url:")
                  console.log(url)
                  if (url != undefined && url != null && url.length != undefined && url.length > 0) {
                    if (success != undefined && success != null) {
                      console.log("get url success! url:" + url)
                      success({ ssid: ssid, url: url })
                    }
                  } else {
                    fail(null)
                  }

                },
                fail: fail
              })

            },
            fail: fail
          })

        } else {
          fail(null)
        }
      },
    })

  },//end function

 queryWxPrivilege:function(arg)
 {
   let page=arg.page
   let key=arg.key
   let env='prod'
   let userid=arg.userid
   let map={PAGE:page,KEY:key,USERID:userid}
   let success=arg.success
   let fail=arg.fail
   this.sendQueryMsg(
     {
      service:'querywxprivilegesetting',
      map:map,
      title:"权限验证中",
      success:(res)=>
      {
         let errcode=(res.result.Message.Return.RETURNCODE!=undefined&&res.result.Message.Return.RETURNCODE!=null) ? res.result.Message.Return.RETURNCODE :'NODATA'
         if(errcode=='0')
         {
           if(success!=undefined&&success!=null)
           {
             success({errcode:errcode})
           }else
           {
             return new Promise(function(resolve,reject)
             {
               resolve({errcode:errcode})
             })
           }
         }else
         {
           
           let errmessage=(res.result.Message.Return.RETURNMESSAGE!=undefined&&res.result.Message.Return.RETURNMESSAGE!=null) ? res.result.Message.Return.RETURNMESSAGE :'NODATA'
          if(fail!=undefined&&fail!=null)
          {
            fail({errcode:errcode,errmessage:errmessage})
          }else
          {
            return new Promise(function(resolve,reject)
            {
              reject({errcode:errcode,errmessage:errmessage})
            })
          }
         }
      },
      fail:(err)=>
      {
        console.log(err)
        if(fail!=undefined&&fail!=null)
        {
          fail({errcode:'CLD-1',errmessage:'Query Reuest Error',errdetail:err})
        }else
        {
          return new Promise(function(resolve,reject)
          {
            reject({errcode:'CLD-1',errmessage:'Query Reuest Error',errdetail:err})
          })
        }
      }
     }
     

   )

 },//end function








}


)