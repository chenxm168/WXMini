// miniprogram/pages/asd/task/planTask.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    cleantype: [],
    cleanstate: [],
    machinegroup: [],
    cleantypeidx: 0,
    cleanstateidx: 1,
    machinegroupidx: null,
    machines: [],
    machineidx: null,
    unitidx: null,
    unitname:null,
    target:null,
    locationok:false

  },

  /**
   * 生命周期函数 |  监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wHeight: app.globalData.wHeight
    })


    this.getBaseInfo(
      {
        success: (res) => {
          /*
          this.data.cleantype=res.result.Message.Body.PMCLEANTYPE.DATALIST
          this.data.cleanstate=res.result.Message.Body.CLEANMAINSTATE.DATALIST
          this.data.machinegroup=res.result.Message.Body.MACHINEGROUP.DATALIST
          */
          let body = res.result.Message.Body
          for (let i = 0; i < body.PMCLEANTYPE.DATALIST.length; i++) {
            let data1 = body.PMCLEANTYPE.DATALIST[i].DATA
            data1.DESCRIPTION = data1.ENUMVALUE + ' |  ' + data1.DESCRIPTION
            this.data.cleantype.push(body.PMCLEANTYPE.DATALIST[i].DATA);
          }
          for (let k = 0; k < body.CLEANMAINSTATE.DATALIST.length; k++) {
            let data2 = body.CLEANMAINSTATE.DATALIST[k].DATA
            if(data2.ENUMVALUE=='Completed')
            {
               continue
            }
            let desc= (data2.ENUMVALUE=='Created'? '待执行':"") +(data2.ENUMVALUE=='Checked'? '待核查':"") +(data2.ENUMVALUE=='Completed'? '已完成':"")
            data2.DESCRIPTION = data2.ENUMVALUE + ' |  ' + desc
            this.data.cleanstate.push(body.CLEANMAINSTATE.DATALIST[k].DATA);
          }
          for (let j = 0; j < body.MACHINEGROUP.DATALIST.length; j++) {
            let data3 = body.MACHINEGROUP.DATALIST[j].DATA
            if (data3.MACHINEGROUPNAME.search("CIM") >= 0 ||data3.FACTORYNAME!=app.globalData.userinfo.pms.factory) {
              continue
            }
            data3.DESCRIPTION = data3.MACHINEGROUPNAME + ' |  ' + data3.DESCRIPTION
            this.data.machinegroup.push(body.MACHINEGROUP.DATALIST[j].DATA);
          }

          console.log("cleantype")
          console.log(this.data.cleantype)
          console.log("cleanstate")
          console.log(this.data.cleanstate)
          console.log("machinegroup")
          console.log(this.data.machinegroup)
          this.setData(
            {
              cleantype: this.data.cleantype,
              cleanstate: this.data.cleanstate,
              machinegroup: this.data.machinegroup
            }
          )

        },
        fail: (err) => {

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

    app.verifyUserLoginTime(
      {
        systemmodule: 'pms',
        durationhour: app.globalData.userinfo.env == 'test' ? app.globalData.userperiod.test : app.globalData.userperiod.prod,
        success: (res) => {


          app.checkSsid(
            {
              success: (res) => {
                this.data.locationok = true

                this.setData(
                  {
                    locationok: this.data.locationok
                  }
                )
              },
              fail: (err) => {








                //start verify location

                if (app.globalData.userinfo.pms.env == 'test') {

                } else {
                  wx.showToast({
                    title: '获取当前位置',
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
    let service = "asdplantaskbaseinfosrv"
    app.sendQueryMsg(
      {
        env: env,
        service: service,
        userid: userid,
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

  },
  pmcCleanTypeChange: function (res) {
    this.data.cleantypeidx = res.detail.value
    this.setData({
      cleantypeidx: this.data.cleantypeidx
    })
  },
  cleanMainStateChange: function (res) {
    this.data.cleanstateidx = res.detail.value
    this.setData({
      cleanstateidx: this.data.cleanstateidx
    })
  },
  eqgroupChange: function (res) {
    this.data.machinegroupidx = res.detail.value
    this.data.machines.length=0
    this.data.machineidx=null
    this.setData(
      {
        machineidx:null
      }
    )
    app.getPMSMachineListByGroup(
      {
        env:app.globalData.userinfo.pms.env,
        userid:app.globalData.userinfo.pms.userid,
        machinegroupname:this.data.machinegroup[this.data.machinegroupidx].MACHINEGROUPNAME,
        success:(res)=>
        {
            this.data.machines=res
            this.setData(
              {
                machineidx:null,
                machines:this.data.machines

              }
            )
        },
        fail:(err)=>
        {
          //TODO
        }

      }
    )
   
    this.setData({
      machinegroupidx: this.data.machinegroupidx
    })
  },
  eqChange: function (res) {
    this.data.machineidx = res.detail.value
    this.unitidx=null
    this.setData(
      {
        machines:this.data.machines,
        machineidx: this.data.machineidx,
        unitidx:null
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
  },
  goClick:function(res)
  {
    let data= this.data
    switch(this.data.target)
    {
      case 'maintenance':
        {
          break
        }
        default:
          {
            if(this.data.machineidx==null)
            {
                wx.showModal({
                  cancelColor: 'cancelColor',
                  showCancel:false,
                  title:'未选择设备',
                  content:'请先选择设备后继续'
                })
            }else
            {
              let url="task?cleantype="+data.cleantype[data.cleantypeidx].ENUMVALUE+"&cleanstate="+data.cleanstate[data.cleanstateidx].ENUMVALUE+"&machinename="+data.machines[data.machineidx].MACHINENAME
              wx.navigateTo({
                url: url,
              })
            }

            

           
            break
          }
    }

  },//end function

  scanClick:function(res)
  {
    if (this.data.locationok) {
      wx.scanCode({
        onlyFromCamera: false,
        success: (res) => {
          console.log(res)
          let data=this.data
          let code = res.result        
            let url = "task?cleantype="+data.cleantype[data.cleantypeidx].ENUMVALUE+"&cleanstate="+data.cleanstate[data.cleanstateidx].ENUMVALUE+"&machinename="+code
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