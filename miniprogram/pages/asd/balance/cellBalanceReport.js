// miniprogram/pages/asd/balance/cellBalanceReport.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originaltext: '点我选择',
    fromdate: '点我选择',
    enddate: '点我选择',
    productiontype: ['P', 'E', 'D'],
    productiontypeidx: 0,
    type: 'P',
    products: [],
    product: '点我选择',
    productidx: null,
    balancelist: [{ col: "TFT/CF", row: [] }, { col: "产品型号", row: [] }, { col: "类型", row: [] }, { col: "待PI", row: [] }, { col: "已投PI", row: [] }, { col: "待RUB", row: [] }, { col: "已投RUB", row: [] }, { col: "待ODF", row: [] }, { col: "已投ODF", row: [] }, { col: "ODF产出", row: [] }, { col: "总报废", row: [] }, { col: "待打包", row: [] }, { col: "车间仓", row: [] }, { col: "待出货", row: [] }],

    balanceinfo: [{ col: "TFT/CF", row: [] }, { col: "待STB", row: [] }, { col: "待接收", row: [] }, { col: "待PI", row: [] }, { col: "已投PI", row: [] }, { col: "PI报废", row: [] }, { col: "待RUB", row: [] }, { col: "已投RUB", row: [] }, { col: "RUB报废", row: [] }, { col: "待ODF", row: [] }, { col: "已投ODF", row: [] }, { col: "ODF报废", row: [] }, { col: "ODF产出", row: [] }, { col: "总报废", row: [] }, { col: "待打包", row: [] }, { col: "车间仓", row: [] }, { col: "待出货", row: [] }],

    wHeight: 500,
    wWidth: 500,

    waitstbs: [{ col: "TFT/CF", row: [] }, { col: "类型", row: [] }, { col: "产品型号", row: [] }, { col: "待STB", row: [] }, { col: "待接收", row: [] }],

    scrapinfo: { tft: { allwaitstb: 0, allwaitrcv: 0, allpicrp: 0, allrubcrp: 0, allodfcrp: 0 }, cf: { allwaitstb: 0, allwaitrcv: 0, allpicrp: 0, allrubcrp: 0, allodfcrp: 0 } },
    cfprodctname: null,
    backitoinfo: [{ col: "待清洗", row: [] }, { col: "待热烘", row: [] }, { col: "待整列", row: [] }, { col: "待镀膜", row: [] }, { col: "待打包", row: [] }, { col: "车间仓", row: [] }, { col: "待出货", row: [] }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (result) => {
        console.log(result)
        this.data.wHeight = result.windowHeight
        this.data.wWidth = result.windowWidth
        this.setData(
          {
            wHeight: this.data.wHeight,
            wWidth: this.data.wWidth
          }
        )

      },
    })

    this.setProductSpec({
      ptype: 'P'
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

  fromDateChange: function (res) {
    console.log(res)
    this.data.fromdate = res.detail.value
    this.setData(
      {
        fromdate: this.data.fromdate
      }
    )
  },//end function

  endDateChange: function (res) {
    console.log(res)
    this.data.enddate = res.detail.value
    this.setData(
      {
        enddate: this.data.enddate
      }
    )
  }, //end function

  productionTypeChange: function (res) {
    if (this.data.type != this.data.productiontype[res.detail.value]) {
      this.data.type = this.data.productiontype[res.detail.value]
      this.setProductSpec(
        {
          ptype: this.data.type,
        }
      )

      this.setData(
        {
          type: this.data.type
        }
      )


    }

  },//end function

  productChange: function (res) {
    if (this.data.product != this.data.products[res.detail.value].TOPRODUCTSPECNAME) {
      this.data.product = this.data.products[res.detail.value].TOPRODUCTSPECNAME
      this.data.productidx = res.detail.value
      this.setData(
        {
          product: this.data.product
        }
      )

    }

  },//end function

  queryClick: function (res) {
    this.cleanWaitSTBData();
    this.cleanTableData(
      {
        list: this.data.balancelist
      }
    )
    this.cleanTableData(
      {
        list: this.data.balanceinfo
      }
    )
    this.cleanTableData(
      {
        list: this.data.backitoinfo
      }
    )
    let scp = this.data.scrapinfo
    scp.tft.allwaitrcv = 0
    scp.tft.allwaitrcv = 0
    scp.tft.allpicrp = 0
    scp.tft.allrubcrp = 0
    scp.tft.allodfcrp = 0
    scp.cf.allwaitrcv = 0
    scp.cf.allwaitrcv = 0
    scp.cf.allpicrp = 0
    scp.cf.allrubcrp = 0
    scp.cf.allodfcrp = 0
    this.data.cfprodctname = null
    let tx = this.data.originaltext
    let data = this.data
    let f = ""
    let e = ""

    console.log(tx)
    if (data.fromdate != tx && data.enddate != tx && data.product != tx) {
      let from = new Date(data.fromdate)
      let end = new Date(data.enddate)
      f = from.getFullYear().toString() + (from.getMonth() + 1).toString().padStart(2, '0') + from.getDate().toString().padStart(2, '0') + "000000"
      e = end.getFullYear().toString() + (end.getMonth() + 1).toString().padStart(2, '0') + end.getDate().toString().padStart(2, '0') + "235959"
      console.log(f)
      console.log(e)
      console.log(data.product)
      let userinfo = app.globalData.userinfo.oic
      let map = { TOTIME: e, FROMTIME: f, PRODUCTSPECNAME: data.product, PRODUCTIONTYPE: data.type, EVENTUSER: userinfo.userid }
      this.downloadData(
        {
          map: map,
          success: (res) => {

          },
          fail:this.downloadfail
        }
      )

    }
  },//end function

  setProductSpec: function (arg) {
    let ptype = arg.ptype
    let success = arg.success
    let fail = arg.fail
    app.sendQueryMsg({
      userid: app.globalData.userinfo.oic.userid,
      env: app.globalData.userinfo.oic.env,
      queryid: 'GetProductSpecListForCell',
      map: { PRODUCTIONTYPE: ptype, EVENTUSER: app.globalData.userinfo.oic.userid },
      success: (res) => {
        console.log(res)
        app.checkReurnDATALIST({
          res: res,
          success: (list) => {
            this.data.products = list
            {
              this.setData({
                products: list
              })
            }
          },
          fail: (err) => {

          }
        })

      },
      fail: (err) => {

      }
    })

  },//end function



  setWaitSTB: function (arg) {
    let type = arg.type
    let list = arg.list
    let success = arg.success
    let waitstbs = this.data.waitstbs
    let scp = type == 'TFT' ? this.data.scrapinfo.tft : this.data.scrapinfo.cf
    for (let i = 0; i < list.length; i++) {
      waitstbs[0].row.push(type)
      waitstbs[1].row.push(list[i].PRODUCTIONTYPE)
      waitstbs[2].row.push(list[i].PRODUCTSPECNAME)
      waitstbs[3].row.push(list[i].WAITSTBQTY)
      waitstbs[4].row.push(list[i].WAITRECEIVEQTY)
      try {
        let scnt = parseInt(list[i].WAITSTBQTY)
        scp.allwaitstb = scnt + scp.allwaitstb
        let rcnt = parseInt(list[i].WAITRECEIVEQTY)
        scp.allwaitrcv = rcnt + scp.allwaitrcv
      } catch (err) {
        console.log(err)
      }
    }
    console.log(waitstbs)
    let balanceinfo = this.data.balanceinfo
    balanceinfo[1].row.push(scp.allwaitstb)
    balanceinfo[2].row.push(scp.allwaitrcv)
    this.setData(
      {
        waitstbs: waitstbs,
        balanceinfo: balanceinfo
      }
    )
    if (success != undefined && success != null) {
      success(list)
    }
  },//end function

  setBackItoData: function (arg) {
    let list = arg.list
    let success = arg.success
    let bo = this.data.backitoinfo
    for (let i = 0; i < list.length; i++) {
      bo[0].row.push(list[i].BACKITOICL)
      bo[1].row.push(list[i].BACKITOANN)
      bo[2].row.push(list[i].BACKITOALIGN)
      bo[3].row.push(list[i].BACKITOITO)
      bo[4].row.push(list[i].BACKITOPACK)
      bo[5].row.push(list[i].BACKITOBNK)
      bo[6].row.push(list[i].BACKITOSHIP)
    }
    this.setData(
      {
        backitoinfo: bo
      }
    )
    if (success != undefined && success != null) {
      success(list)
    }


  }, //end function




  cleanWaitSTBData: function (arg) {
    let waitstbs = this.data.waitstbs
    for (let i = 0; i < waitstbs.length; i++) {
      waitstbs[i].row.length = 0
    }
  },//end function




  cleanWaitSTBData: function (arg) {
    let waitstbs = this.data.waitstbs
    for (let i = 0; i < waitstbs.length; i++) {
      waitstbs[i].row.length = 0
    }
  },//end function

  setBalanceListData: function (arg) {
    let list = arg.list
    let success = arg.success
    let fail = arg.fail
    let type = arg.type
    let bl = this.data.balancelist
    let bi = this.data.balanceinfo
    for (let i = 0; i < list.length; i++) {
      console.log(list[i].PRODUCTSPECNAME)
      bl[0].row.push(type)

      bl[1].row.push(list[i].PRODUCTSPECNAME)
      if (this.data.cfprodctname == null && type == 'CF') {
        this.data.cfprodctname = list[i].PRODUCTSPECNAME
      }
      bl[2].row.push(list[i].PRODUCTIONTYPE)
      bl[3].row.push(list[i].WAITPIQTY)
      bl[4].row.push(list[i].PITRACKINQTY)

      bl[5].row.push(list[i].WAITRUBQTY)
      bl[6].row.push(list[i].RUBTRACKINQTY)

      bl[7].row.push(list[i].WAITODFQTY)
      bl[8].row.push(list[i].ODFTRACKINQTY)

      bl[9].row.push(list[i].ODFTRACKOUTQTY)
      bl[10].row.push(list[i].ALLSCRAPQTY)
      bl[11].row.push(list[i].WAITPACKQTY)
      bl[12].row.push(list[i].WAITBNKQTY)
      bl[13].row.push(list[i].WAITSHIPQTY)

      bi[0].row.push(type)
      bi[3].row.push(list[i].WAITPIQTY)
      bi[4].row.push(list[i].PITRACKINQTY)
      bi[6].row.push(list[i].WAITRUBQTY)
      bi[7].row.push(list[i].RUBTRACKINQTY)
      bi[9].row.push(list[i].WAITODFQTY)
      bi[10].row.push(list[i].ODFTRACKINQTY)
      bi[12].row.push(list[i].ODFTRACKOUTQTY)
      bi[13].row.push(list[i].ALLSCRAPQTY)
      bi[14].row.push(list[i].WAITPACKQTY)
      bi[15].row.push(list[i].WAITBNKQTY)
      bi[16].row.push(list[i].WAITSHIPQTY)
    }
    console.log("print bl data")
    console.log(bl)
    this.setData(
      {
        balancelist: this.data.balancelist,
        balanceinfo: this.data.balanceinfo
      }
    )
    if (success != undefined && success != null) {
      success(bl)
    }
  },//end function

  cleanTableData: function (arg) {
    let list = arg.list
    let complete = arg.complete

    for (let i = 0; i < list.length; i++) {
      list[i].row.length = 0
    }
    if (complete != undefined && complete != null) {
      complete(list)
    }
  },//end function

  checkDATALIST: function (arg) {
    let datalist = arg.datalist
    let success = arg.success
    let fail = arg.fail
    let list = []

    console.log("Start check DATALIST")
    console.log(datalist)
    if (datalist != undefined && datalist != null && datalist.length != undefined && datalist.length > 0) {

      if (datalist[0].DATA != undefined) {
        for (let i = 0; i < datalist.length; i++) {
          list.push(datalist[i].DATA)
        }
        if (success != undefined && success != null) {
          success(list)
        }
      } else {
        if (fail != undefined && fail != null) {
          fail(list)
        }
      }
    } else {
      console.log("only one data")
      if (datalist.DATA != undefined && datalist.DATA != null) {
        list.push(datalist.DATA)
      }
      if (success != undefined && success != null) {
        success(list)
      } else {
        if (fail != undefined && fail != null) {
          fail(list)
        }
      }
    }
  },//end functon

  downloadData: function (arg) {
    let map = arg.map
    let userid = app.globalData.userinfo.oic.userid
    let env = app.globalData.userinfo.oic.env
    let success = arg.success
    let fail = arg.fail
    this.getTFTBlanceListData(
      {
        map: map,
        success: (tftres) => {
          this.getCFBlanceListData
            ({
              map: map,
              success: (cfres) => {
                this.getWaitSTBData({
                  map: map,
                  success: (res) => {
                    this.getTFTScrapInfo({
                      map: map,
                      success: (res2) => {
                        this.getCFScrapInfo(
                          {
                            map: map,
                            success: (res3) => {
                              if (success != undefined && success != null) {
                                success(res3)
                              }
                            },
                            fail: (err) => {
                              if (fail != undefined && fail != null) {
                                fail(err)
                              }
                            }
                          }
                        )
                      },
                      fail: (err) => {
                        if (fail != undefined && fail != null) {
                          fail(err)
                        }
                      }
                    })

                  },
                  fail: (err) => {
                    if (fail != undefined && fail != null) {
                      fail(err)
                    }
                  }
                })

              },
              fail: (err) => {
                if (fail != undefined && fail != null) {
                  fail(err)
                }
              }
            })
        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          }
        }
      }
    )


  },//end function

  getTFTBlanceListData: function (arg) {
    let userid = app.globalData.userinfo.oic.userid
    let env = app.globalData.userinfo.oic.env
    let success = arg.success
    let fail = arg.fail
    let map = arg.map
    app.sendQueryMsg({
      userid: userid,
      env: env,
      map: map,
      queryid: 'getBalanceListForTFT',
      success: (res) => {
        console.log(res)
        this.checkDATALIST
          (
            {
              datalist: res.result.Message.Body.DATALIST,
              success: (list) => {
                this.setBalanceListData(
                  {
                    list: list,
                    type: 'TFT',
                    success: (res2) => {
                      if (success != undefined && success != null) {
                        success(res2)
                      }
                    }
                  }
                )

              },
              fail: (err) => {

              }
            }
          )

      },
      fail: (err) => {
        console.log(err)
        if (fail != undefined && fail != null) {
          fail(err)
        }
      }

    })


  },//function
  getCFBlanceListData: function (arg) {
    let userid = app.globalData.userinfo.oic.userid
    let env = app.globalData.userinfo.oic.env
    let success = arg.success
    let fail = arg.fail
    let map = arg.map
    app.sendQueryMsg({
      userid: userid,
      env: env,
      map: map,
      queryid: 'getBalanceListForCF',
      success: (res) => {
        console.log(res)
        this.checkDATALIST
          (
            {
              datalist: res.result.Message.Body.DATALIST,
              success: (list) => {
                this.setBalanceListData(
                  {
                    list: list,
                    type: 'CF',
                    success: (res2) => {
                      if (success != undefined && success != null) {
                        success(res2)
                      }
                    }
                  }
                )

              },
              fail: (err) => {

              }
            }
          )
      },
      fail: (err) => {
        console.log(err)
        if (fail != undefined && fail != null) {
          fail(err)
        }
      }

    })


  },//function

  getTFTScrapInfo: function (arg) {
    let userid = app.globalData.userinfo.oic.userid
    let env = app.globalData.userinfo.oic.env
    let success = arg.success
    let fail = arg.fail
    let map = arg.map
    app.sendQueryMsg(
      {
        map: map,
        env: env,
        userid: userid,
        queryid: 'getCellScrapInfoForTFT',
        success: (res) => {
          console.log(res)
          let body = res.result.Message.Body
          if (body != undefined && body != null) {
            this.checkDATALIST({
              datalist: body.DATALIST,
              success: (list) => {
                if (list != undefined && list != null && list.length > 0) {
                  let bi = this.data.balanceinfo
                  for (let i = 0; i < list.length; i++) {
                    if (list[i].PROCESSOPERATIONNAME == undefined && list[i].PROCESSOPERATIONNAME == null) {
                      break
                    }
                    let op = list[i].PROCESSOPERATIONNAME

                    if (op.indexOf("ODF") > -1 && op.indexOf("GAP") == -1) {
                      bi[11].row.push(list[i].SCRAPQTY)
                    }
                    if (op.indexOf("RUB") > -1 && op.indexOf("GAP") == -1) {
                      bi[8].row.push(list[i].SCRAPQTY)
                    }
                    if (op.indexOf("PI") > -1 && op.indexOf("GAP") == -1) {
                      bi[5].row.push(list[i].SCRAPQTY)
                    }
                  }
                  this.setData(
                    {
                      balanceinfo: bi
                    }
                  )
                  if (success != undefined && success != null) {
                    success(list)
                  }
                } else {
                  if (success != undefined && success != null) {
                    success(list)
                  }
                }
              }
            })
          }
        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          }
        }
      })


  },//end function
  getCFScrapInfo: function (arg) {
    let userid = app.globalData.userinfo.oic.userid
    let env = app.globalData.userinfo.oic.env
    let success = arg.success
    let fail = arg.fail
    let map = arg.map
    if (map.PRODUCTSPECNAME != undefined && map.PRODUCTSPECNAME != null) {
      map.PRODUCTSPECNAME = this.data.cfprodctname
    }
    app.sendQueryMsg(
      {
        map: map,
        env: env,
        userid: userid,
        queryid: 'getCellScrapInfoForCF',
        success: (res) => {
          console.log(res)
          let body = res.result.Message.Body
          if (body != undefined && body != null) {
            this.checkDATALIST({
              datalist: body.DATALIST,
              success: (list) => {
                if (list != undefined && list != null && list.length > 0) {
                  let bi = this.data.balanceinfo
                  for (let i = 0; i < list.length; i++) {
                    if (list[i].PROCESSOPERATIONNAME == undefined && list[i].PROCESSOPERATIONNAME == null) {
                      break
                    }
                    let op = list[i].PROCESSOPERATIONNAME

                    if (op.indexOf("ODF") > -1 && op.indexOf("GAP") == -1) {
                      bi[11].row.push(list[i].SCRAPQTY)
                    }
                    if (op.indexOf("RUB") > -1 && op.indexOf("GAP") == -1) {
                      bi[8].row.push(list[i].SCRAPQTY)
                    }
                    if (op.indexOf("PI") > -1 && op.indexOf("GAP") == -1) {
                      bi[5].row.push(list[i].SCRAPQTY)
                    }
                  }
                  this.setData(
                    {
                      balanceinfo: bi
                    }
                  )
                  if (success != undefined && success != null) {
                    success(list)
                  }
                } else {
                  if (success != undefined && success != null) {
                    success(list)
                  }
                }
              }
            })
          }
        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          }
        }
      })


  },//end function

  getWaitSTBData: function (arg) {
    let userid = app.globalData.userinfo.oic.userid
    let env = app.globalData.userinfo.oic.env
    let success = arg.success
    let fail = arg.fail
    let map = arg.map
    app.sendQueryMsg(
      {
        map: map,
        env: env,
        userid: userid,
        service: 'querywaitstbinfo',
        success: (res) => {
          console.log(res)
          let body = res.result.Message.Body
          if (body != undefined && body != null) {
            if (body.TFTWAITSTB != undefined && body.TFTWAITSTB != null) {
              let tftstb = body.TFTWAITSTB
              this.checkDATALIST({
                datalist: tftstb.DATALIST,
                success: (list) => {
                  this.setWaitSTB({
                    list: list,
                    type: 'TFT',
                    success: (list) => {
                      let cfstb = body.CFWAITSTB
                      this.checkDATALIST({
                        datalist: cfstb.DATALIST,
                        success: (list2) => {
                          this.setWaitSTB(
                            {
                              list: list2,
                              type: 'CF',
                              success: (res3) => {
                                let backito = body.BACKITOBLANCE
                                console.log("Start check backito DATALIST")
                                console.log(backito.DATALIST)
                                this.checkDATALIST(
                                  {
                                    datalist: backito.DATALIST,
                                    success: (list3) => {
                                      this.setBackItoData(
                                        {
                                          list: list3,
                                          success: (res5) => {
                                            if (success != undefined && success != null) {
                                              success(res5)
                                            }
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
                      })

                    }
                  })

                },
                fail: (err) => {

                }
              })

            }


          } else {
            if (fail != undefined && fail != null) {
              fail({ errMsg: "No Data" })
            }
          }


        },
        fail: fail,
      }
    )
  },//end function

  downloadfail:function(arg)
  {

    this.cleanWaitSTBData();
    this.cleanTableData(
      {
        list: this.data.balancelist
      }
    )
    this.cleanTableData(
      {
        list: this.data.balanceinfo
      }
    )
    this.cleanTableData(
      {
        list: this.data.backitoinfo
      }
    )
    let scp = this.data.scrapinfo
    scp.tft.allwaitrcv = 0
    scp.tft.allwaitrcv = 0
    scp.tft.allpicrp = 0
    scp.tft.allrubcrp = 0
    scp.tft.allodfcrp = 0
    scp.cf.allwaitrcv = 0
    scp.cf.allwaitrcv = 0
    scp.cf.allpicrp = 0
    scp.cf.allrubcrp = 0
    scp.cf.allodfcrp = 0
    this.data.cfprodctname = null
    
    wx.showToast({
      title: '数据下载失败',
      icon:'error',
      duration:2500
    })
    this.setData(
      {
        balanceinfo:this.data.balanceinfo,
        balancelist:this.data.balancelist,
        waitstbs:this.data.waitstbs,
        backitoinfo:this.data.backitoinfo
      }
    )

     


  },//end function

})