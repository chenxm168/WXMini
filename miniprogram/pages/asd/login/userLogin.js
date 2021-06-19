// pages/asd/login/userLogin.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pmsoroic: 2,
    userinfo: { pms: { division: "", usergroup: "", factory: "", userid: null, password: "", loginisok: false, lastlogin: null, env: "test" }, oic: { factory: "", userid: null, password: "", loginisok: false, lastlogin: null, env: "test" } },
    divisions: [],
    divisionsidx: null,
    usergroups: ["设备组"],
    usergroupsidx: null,
    factories: ["ARRAY", "CELL", "CF"],
    factoriesidx: 0,
    tourl: "../main/asdMain",
    envs: ["生产环境", "测试环境"],
    envidx: 1,
    labeltext: "首次使用，请选择系统登陆！",
    lablecolor: 'gray'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(
      {
        wHeight: app.globalData.wHeight
      }

    )

    if (options.CHANGEENV != undefined) {
      let num = options.SYSTEMMODULE == null ? 0 : options.SYSTEMMODULE
      switch (num) {
        case "1":
          {
            if (options.LABELTEXT != undefined) {
              this.data.labeltext = options.LABELTEXT
              this.setData(
                {
                  labeltext: this.data.labeltext,
                  labelcolor: 'red'
                }
              )
            }
            this.pmsoroicPmsClick()
            break
          }
        case "2":
          {
            if (options.LABELTEXT != undefined) {
              this.data.labeltext = options.LABELTEXT
              this.setData(
                {
                  labeltext: this.data.labeltext,
                  labelcolor: 'red'
                }
              )
            }
            this.pmsoroicOicClick()
            break
          }
        default:
          {
            if (options.LABELTEXT != undefined) {
              this.data.labeltext = options.LABELTEXT
              this.setData(
                {
                  labeltext: this.data.labeltext,
                  labelcolor: 'red'
                }
              )
            }
            this.pmsoroicPmsClick()
            break
          }
      }

    } else {

      wx.getStorage({
        key: 'userinfo',
        success:(res)=>
        {
            app.globalData.userinfo=res.data
            wx.redirectTo({
              url: '../main/asdMain',
            })
        },
        fail:(err)=>
        {
          //do nothing
        }
      })



    }
    /*
    if (options.SYSTEMMODULE != undefined) {
      if(options.SYSTEMMODULE=='1')
      {
        this.data.pmsoroic=1
        this.pmsoroicPmsClick()
      }
      else
      {
        if(options.SYSTEMMODULE=='2')
      {
        this.data.pmsoroic=1
        this.pmsoroicOicClick()
      }
    }
  }

    if (options.TOURL != undefined) {
      this.data.tourl = options.TOURL
    }

 

   
    if(options.CHANGEENV==undefined)
    {
      wx.getStorage({
        key: 'userinfo',
        success(res)
        {
           let userinfo=res.data
           if(userinfo.oic.userid!=null|userinfo.pms.userid!=null)
           {
             app.globalData.userinfo=userinfo
           //  wx.redirectTo({
           //    url: '../main/asdMain',
            // })
           }
        }
      })
    }else
    {
      wx.showToast({
        title: "请重新登陆系统",
        duration:2000
      })
      this.setData({
        labelcolor:'red'
      })
    } */



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
  pmsoroicPmsClick: function () {

    if (this.data.pmsoroic != 1) {
      this.data.usergroupsidx = null
      this.data.divisionsidx = null
      this.data.divisions.length = 0
      this.data.usergroups.length = 0
      this.data.pmsoroic = 1
      this.setData(
        {
          pmsoroic: this.data.pmsoroic,
          usergroupsidx: this.data.usergroupsidx,
          divisionsidx: this.data.divisionsidx,
          divisions: this.data.divisions,
          usergroups: this.data.usergroups
        }
      )
      this.setDeparmentData(this.data.envidx)
    }



  },
  pmsoroicOicClick: function () {
    if (this.data.pmsoroic != 2) {
      this.data.pmsoroic = 2
      this.setData(
        {
          pmsoroic: this.data.pmsoroic
        }
      )
    }

  },
  divisionChange: function (res) {

    if (this.data.divisionsidx != res.detail.value) {
      this.data.usergroupsidx = null
      this.data.usergroups.length = 0
      console.log(res.detail.value)
      this.data.divisionsidx = res.detail.value
      this.setData(
        {
          divisionsidx: this.data.divisionsidx,
          usergroups: this.data.usergroups,
          usergroupsidx: this.data.usergroupsidx
        }
      )
      this.setUsergroupData(this.data.divisions[this.data.divisionsidx])
    }

  },
  usergroupChange: function (res) {
    this.data.usergroupsidx = res.detail.value
    this.setData(
      {
        usergroupsidx: this.data.usergroupsidx
      }
    )
  },
  factoryChange: function (res) {
    this.data.factoriesidx = res.detail.value
    this.setData(
      {
        factoriesidx: this.data.factoriesidx
      }
    )
  },
  userLoginSubmit: function (res) {

    if (res.detail.value.userid != null && res.detail.value.userid.length > 0 && res.detail.value.password != null && res.detail.value.password.length > 0) {



      let sysmodule = this.data.pmsoroic
      switch (sysmodule) {
        case 2:
          {
            app.oicLogin(
              {
                userid: res.detail.value.userid,
                password: res.detail.value.password,
                factory: this.data.factories[this.data.factoriesidx],
                env: this.data.envidx == 1 ? "test" : "prod",
                success: (res) => {
                  wx.redirectTo({
                    url: '../main/asdMain',
                    fail:(err)=>
                    {
                      console.log(err)
                    }
                  })
                },
                fail: (err) => {
                  wx.hideLoading({
                    success: (res) => { },
                  })
                  wx.showModal({
                    showCancel: false,
                    title: "登陆失败",
                    content: "用户资料错误!"
                  })
                  //TODO
                }
              }
            )
            break
          }
        case 1:
          {
            app.pmsLogin(
              {
                userid: res.detail.value.userid,
                password: res.detail.value.password,
                factory: this.data.factories[this.data.factoriesidx],
                division: this.data.divisions[this.data.divisionsidx],
                usergroup: this.data.usergroups[this.data.usergroupsidx],
                env: this.data.envidx == 1 ? "test" : "prod",
                success: (res) => {
                  console.log("pmslogin success")
                  wx.redirectTo({
                    url: '../main/asdMain',
                    fail:(err)=>
                    {
                      console.log(err)
                    }
                  })
                },
                fail: (err) => {
                  wx.hideLoading({
                    success: (res) => { },
                  })
                  wx.showModal({
                    showCancel: false,
                    title: "登陆失败",
                    content: "用户资料错误!"
                  })
                  //TODO
                }
              }
            )
            break
          }
        default:
          {

          }
      }//end switch 
    }//end if
    else {
      let v = res.detail.value
      let title = "用户名不能为空"
      if (v.userid == null || v.userid.length < 1) {

      } else {
        if (v.password == null || v.password.length < 1) {
          title = "密码不能为空"
        }
      }
      wx.showToast({
        title: title,
        duration: 2000
      })
    }

  },
  envChange: function (res) {
    console.log(res)
    if (this.data.envidx != res.detail.value) {
      this.data.envidx = res.detail.value
      this.data.divisionsidx = null
      this.usergroupsidx = null
      this.setData(
        {
          envidx: this.data.envidx,
          divisionsidx: this.data.divisionsidx,
          usergroupsidx: this.data.usergroupsidx
        }
      )
      this.setDeparmentData(this.data.envidx)
    }

  },

  setDeparmentData: function (env) {
    this.data.divisions.length = 0
    let msg = app.globalData.msg
    msg.data.JsonMessage.Message.QUERYID = "GetDepartmentInfoPMS"
    msg.data.JsonMessage.Service = "asdquerysrv"
    msg.data.JsonMessage.Message.MODULE = "qry"
    msg.data.JsonMessage.Userinfo.ENV = env == 0 ? "prod" : "test"
    //msg.data.JsonMessage.Userinfo.ENV="prod"
    app.sendMessage(msg, (res) => {
    //app.sendMsg(msg, (res) => {
      console.log(res)
      if (res.result.Message.Return.RETURNCODE == "0") {
        let datas = res.result.Message.Body.DATALIST
        if (datas.length == undefined) {
          // console.log("DATA LIST length = undefined")
          // console.log(datas)
          //console.log(datas.DATA.DEPARTMENT)
          this.data.divisions.push(datas.DATA.DEPARTMENT)
        }

        else {
          for (let i = 0; i < datas.length; i++) {
            // console.log(datas[i].DATA)
            this.data.divisions.push(datas[i].DATA.DEPARTMENT)

          }
        }

        //console.log(this.data.divisions)
        this.setData(
          {
            divisions: this.data.divisions
          }
        )
      }
    })
  },
  setUsergroupData: function (arg) {
    this.data.usergroups.length = 0
    let msg = app.globalData.msg
    msg.data.JsonMessage.Message.QUERYID = "GetUserGroupInfoPMS"
    msg.data.JsonMessage.Service = "asdquerysrv"
    msg.data.JsonMessage.Message.MODULE = "qry"
    msg.data.JsonMessage.Userinfo.ENV = this.data.envidx == 0 ? "prod" : "test"
    msg.data.JsonMessage.Message.PARAMMAP = { DEPARTMENT: arg }
    app.sendMessage(msg, (res) => {
      console.log(res)
      if (res.result.Message.Return.RETURNCODE == "0") {
        let datas = res.result.Message.Body.DATALIST
        if (datas.length == undefined) {
          this.data.usergroups.push(datas.DATA.USERGROUPNAME)
        } else {
          for (let i = 0; i < datas.length; i++) {
            this.data.usergroups.push(datas[i].DATA.USERGROUPNAME)
          }
        }
        this.setData({
          usergroups: this.data.usergroups
        })

      }
    })

  }

})