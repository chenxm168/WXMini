const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    factory: "CELL",
    machine: "车间区",
    slot: "二楼自制CF玻璃存放B区",
    datalist: [],
    addbtndisable: true,
    ppboxid: "",
    userinfo: "",
    factoryname: "",
    machinename: "",
    libraryslot: "",
    boxdata: [{ col: "PPBOX标签", row: [] }, { col: "销售单", row: [] }, { col: "产品型号", row: [] }, { col: "ppbox名", row: [] }, { col: "批次", row: [] }, { col: "数量", row: [] }, { col: "扣留状态", row: [] }, { col: "区域", row: [] }, { col: "仓库子区域", row: [] }, { col: "上个事件人", row: [] }, { col: "上个备注", row: [] }, { col: "备注", row: [] }],
    wheight: 500,
    scanlist: [],
    maskshow: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {





    console.log(options)
    if (options) {
      if (options.FACTORYNAME != undefined && options.FACTORYNAME != null) {
        this.data.factoryname = options.FACTORYNAME
      }
      if (options.MACHINENAME != undefined && options.MACHINENAME != null) {
        this.data.machinename = options.MACHINENAME
      }
      if (options.LIBRARYSLOT != undefined && options.LIBRARYSLOT != null) {
        this.data.libraryslot = options.LIBRARYSLOT
      }
    }
    this.setData(
      {
        libraryslot: this.data.libraryslot,
        machinename: this.data.machinename,
        factoryname: this.data.factoryname,
        wHeight: app.globalData.wHeight
      }
    )

    let storageScanlist = false
    let storageboxdata = false

    console.log(this.data.factoryname)
    console.log(this.data.machinename)
    console.log(this.data.libraryslot)
    let boxdata = this.data.boxdata
    let datalist = this.data.datalist
    let scanlist = []
    this.getStorageScanListData(
      {

        complete: (res) => {
          if (res != null) {
            scanlist = res
            storageScanlist = true
          }

          this.getStorageBoxdataData(
            {
              complete: (res2) => {
                if (res2 != null) {
                  boxdata = res2.boxdata
                  datalist = res2.datalist
                  console.log(boxdata)
                  console.log(datalist)
                  storageboxdata = true
                  this.setStorageData(
                    {
                      scan: storageScanlist,
                      box: storageboxdata,
                      boxdata: boxdata,
                      datalist: datalist,
                      scanlist: scanlist
                    })
                } else {
                  this.setStorageData(
                    {
                      scan: storageScanlist,
                      box: storageboxdata,
                      scanlist:scanlist
                    }
                  )
                }
              }
            }
          )

        }
      }
    ) //end getStorageScanListData

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
    let user = app.globalData.userinfo.oic
    if (user.env == 'prod') {
      wx.getLocation({
        success: (res) => {
          app.globalData.userlocation.latitude = res.latitude
          app.globalData.userlocation.longitude = res.longitude
        }
      })
    }
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
  ppboxLabelChange: function (res) {
    //console.log(res)
    if (res.detail.value.length > 10) {
      if (this.data.addbtndisable) {
        this.data.addbtndisable = false
        this.setData(
          {
            addbtndisable: this.data.addbtndisable
          }
        )
      }
    }
  },
  scanClick: function (res) {
    /*
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '扫描方式',
      content: '请选择扫描方式',
      cancelText: '单扫',
      confirmText: '多扫',
      success: (res) => {
        if (res.confirm) {
          this.data.maskshow = true
          this.data.scanlist.length = 0
          this.setData(
            {
              maskshow: true,
              scanlist: this.data.scanlist

            }
          )
        } else {
          wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
              console.log(res)
              this.checkLabelIsDuplication(res.result)

            },
            fail: (res) => {

            }
          })

        }
      } 
    })*/

    this.data.maskshow=true
    this.setData(
      {
        maskshow:true
      }
    )



  },
  addPPBOX: function (res) {
    let label = res.detail.value.ppboxlabel.toUpperCase()


    console.log(res)
    this.checkLabelIsDuplication(label)
  },
  setPPBOXInfo: function (label) {

    app.sendQueryMsg(
      {
        queryid: "GetPPBoxList" + this.data.factoryname,
        env: app.globalData.userinfo.oic.env,
        userid: app.globalData.userinfo.oic.userid,
        map: { FACTORYNAME: this.data.factoryname, PACKINGLABELID: label },
        success: (res) => {
          console.log(res)
          let list = res.result.Message.Body.DATALIST
          console.log(list.length)

          if (list != undefined && list != null && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              // let item = list[i].DATA
              this.setListData(list[i].DATA)
            }//end for

            console.log(this.data.boxdata)
            this.setData(
              {
                boxdata: this.data.boxdata
              }
            )
          } else {
            if (list.DATA != undefined) {
              this.setListData(list.DATA)
              this.setData(
                {
                  boxdata: this.data.boxdata
                }
              )
            } else {
              wx.showModal({
                cancelColor: 'cancelColor',
                showCancel: false,
                title: "无法找到信息",
                content: "找不到PPBOX信息：" + label
              })
            }
          }

        },
        fail: (err) => {
          //TODO
        }
      }
    )
    /*
   let msg = app.globalData.msg;
   msg.data.JsonMessage.Message.QUERYID = "GetPPBoxList" + this.data.factoryname
   msg.data.JsonMessage.Service = "asdquerysrv"
   msg.data.JsonMessage.Message.MODULE = "qry"
   msg.data.JsonMessage.Message.ENV = this.data.userinfo.env
   let map = { FACTORYNAME: this.data.factoryname, PACKINGLABELID: label }
   msg.data.JsonMessage.Message.PARAMMAP = map
   app.sendMessage(msg, (res) => {



     console.log(res)
     let list = res.result.Message.Body.DATALIST
     console.log(list.length)

     if (list != undefined && list != null & list.length > 0) {
       for (let i = 0; i < list.length; i++) {
         // let item = list[i].DATA
         this.setListData(list[i].DATA)
       }//end for

       console.log(this.data.boxdata)
       this.setData(
         {
           boxdata: this.data.boxdata
         }
       )
     } else {
       if (list.DATA != undefined) {
         this.setListData(list.DATA)
         this.setData(
           {
             boxdata: this.data.boxdata
           }
         )
       } else {
         //TODO
       }
     }






   }) */
  },
  setListData: function (item) {
    let box = { IDX: this.data.datalist.length, PACKINGLABELID: item.PACKINGLABELID, AREANAME: item.AREANAME, CHECKBOX: item.CHECKBOX, DURABLENAME: item.DURABLENAME, LASTEVENTCOMMENT: item.LASTEVENTCOMMENT, LASTEVENTNAME: item.LASTEVENTNAME, LASTEVENTTIME: item.LASTEVENTTIME, LASTEVENTUSER: item.LASTEVENTUSER, LOTGRADE: item.LOTGRADE, LOTHOLDSTATE: item.LOTHOLDSTATE, LOTNAME: item.LOTNAME, LOTSECONDARYGRADE: item.LOTSECONDARYGRADE, LOTSTATE: item.LOTSTATE, NOTE: item.NOTE, POSITIONNAME: item.POSITIONNAME, PROCESSFLOWNAME: item.PROCESSFLOWNAME, PROCESSGROUPNAME: item.PROCESSGROUPNAME, PROCESSOPERATIONNAME: item.PROCESSOPERATIONNAME, PRODUCTQUANTITY: item.PRODUCTQUANTITY, PRODUCTREQUESTNAME: item.PRODUCTREQUESTNAME, PRODUCTSPECNAME: item.PRODUCTSPECNAME, PRODUCTSPECVERSION: item.PRODUCTSPECVERSION, PRODUCTTYPE: item.PRODUCTTYPE, SALEORDER: item.SALEORDER, ZONENAME: item.ZONENAME }
    this.data.datalist.push(box)
    let boxdata = this.data.boxdata
    boxdata[0].row.push({ IDX: box.length, value: box.PACKINGLABELID, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[1].row.push({ IDX: box.length, value: box.SALEORDER, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[2].row.push({ IDX: box.length, value: box.PRODUCTSPECNAME, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[3].row.push({ IDX: box.length, value: box.DURABLENAME, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[4].row.push({ IDX: box.length, value: box.LOTNAME, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[5].row.push({ IDX: box.length, value: box.PRODUCTQUANTITY, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[6].row.push({ IDX: box.length, value: box.LOTHOLDSTATE, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[7].row.push({ IDX: box.length, value: box.ZONENAME, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[8].row.push({ IDX: box.length, value: box.POSITIONNAME, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[9].row.push({ IDX: box.length, value: box.LASTEVENTUSER, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[10].row.push({ IDX: box.length, value: box.LASTEVENTCOMMENT, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    boxdata[11].row.push({ IDX: box.length, value: box.NOTE, hold: box.LOTHOLDSTATE.toUpperCase() == 'NOTONHOLD' ? 'N' : 'Y' })
    console.log(this.data.datalist)
  },
  changeStorageArea: function (res) {


    let map = { NEWSTORAGEAREANAME: this.data.machinename, NEWSUBAREANAME: this.data.libraryslot, EVENTCOMMENT: "WX",EVENTUSER:app.globalData.userinfo.oic.userid }
    let DURABLELIST = []


    for (let i = 0; i < this.data.datalist.length; i++) {
      let DURABLE = { "DURABLE": { DURABLENAME: this.data.datalist[i].DURABLENAME, LOTNAME: this.data.datalist[i].LOTNAME } }
      DURABLELIST.push(DURABLE)
    }
    console.log(map)
    app.sendEventMsg(
      {
        latitude: app.globalData.userlocation.latitude,
        longitude: app.globalData.userlocation.longitude,
        messagename: "StorageAreaChange",
        env: app.globalData.userinfo.oic.env == undefined ? "test" : app.globalData.userinfo.oic.env,
        userid: app.globalData.userinfo.oic.userid,
        body: { DURABLELIST: DURABLELIST },
        map: map,
        success: (res) => {
          let datalist = this.data.datalist
          let boxdata = this.data.boxdata
          console.log(res)
          if (res.result.Message.Return.RETURNCODE != undefined && res.result.Message.Return.RETURNCODE == '0') {
            let key = 'nosubmitboxdata' + this.data.factoryname + this.data.machinename + this.data.libraryslot
            wx.removeStorage({
              key: key,
            })
            wx.showToast({
              title: '更新位置成功',
              duration: 1000
            })
            console.log(datalist)
            datalist.length = 0;
            for (let i = 0; i < boxdata.length; i++) {
              boxdata[i].row.length = 0
            }
            this.setData(
              {
                boxdata: boxdata
              }
            )
          } else {
            this.submitFail(
              {
                boxdata: this.data.boxdata
              }
            )
          }
        },
        fail: (err) => {
          this.submitFail(
            {
              boxdata: this.data.boxdata
            }
          )
        }
      }
    )

  },
  submitFail: function (arg) {
    let boxdata = arg.boxdata
    wx.setStorage({
      data: { boxdata: this.data.boxdata, datalist: this.data.datalist },
      key: 'nosubmitboxdata' + this.data.factoryname + this.data.machinename + this.data.libraryslot
    })
    wx.showModal({
      showCancel: false,
      title: "数据处理失败",
      content: "数据处理失败，数据缓存手机，请联系管理员排查系统!"
    })

  },

  checkLabelIsDuplication: function (label) {

    let found = false

    for (let i = 0; i < this.data.boxdata[0].row.length; i++) {
      console.log(this.data.boxdata[0].row[i].value)
      if (this.data.boxdata[0].row[i].value == label) {
        found = true
      }
    }
    if (!found) {
      this.setPPBOXInfo(label)
    } else {
      wx.showToast({
        title: 'PPBOX标签已扫过',
        duration: 1000
      })
    }


  },//end funciton

  scanAgainClick: function (res) {

    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        this.checkBoxDataDuplication(
          {
            label: res.result,
            complete: (res1) => {

              if (!res1.result) {

                this.checkScanListDuplication(
                  {
                    label: res1.label,
                    complete: (res2) => {
                      if (res2.result) {

                        wx.showModal({
                          cancelColor: 'cancelColor',
                          showCancel: false,
                          title: 'PPBOX重复',
                          content:'PPBOX标签ID['+res2.label+']重复'
                        })
                      } else {
                        this.data.scanlist.push({ PACKINGLABELID: res2.label })
                        this.setData
                          (
                            {
                              scanlist: this.data.scanlist
                            })
                      }
                    }
                  }
                )

              } else {
                wx.showModal({
                  cancelColor: 'cancelColor',
                  showCancel: false,
                  title: 'PPBOX重复',
                  content:'PPBOX标签ID['+res1.label+']重复'
                })
              }
            }
          }
        )
      },
      fail: (err) => {

      }
    })
  },//end function

  completeScan: function (res) {
    if (this.data.scanlist.length < 1) {
      this.data.maskshow = false
      this.setData(
        {
          maskshow: false
        }
      )

    } else {
      let userinfo = app.globalData.userinfo.oic
      app.sendQueryMsg(
        {
          map: { FACTORYNAME: this.data.factoryname, EVENTUSER: userinfo.userid },
          list: this.data.scanlist,
          userid: userinfo.userid,
          env: userinfo.env,
          //service: "queryppboxlistinfo",
          service: "querypackboxlistinfo",
          success: (res) => {
            console.log(res)
            let key = 'nocompletescanlist' + this.data.factoryname + this.data.machinename + this.data.libraryslot
            wx.removeStorage({
              key: key,
            })
            
            app.checkReurnDATALIST(
              {
                res: res,
                success: (res) => {
                  console.log(res)
                  this.data.scanlist.length = 0
                  let list = res
                  for (let i = 0; i < list.length; i++) {
                    this.setListData(list[i])
                  }
                  this.data.maskshow = false
                  this.setData(
                    {
                      boxdata: this.data.boxdata,
                      maskshow: false,
                      scanlist: this.data.scanlist
                    }
                  )
                },
                fail: (err) => {
                  this.queryBoxlisFail(null);
                }
              }
            )
          },
          fail: (err) => {
            this.queryBoxlisFail(null);
          }


        }
      )
    }

  },//end function

  queryBoxlisFail: function (res) {
    wx.showModal({
      cancelColor: 'cancelColor',
      showCancel: false,
      title: "数据请求失败",
      content: '由于网络或后台服务器等原因，PPBOX数据下载失败，数据将缓存手机中'
    })
    let key = 'nocompletescanlist' + this.data.factoryname + this.data.machinename + this.data.libraryslot
    wx.setStorage({
      data: this.data.scanlist,
      key: key,
    })
  },//end function

  getStorageBoxdataData: function (arg) {
    let complete = arg.complete
    let key = 'nosubmitboxdata' + this.data.factoryname + this.data.machinename + this.data.libraryslot
    console.log(key)
    wx.getStorage({
      key: key,
      success: (res) => {
        console.log(res)
        complete(res.data)
      },
      fail: (res) => {
        complete(null)
      }
    })

  },//end function

  getStorageScanListData: function (arg) {
    let complete = arg.complete
    let key = 'nocompletescanlist' + this.data.factoryname + this.data.machinename + this.data.libraryslot
    wx.getStorage({
      key: key,
      success: (res) => {
        complete(res.data)
      },
      fail: (res) => {
        complete(null)
      }
    })

  },//end function

  setStorageData: function (arg) {
    let scan = arg.scan
    let box = arg.box
    let boxdata = arg.boxdata
    let datalist = arg.datalist
    let scanlist = arg.scanlist
    if (scan || box) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '存在未完成的数据',
        content: '手机存在上次未未完成的数据，是否继续？',
        success: (res) => {
          if (res.confirm) {
            let num = scan ? 1 : 0 + box ? 2 : 0
            console.log("num="+num)
            switch (num) {
              case 1:
                {
                  this.data.scanlist = scanlist
                  this.data.maskshow = true
                  this.setData(
                    {
                      maskshow: true,
                      scanlist: this.data.scanlist
                    }
                  )
                  break
                }
              case 2:
                {
                  this.data.boxdata = boxdata
                  this.data.datalist = datalist
                  this.setData(
                    {
                      boxdata: this.data.boxdata,
                      datalist: this.data.datalist
                    }
                  )
                  break
                }
              case 3:
                {
                  this.data.scanlist = scanlist
                  this.data.maskshow = true
                  this.data.boxdata = boxdata
                  this.data.datalist = datalist
                  this.setData(
                    {
                      databox: this.data.databox,
                      datalist: this.data.datalist,
                      maskshow: true,
                      scanlist: this.data.scanlist
                    }
                  )
                  break
                }
              default:
                {
                  break
                }
            }
          } else {
            wx.removeStorage({
              key: 'nosubmitboxdata' + this.data.factoryname + this.data.machinename + this.data.libraryslot,
            })
            wx.removeStorage({
              key: 'nosubmitboxdata' + this.data.factoryname + this.data.machinename + this.data.libraryslot,
            })

          }

        }
      })
    }
  },//end function

  checkBoxDataDuplication: function (arg) {
    console.log(this.data.boxdata)
    let label = arg.label
    let complete = arg.complete
    if (this.data.boxdata[0].row.length < 1) {
      complete({ label: label, result: false })
    } else {
      let found = false
      for (let i = 0; i < this.data.boxdata[0].row.length; i++) {
        console.log(this.data.boxdata[0].row[i])
        if (this.data.boxdata[0].row[i].value == label) {
          console.log("boxdata found label:" + label)
          found = true
          break;
        } else {
          if (i == this.data.boxdata[0].row.length - 1) {
            //complete({label:label,result:false})
            console.log("box data not  found label:" + label)
            break
          } else {
            continue
          }
        }
      }
      complete({ label: label, result: found })
    }

  },//end function

  checkScanListDuplication: function (arg) {
    let label = arg.label
    let complete = arg.complete
    if (this.data.scanlist.length < 1) {
      complete({ label: label, result: false })
    } else {
      let found = false
      for (let i = 0; i < this.data.scanlist.length; i++) {
        if (this.data.scanlist[i].PACKINGLABELID == label) {
          //complete({label:label,result:true})
          found = true
          break
        } else {
          if (i == this.data.scanlist.length - 1) {
            //complete({label:label,result:false})
            found = false
            break
          } else {
            continue
          }
        }
      }
      complete({ label: label, result: found })
    }
  }


})