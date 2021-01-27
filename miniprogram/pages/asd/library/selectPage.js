// miniprogram/pages/asd/library/selectPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    factories: ["CELL", "FGI"],
    QUERYID: "GetLibraryList",
    VERSION: "00005",
    PARAMMAP: { FACTORYNAME: "" },
    libraryslots: [],
    rawlibraryslots: [],
    librarymachines: [],
    selectSlotidx: null,
    userinfo: null,
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
    if (app.globalData.userinfo.oic.env == 'test') {
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
        systemmodule: 'oic',
        durationhour: app.globalData.userinfo.env == 'test' ? app.globalData.userperiod.test : app.globalData.userperiod.prod,
        success: (res) => {

          app.checkSsid(
            {
              env:app.globalData.userinfo.env,
              success: (res) => {
                console.log("check ssid ok")
                this.data.locationok = true

                this.setData(
                  {
                    locationok: this.data.locationok
                  }
                )
              },
              fail: (err) => {
                console.log("check ssid ng")
                //start verify location

                if (app.globalData.userinfo.oic.env == 'test') {
                  this.data.locationod = true
                  this.setData(
                    {
                      locationok: true
                    }
                  )

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



                //end verify location
              } //ssid check fail
            }
          )

        },
        fail: (err) => {
          wx.showModal({
            cancelColor: 'cancelColor',
            showCancel: false,
            title: "登陆过期",
            content: "确认后将转到登陆界面",
            success(res) {
              let url = "../login/userLogin?CHANGEENV=Y&SYSTEMMODULE=2&LABELTEXT=请重新登陆OIC！"
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
  libraryTypeChange: function (res) {
    let factoryarea = res.detail.value
    this.data.selectSlotidx = null

    this.setLibraryTypeData(factoryarea)
  },
  setLibraryTypeData: function (factoryarea) {
    this.data.libraryslots.length = 0;
    this.data.librarymachines.length = 0;
    this.data.rawlibraryslots.length = 0;
    // this.data.libraryslots=[];
    //this.data.librarymachines=[];

    this.setData(
      {
        librarymachines: this.data.librarymachines,
        libraryslots: this.data.libraryslots,
        selectSlotidx: this.data.selectSlotidx
      }
    )
    //console.log(res.detail)
    app.sendQueryMsg(
      {
        queryid: "GetLibraryList",
        env: app.globalData.userinfo.oic.env,
        userid: app.globalData.userinfo.oic.userid,
        map: { FACTORYNAME: factoryarea, EVENTUSER: app.globalData.userinfo.oic.userid },
        success: (res) => {
          console.log(res)
          var slots = res.result.Message.Body.DATALIST
          // console.log(slots)
          for (let i = 0; i < slots.length; i++) {
            let slot = { IDX: i, LIBRARYSLOT: slots[i].DATA.LIBRARYSLOT, FACTORYNAME: slots[i].DATA.FACTORYNAME, MACHINENAME: slots[i].DATA.MACHINENAME, ISLOADER: slots[i].DATA.ISLOADER }
            //console.log(slot)
            this.data.rawlibraryslots.push(slot);
            let machinename = slots[i].DATA.MACHINENAME;
            if (this.data.librarymachines.length < 1) {
              let machine = { IDX: this.data.librarymachines.length, MACHINENAME: machinename }
              this.data.librarymachines.push(machine)
              continue
            } else {
              let found = false
              for (let j = 0; j < this.data.librarymachines.length; j++) {
                if (this.data.librarymachines[j].MACHINENAME == slots[i].DATA.MACHINENAME) {
                  break;
                } else {
                  if (j == this.data.librarymachines.length - 1) {
                    let machine = { IDX: this.data.librarymachines.length, MACHINENAME: machinename }
                    this.data.librarymachines.push(machine)
                  } else {
                    continue
                  }
                }//end for j

              }

            }//end for j
            //console.log(this.data.librarymachines)
          }
          // console.log(this.data.libraryslots);
          this.setData(
            {
              librarymachines: this.data.librarymachines
            }
          )
        },
        fail: (err) => {
          //TODO
        }

      }
    )
  },
  libraryAreaChange: function (res) {
    this.data.libraryslots.length = 0;

    this.data.selectSlotidx = null;
    this.data.librarymachines.length = 0;
    console.log(res)
    // this.data.libraryslots=[]
    this.setData(
      {
        libraryslots: this.data.libraryslots,
        selectSlotidx: this.data.selectSlotidx
      }
    )
    let machine = res.detail.value
    this.setLibararyAreaData(machine)



  },
  setLibararyAreaData(machine) {
    let slots = []
    let rawslots = this.data.rawlibraryslots
    // console.log(rawslots)
    for (let i = 0; i < rawslots.length; i++) {
      if (rawslots[i].MACHINENAME == machine) {
        let slot = { IDX: slots.length, MACHINENAME: machine, FACTORYNAME: rawslots[i].FACTORYNAME, LIBRARYSLOT: rawslots[i].LIBRARYSLOT }
        slots.push(slot)
      }

    }//end for i
    console.log(slots)
    this.data.libraryslots = slots;
    this.setData({
      libraryslots: this.data.libraryslots
    })


  },  //end function
  librarySlotChange: function (res) {
    console.log(res)
    this.data.selectSlotidx = res.detail.value
    this.setData
      ({
        selectSlotidx: this.data.selectSlotidx
      })
  },

  submit: function (res) {
    let FACTORYNAME = this.data.libraryslots[this.data.selectSlotidx].FACTORYNAME
    let MACHINENAME = this.data.libraryslots[this.data.selectSlotidx].MACHINENAME
    let LIBRARYSLOT = this.data.libraryslots[this.data.selectSlotidx].LIBRARYSLOT
    let url = "storageIn?"
    url = url + "FACTORYNAME=" + FACTORYNAME + "&MACHINENAME=" + MACHINENAME + "&LIBRARYSLOT=" + LIBRARYSLOT
    wx.navigateTo({
      url: url,
    })
  },//end function

  scanClick: function (res) {
    if (this.data.locationok) {
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          console.log(res)
          if (res.result.search("FACTORYNAME") >= 0 && res.result.search("MACHINENAME") >= 0 && res.result.search("LIBRARYSLOT") >= 0) {
            let url = "../library/storageIn?" + res.result
            wx.navigateTo({
              url: url,
            })
          } else {
            console.log(res.result.search("FACTORYNAME"))
            console.log(res.result.search("MACHINENAME"))
            console.log(res.result.search("LIBRARYSLOT"))
            wx.showToast({
              title: '无效的二维码',
              duration: 2000
            })
          }
        }
      })
    } else {

      wx.showToast({
        title: '位置验证失败',
        duration: 2000
      })
    }

  }, //end function

  manualChange: function (res) {
    if (res.detail.value && rawlibraryslots.length < 1) {




    }

  }

})