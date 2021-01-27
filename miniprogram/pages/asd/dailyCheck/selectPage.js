// miniprogram/pages/asd/dailyCheck/selectPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    machinegroupidx: null,
    machineidx: null,
    unitidx: null,
    machinegroup: [],
    machines: [],
    target: null,
    selecttype: 1,
    level: [{ ID: "ALL", DESCRIPTION: "ALL" }, { ID: "L1", DESCRIPTION: "一楼" }, { ID: "L2", DESCRIPTION: "二楼" }],
    levelidx: 0,
    machinelist: null,
    locationok: false



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

    if (app.globalData.userinfo.pms.env == 'test') {
      this.data.locationod = true
      this.setData(
        {
          locationok: true
        })
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
    // let ssid = app.globalData.wifissid


    app.verifyUserLoginTime(
      {
        systemmodule: 'pms',
        durationhour: app.globalData.userinfo.env == 'test' ? app.globalData.userperiod.test : app.globalData.userperiod.prod,
        success: (res) => {


          app.checkSsid(
            {
              success: (res) => {
                //to be disable
                /*
              wx.showModal({
                cancelColor: 'cancelColor',
                title:'WIFIOK'
              }) */

                this.data.locationok = true

                this.setData(
                  {
                    locationok: this.data.locationok
                  }
                )
              },
              fail: (err) => {

                //to be disable
                /*
            wx.showModal({
              cancelColor: 'cancelColor',
              title:'WIFING'
            }) */






                //start verify location

                if (app.globalData.userinfo.pms.env == 'test') {

                } else {
                  wx.showToast({
                    title: '获取当前位置',
                    duration: 3000
                  })
                  wx.getLocation({
                    success: (res) => {
                      wx.hideToast({
                        success: (res) => { },
                      })
                      console.log(res)
                      //app.globalData.userlocation.latitude=res.latitude
                      //    app.globalData.userlocation.longitude=res.longitude
                      //   app.globalData.userlocation.lasttime=(new Date()).toString()
                      app.verifyUserLocation({
                        location: res,
                        success: (res) => {
                          this.data.locationok = true

                          this.setData(
                            {
                              locationok: this.data.locationok
                            }
                          )
                        },
                        fail: (err) => {
                          wx.showModal({
                            cancelColor: 'cancelColor',
                            showCancel: false,
                            title: "位置验证失败",
                            content: "生产环境验证用户当前位置失败，无法继续使用"
                          })
                          this.data.locationok = false
                          this.setData(
                            {
                              locationok: this.data.locationok
                            }
                          )
                        }
                      })
                    },
                    fail: (err) => {
                      wx.hideToast({
                        success: (res) => { },
                      })
                      this.data.locationok = false
                      this.setData(
                        {
                          locationok: this.data.locationok
                        }
                      )
                      wx.showModal({
                        cancelColor: 'cancelColor',
                        showCancel: false,
                        title: "位置验证失败",
                        content: "获取用户当前位置失败，无法验证用户位置，故无法继续使用"
                      })
                    }
                  })
                }
              } //ssid check fail
            }
          )


          //end verify location

        },
        fail: (err) => {
          wx.showModal({
            cancelColor: 'cancelColor',
            showCancel: false,
            title: "登陆过期",
            content: "确认后将转到登陆界面",
            success(res) {
              let url = "../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=1&LABELTEXT=请重新登陆PMS！"
              wx.redirectTo({
                url: url,
              })
            }

          })
        }
      }
    )

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
  getBaseInfo(arg) {
    let success = arg.success
    let fail = arg.fail
    let env = app.globalData.userinfo.pms.env
    let userid = app.globalData.userinfo.pms.userid
    // let env='test'
    // let userid="cxm"
    let service = "asdplantaskbaseinfosrv"
    app.sendQueryMsg(
      {
        env: env,
        service: service,
        userid: userid,
        map: { EVENTUSER: userid },
        success: (res) => {
          if (success != undefined && success != null) {
            success(res)
          }
          // console.log(res)
        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            success(err)
          }
          // console.log(err)
        }
      }
    )

  },//end function

  eqgroupChange: function (res) {
    this.data.machinegroupidx = res.detail.value
    this.data.machines.length = 0
    this.data.machineidx = null
    this.setData(
      {
        machineidx: null
      }
    )
    app.getPMSMachineListByGroup(
      {
        env: app.globalData.userinfo.pms.env,
        userid: app.globalData.userinfo.pms.userid,
        machinegroupname: this.data.machinegroup[this.data.machinegroupidx].MACHINEGROUPNAME,
        success: (res) => {
          this.data.machines = res
          this.setData(
            {
              machineidx: null,
              machines: this.data.machines

            }
          )
        },
        fail: (err) => {
          wx.showModal(
            {
              showCancel: false,
              title: '请求数据失败',
              content: '由于网络故障或后台服务器原因，数据请求失败，请与管理员联系'
            }
          )
        }

      }
    )

    this.setData({
      machinegroupidx: this.data.machinegroupidx
    })
  },//end function

  eqChange: function (res) {
    this.data.machineidx = res.detail.value
    this.unitidx = null
    this.setData(
      {
        machines: this.data.machines,
        machineidx: this.data.machineidx,
        unitidx: null
      }
    )
  },
  unitChange: function (res) {
    this.data.unitidx = res.detail.value
    this.setData(
      {
        unitidx: this.data.unitidx
      }
    )
  }, //end function
  goClick: function (res) {
    let data = this.data
    switch (this.data.target) {
      case 'maintenance':
        {
          break
        }
      default:
        {

          let url = "../task/maintenance?cleantype=" + data.cleantype[data.cleantypeidx].ENUMVALUE + "&cleanstate=" + data.cleanstate[data.cleanstateidx].ENUMVALUE + "&unitname=" + data.machines[data.machineidx].UNIT[data.unitidx].MACHINENAME
          console.log(url)
          wx.navigateTo({
            url: url,
          })
          break
        }
    }

  },//end function

  selectTypeChange: function (res) {
    this.data.selecttype = res.detail.value
    this.setData(
      {
        selecttype: this.data.selecttype
      }
    )
  },//end function

  levelChange: function (res) {
    this.data.levelidx = res.detail.value
    console.log(this.data.levelidx)
    this.setData(
      {
        levelidx: this.data.levelidx
      }
    )
  }, //end function

  eqListChange: function (res) {
    console.log(res)
    this.data.machinelist = res.detail.value
  },
  goClick: function (res) {
    let machinename = null
    if (this.data.machineidx == null) {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel: false,
        title: "设备未选择",
        content: "请选择设备后继续！",
        success: (res) => {
          //do nothing
        }

      })
    }
    else {
      //BY machine case
      if (this.data.unitidx == null) {
        let url = "dailyCheck?machinename="
        machinename = this.data.machines[this.data.machineidx].MACHINENAME
        url = url + machinename
        if (this.data.levelidx > 0) {
          url = url + "&level=" + this.data.levelidx
          wx.navigateTo({
            url: url,
          })
        } else {

          wx.navigateTo({
            url: url,
          })
        }
        //by Unit case
      } else {
        let url = "dailyCheck?machinename="
        machinename = this.data.machines[this.data.machineidx].UNIT[this.data.unitidx].MACHINENAME
        url = url + machinename
        if (this.data.levelidx > 0) {
          url = url + "&level=" + this.data.levelidx
          wx.navigateTo({
            url: url,
          })
        } else {

          wx.navigateTo({
            url: url,
          })
        }
      }



    }
  }, //end function
  manualChange: function (res) {
    console.log(res)
    if (res.detail.value && this.data.machines.length < 1) {

      this.getBaseInfo(
        {
          success: (res) => {
            /*
            this.data.cleantype=res.result.Message.Body.PMCLEANTYPE.DATALIST
            this.data.cleanstate=res.result.Message.Body.CLEANMAINSTATE.DATALIST
            this.data.machinegroup=res.result.Message.Body.MACHINEGROUP.DATALIST
            */
            let body = res.result.Message.Body
            for (let j = 0; j < body.MACHINEGROUP.DATALIST.length; j++) {
              let data3 = body.MACHINEGROUP.DATALIST[j].DATA
              if (data3.MACHINEGROUPNAME.search("CIM") > 0) {
                continue
              }
              data3.DESCRIPTION = data3.MACHINEGROUPNAME + ' |  ' + data3.DESCRIPTION
              if (body.MACHINEGROUP.DATALIST[j].DATA.FACTORYNAME == app.globalData.userinfo.pms.factory) {
                this.data.machinegroup.push(body.MACHINEGROUP.DATALIST[j].DATA);
              }

            }
            console.log("machinegroup")
            console.log(this.data.machinegroup)
            this.setData(
              {
                machinegroup: this.data.machinegroup
              }
            )

          },
          fail: (err) => {

          }
        }
      )



    }

  }, //end function

  scanClick: function (res) {
    if (this.data.locationok) {
      wx.scanCode({
        onlyFromCamera: false,
        success: (res) => {
          console.log(res)
          let code = res.result
          if (code.search("level") >= 0) {
            let url = "dailyCheck?" + code
            wx.navigateTo({
              url: url,
              fail: (err) => {
                wx.showToast({
                  title: '无效的二维码',
                  duration: 2000
                })
              }
            })

          } else {
            let url = "dailyCheck?machinename=" + code
            let reg1 = new RegExp("^[A-Za-z][0-9]{1}[a-zA-Z]{3}[0-9]{2}")
            console.log(url)
            if (code.length >= 0 && reg1.test(code)) {
              wx.navigateTo({
                url: url,
                fail: (err) => {
                  wx.showToast({
                    title: '无效的二维码',
                    duration: 3000
                  })
                }
              })
            } else {
              wx.showToast({
                title: '无效的二维码',
                duration: 2000
              })
            }


          }

        }
      })
    }
    else {
      wx.showToast({
        title: '位置验证失败',
        duration: 2000
      })

    }
  }, //end function

 

})