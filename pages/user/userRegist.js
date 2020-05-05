// miniprogram/pages/userRegist/userRegist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userIdErr: false,
    usernameErr: false,
    mobileErr: false,
    fabErr: false,
    deptErr: false,
    roleErr: false,

    fabs: ['ARRAY', 'CELL', 'CF', 'OTHER'],
    //fabs:[{id:'ARRAY',name:'array'},{id:'CELL',name:'cell'}],
    index: null,

    currDepts: [],
    deptIndex: null,

    roleIndex: null,
    roleInfo: null,
    deptInfo: null,

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    userid: '',
    username: '',
    mobile: '',
    fab: '',
    errorcolor: null,
    errmsg: '',

    appUserInfo: {
      _id: null,
      userid: null,
      openid: null,
      mobile: null,
      username: null,
      disivion: 'ASD Division',
      deptid: null,
      deptmanager: false,
      fab: null,
      roleid: null,
      pmsid: null,
      auth: false,
      blacklist: false,
      password: null,
      groupid: null,
      permissiongroup: null,
      isonline: false,
      logintime: null,
      creattime: null,
      appadmin: false,
      wxusrinfo: null
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    app.userInfoReadyCallback = (res) => {

      app.globalData.userInfo = res.userInfo;
      console.log(res.userInfo)
    }

    let num = (app.globalData.deptInfo == null ? 0 : 1) + (app.globalData.roleInfo == null ? 0 : 2)
    switch (num) {
      case 0:
        {
          app.getDeptInfo((res) => {
            this.data.deptInfo = res.data
            app.globalData.deptInfo = res.data
            console.log(res)
            app.getRoleInfo((res) => {
              this.data.roleInfo = res.data;
              app.globalData.roleInfo = res.data;
              console.log(res)
              this.setData({
                roleInfo: res.data,
                fabs:this.data.fabs
              })
            }, (err) => {
              app.navigateToMessage("程序出错了", err, "warn")
            });


          }, (err) => {
            app.navigateToMessage("程序出错了", err, "warn")
          });

          break
        }

      case 1:
        {
          app.getDeptInfo((res) => {
            this.data.deptInfo = res.data
            app.globalData.deptInfo = res.data
            console.log(res)
          }, (err) => {
            app.navigateToMessage("程序出错了", err, "warn")
          });
          break
        }

      case 2:
        {

          app.getRoleInfo((res) => {
            this.data.roleInfo = res.data;
            app.globalData.roleInfo = res.data;
            console.log(res)
            this.setData({
              roleInfo: res.data
            })
          }, (err) => {
            app.navigateToMessage("程序出错了", err, "warn")
          });
          break
        }

        default :
        {
          this.data.deptInfo = app.globalData.deptInfo,
          this.data.roleInfo=app.globalData.roleInfo
          this.setData(
            {
              roleInfo:this.data.roleInfo
            }
          )
          break
        }


    }



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    /*
     let num = (app.globalData.deptInfo == null ? 0 : 1) + (app.globalData.roleInfo==null? 0: 2)
     switch (num)
     {
         case 0:
         {
           app.getDeptInfo((res) => {
             this.data.deptInfo = res.data
             app.globalData.deptInfo = res.data
             console.log(res)
             app.getRoleInfo((res) => {
               this.data.roleInfo = res.data;
               app.globalData.roleInfo = res.data;
               console.log(res)
               this.setData({
                 roleInfo: res.data
               })
             }, (err) => {
               app.navigateToMessage("程序出错了", err, "warn")
             });


           }, (err) => {
             app.navigateToMessage("程序出错了", err, "warn")
           });

           break
         }

         case 1:
         {
           app.getDeptInfo((res) => {
             this.data.deptInfo = res.data
             app.globalData.deptInfo = res.data
             console.log(res)
           }, (err) => {
             app.navigateToMessage("程序出错了", err, "warn")
           });
          break
         }

         case 2:
         {

           app.getRoleInfo((res) => {
             this.data.roleInfo = res.data;
             app.globalData.roleInfo = res.data;
             console.log(res)
             this.setData({
               roleInfo: res.data
             })
           }, (err) => {
             app.navigateToMessage("程序出错了", err, "warn")
           });
           break
         }


     }



   
     if (app.globalData.deptInfo == null) {
       app.getDeptInfo((res) => {
         this.data.deptInfo = res.data
         app.globalData.deptInfo = res.data
         console.log(res)
       }, (err) => {
         app.navigateToMessage("程序出错了", err, "warn")
       });
     } else {
       this.data.deptInfo = app.globalData.deptInfo
       if (app.globalData.roleInfo == null)
       {
         app.getRoleInfo((res) => {
           this.data.roleInfo = res.data;
           app.globalData.roleInfo = res.data;
           console.log(res)
           this.setData({
             roleInfo: res.data
           })
         }, (err) => {
           app.navigateToMessage("程序出错了", err, "warn")
         });
       }else{
         this.data.roleInfo = app.globalData.roleInfo
         this.setData({
           roleInfo: this.data.roleInfo
         })
       }
     } */







  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  /**
   * get roleInfo from db
   *
  getRoleInfo: function(resolve, reject) {
    if (this.data.roleInfo == undefined || this.data.roleInfo == null) {
      const db = wx.cloud.database();
      db.collection('roleinfo').get({
        success: (res) => {
         
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

    } else {
      if (resolve != null) {
        resolve(res)
      }
    }
  }, */
  // end getRoleInfo fuction


  /**
   * get dept base info from db
   *
  
    getDeptInfo: function(resolve, reject) {
      if (this.data.deptInfo == undefined || this.data.deptInfo == null) {
        const db = wx.cloud.database();
        db.collection('deptinfo').get({
          success: (res) => {
           // this.data.deptInfo = res.data;
            console.log(res)
            if (resolve != null) {
              resolve(res)
            }
          },
          fail: (err) => {
            if (reject != null) {
              reject();
            }

          }
        })

      } else {
        if (resolve != null) {
          resolve()
        }
      }
    },
     //end getDeptInfo fuction

  /*
   * Fab select change event 
   */
  fabPickerChange: function(e) {
    this.data.currDepts = []
    this.data.index = e.detail.value
    for (let i = 0; i < this.data.deptInfo.length; i++) {
      if (this.data.deptInfo[i].fabid == this.data.fabs[this.data.index]) {
        this.data.currDepts.push(this.data.deptInfo[i])
      }
    }
    console.log(this.data.currDepts)

    this.setData({
      index: e.detail.value,
      // deptIndex:this.data.deptIndex,
      currDepts: this.data.currDepts

    })
  }, //end fabPickerChange


  /******
   * 
   * dept select change event
   */
  deptPickerChange: function(e) {
    this.data.deptIndex = e.detail.value;
    this.setData({
      deptIndex: e.detail.value
    })
  }, //end dept select change event

  /******
   * 
   * role select change event
   */
  rolePickerChange: function(e) {
    this.data.roleIndex = e.detail.value;
    this.setData({
      roleIndex: e.detail.value
    })
  }, //end role select change event


  /**
   * uerid input value change
   */
  onUserIdValueChange: function(e) {
    this.data.userid = e.detail.value;

  },

  /**
   * username input value change
   */
  onUserNameValueChange: function(e) {
    this.data.username = e.detail.value

  }, //end onUserNamevalueChange

  /**
   * mobile input value change
   */
  onMobileValueChange: function(e) {
    this.data.mobile = e.detail.value

  }, //end onMobileValueChange

  /**
   * ! not use this function  !

   getWXUserInfo: function (e) {
     console.log(e)
     app.globalData.userInfo = e.detail.userInfo

     this.setData({
       userInfo: e.detail.userInfo,
       hasUserInfo: true
     })
   },
    */

  /***
   * 
   * sumit user info to db
   */
  onUserRegist: function() {
    console.log("\n *********start onUserRegist******\n")
    console.log(app.globalData.openid)
    this.data.userIdErr = false;
    this.data.usernameErr = false;
    this.data.mobileErr = false;
    this.data.fabErr = false;
    this.data.deptErr = false;
    this.data.roleErr = false;
    this.setData({
      userIdErr: false,
      usernameErr: false,
      mobileErr: false,
      fabErr: false,
      deptErr: false,
      roleErr: false
    })
    if (this.data.userid == null || this.data.userid.length < 1) {
      this.data.userIdErr = true;
      this.setData({
        userIdErr: true
      })
      wx.showModal({
        content: "厂牌号不能为空！",
        showCancel: false,
        confirmColor: 'red',
        success: function(res) {

          if (res.confirm) {


            console.log('用户点击确定')
            return
          }
        }
      });
    } else if (this.data.username == null || this.data.username.length < 1) {
      this.data.usernameErr = true;
      this.setData({
        usernameErr: true
      })
      wx.showModal({
        content: "姓名不能为空！",
        showCancel: false,
        confirmColor: 'red',
        success: function(res) {

          if (res.confirm) {


            console.log('用户点击确定')
            return
          }
        }
      });
    } else if (this.data.mobile == null || this.data.mobile.length < 1) {
      this.data.mobileErr = true;
      this.setData({
        mobileErr: true
      })
      wx.showModal({
        content: "电话号码不能为空！",
        showCancel: false,
        confirmColor: 'red',
        success: function(res) {

          if (res.confirm) {


            console.log('用户点击确定')
            return
          }
        }
      });
    } else if (this.data.index == null) {
      this.data.fabErr = true;
      this.setData({
        fabErr: true
      })
      wx.showModal({
        content: "部门不能为空！",
        showCancel: false,
        confirmColor: 'red',
        success: function(res) {

          if (res.confirm) {


            console.log('用户点击确定')
            return
          }
        }
      });
    } else if (this.data.deptIndex == null) {
      this.data.deptErr = true;
      this.setData({
        deptErr: true
      })
      wx.showModal({
        content: "部门不能为空！",
        showCancel: false,
        confirmColor: 'red',
        success: function(res) {

          if (res.confirm) {


            console.log('用户点击确定')
            return
          }
        }
      });
    } else if (this.data.roleIndex == null) {
      this.data.roleErr = true;
      this.setData({
        roleErr: true
      })

      wx.showModal({
        content: "职位不能为空！",
        showCancel: false,
        confirmColor: 'red',
        success: function(res) {

          if (res.confirm) {

            console.log('用户点击确定')
            return
          }
        }
      });
    } else {
      this.data.appUserInfo._id = this.data.userid
      this.data.appUserInfo.openid = app.globalData.openid
      this.data.appUserInfo.userid = this.data.userid
      this.data.appUserInfo.mobile = this.data.mobile
      this.data.appUserInfo.username = this.data.username
      this.data.appUserInfo.disivion = 'ASD Division'
      this.data.appUserInfo.deptid = this.data.currDepts[this.data.deptIndex].deptid
      this.data.appUserInfo.fab = this.data.fabs[this.data.index]
      this.data.appUserInfo.roleid = this.data.roleInfo[this.data.roleIndex].roleid

      this.data.appUserInfo.pmsid = 'pms' + this.data.userid
      this.data.appUserInfo.blacklist = false
      this.data.appUserInfo.password = null
      this.data.appUserInfo.groupid = null
      this.data.appUserInfo.permissiongroup = null
      this.data.appUserInfo.isonline = false
      this.data.appUserInfo.logintime = null
      this.data.appUserInfo.creattime = null
      this.data.appUserInfo.appadmin = false
      this.data.appUserInfo.wxusrinfo = app.globalData.userInfo // this.data.userInfo;
      console.log(this.data.appUserInfo)

      this.userIdCanUse(
        () => {
          this.sumitUserInfoToDB()
        },
        (err) => {
          this.data.userIdErr = true
          this.setData({
            userIdErr: true
          })
          wx.showModal({
            content: err,
            showCancel: false,
            confirmColor: 'red',
            success: function(res) {

              if (res.confirm) {

                console.log('用户点击确定')
                return
              }
            }
          });
        }
      )

    } //end if
    /*  this.setData(
        {
          errorcolor:null,
          errmsg:null
        }
      )
    this.data.appUserInfo._id = this.data.userid
    this.data.appUserInfo.openid = app.globalData.openid
    this.data.appUserInfo.userid = this.data.userid
    this.data.appUserInfo.mobile = this.data.mobile
    this.data.appUserInfo.username = this.data.username
    this.data.appUserInfo.disivion = 'ASD Division'
    this.data.appUserInfo.deptid = this.data.currDepts[this.data.deptIndex].deptid
    this.data.appUserInfo.fab = this.data.fabs[this.data.index]
    this.data.appUserInfo.roleid = this.data.roleInfo[this.data.roleIndex].roleid

    this.data.appUserInfo.pmsid = 'pms' + this.data.userid
    this.data.appUserInfo.blacklist = false
    this.data.appUserInfo.password = null
    this.data.appUserInfo.groupid = null
    this.data.appUserInfo.permissiongroup = null
    this.data.appUserInfo.isonline = false
    this.data.appUserInfo.logintime = null
    this.data.appUserInfo.greattime =new Date()
    this.data.appUserInfo.appadmin = false
    this.data.appUserInfo.wxusrinfo = this.data.userInfo;
    console.log(this.data.appUserInfo)

    */


  }, //end function


  /**
   * 检查userid是否重复
   */
  userIdCanUse(resolve, reject) {
    let userId = this.data.appUserInfo.userid;
    const db = wx.cloud.database();
    db.collection('users').where({
      userid: userId
    }).get({
      success: (res) => {
        if (res.data.length < 1) {
          console.log("\n=========UserId Can Use============\n")
          if (resolve != undefined && resolve != null) {
            resolve();
          }
        } else {
          //todo 把厂牌栏位标红
          if (reject != undefined && reject != null) {
            console.log("\n=========UserId Not Can Use============\n")
            reject("厂牌号已被注册，请核对！")
          }
        }
      }

    })

  }, //end userIdCanUse 

  /**
   * userinfo has error
   */
  userInfoHasErr: function(res) {
    openid = res.data.openid;
    if (openid == app.globalData.openid) {
      wx.navigateTo({
        url: '../msg/waitforauthmsg',
      })
    } else {
      this.setData({
        errorcolor: 'red',
        errmsg: '!!厂牌号已被注册使用'
      })
    }
  }, //end userInfoHasErr

  sumitUserInfoToDB: function() {
    /*
    const db = wx.cloud.database();
    db.collection('users').add({
      data: this.data.appUserInfo,
      success: (res) => {
        app.navigateToMessage("资料提交成功", "您资料已成功提交，需等待部门负责人审核通过后方能正常登陆使用。如有任何问题，请与部门负责人联系！", "success")
      },
      fail: (err) => {
        console.log(err)
        app.navigateToMessage("资料提交失败", err, "warn")
      }

    })*/
    let userdata =
    {
      userinfo: this.data.appUserInfo
    }
    console.log(JSON.stringify(userdata))
     
    wx.cloud.callFunction({
      name: "userRegist",
      data: userdata,
      success: (res) => {
        var rtn = res.result
        if (rtn.returnCode != 0) {
          app.navigateToMessage("注册出错了", rtn.returnText, "warn")

        } else {
          var user = rtn.data.userinfo
          app.globalData.appUserInfo = user
          if (user.auth) {

            wx.redirectTo({
              url: '../main/main',
            })

            
          } else {
            app.navigateToMessage("资料提交成功", "您资料已成功提交，需等待部门负责人审核通过后方能正常登陆使用。如有任何问题，请与部门负责人联系！", "success")
          }
        }

      },
      fail: (err) => {
        app.navigateToMessage("注册出错了", err, "warn")
      }
    })

  }, //end function

})