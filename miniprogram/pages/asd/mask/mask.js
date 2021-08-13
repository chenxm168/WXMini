// miniprogram/pages/asd/mask/mask.js
const app = getApp()
const util = require("../utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableTitleContent: 'Mask信息列表',
    masknamelist: null,
    selectmaskinfo: null,
    opetype: 2,
    selectrowinfo: null,
    slotlist: null,
    slotidx: null,
    locationok:false,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:', options)
    let liststr = options.masklist
    let ls = liststr.split(';')
    this.data.masknamelist = ls

    this.getPrivilageInfo({
      success: (res) => {
        this.setData({
          menulist: res
        })
        this.getmasklistinfo({
          masklist: ls
        })
      },
      fail: (err) => {

      }
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
      // this.data.locationod = true

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
    wx.getSystemInfo({
      success: (result) => {
        let maskheight = result.windowHeight - 60
        let width = result.windowWidth
        this.setData({
          height: result.windowHeight,
          maskheight: maskheight,
          width: width
        })
      },
    })

      this.verifyLocation()


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

  getmasklistinfo(arg) {
    let uf = app.globalData.userinfo.oic
    let ls = arg.masklist
    let str = ' AND DURABLENAME IN ('
    for (let i = 0; i < ls.length; i++) {
      console.log('masklist ' + i + ':', ls[i])
      if (i == ls.length - 1) {
        let s = "'" + ls[i] + "') "
        str += s
      }
      else {
        let s = " '" + ls[i] + "', "
        str += s
      }
    }
    console.log('SQL IN STR:', str)
    /*
     let cdn=" AND (:FACTORYNAME IS NULL OR D.FACTORYNAME = :FACTORYNAME) AND (:DURABLESPECNAME IS NULL OR D.DURABLESPECNAME =:DURABLESPECNAME) AND (:DURABLETYPE IS NULL OR D.DURABLETYPE = :DURABLETYPE) AND (:DURABLESTATE IS NULL OR D.DURABLESTATE =:DURABLESTATE) AND (:DURABLEHOLDSTATE IS NULL OR D.DURABLEHOLDSTATE = :DURABLEHOLDSTATE) AND (:DURABLECLEANSTATE IS NULL OR DURABLECLEANSTATE = :DURABLECLEANSTATE) AND D.DURABLETYPE = 'PhotoMask' " +str+" ORDER BY D.DURABLENAME"
     */
    let cdn = "AND (:FACTORYNAME IS NULL OR D.FACTORYNAME = :FACTORYNAME)  AND D.DURABLETYPE = :DURABLETYPE " + str + " ORDER BY D.DURABLENAME"
    util.sendQueryMsg({
      env: uf.env,
      userid: uf.userid,
      queryid: 'GetMaskList',
      service: 'asdcommonquerysrv',
      map: { EVENTUSER: uf.userid, CONDITION: cdn, FACTORYNAME: uf.factory, PAGE_NAME: 'mask', TABLE_NAME: 'masklist', TABLE_SETTING: 'Y', HEADER_SETTING: 'Y' },
      success: (res) => {
        console.log('GetMaskList res:', res)
        this.setMasklistData(res)
      },
      fail: (err) => {
        this.errpop('请求数据失败',err)

      }

    })

  },//end function

  setMasklistData(res) {
    let body = res.result.Message.Body
    let mts = body.masklist
    let setting = mts.setting
    let headers = mts.headers
    let rowothercolors = null
    let that=this.data
    that.slotlist=null
    that.slotidx=null
    // let tabledata =mts.DATALIST
    if (setting.rowothercolors != undefined && setting.rowothercolors != null) {
      rowothercolors = setting.rowothercolors
    }
    this.data.datalist = (mts.DATALIST.DATA == undefined || mts.DATALIST.DATA == null) ? mts.DATALIST : [{ DATA: mts.DATALIST.DATA }]
    this.setData(
      {

        setting: setting,
        tabledata: { datalist: mts.DATALIST, headers: headers, attachcolor: { rowothercolors: rowothercolors } },
        selectrowinfo: this.data.selectrowinfo,
        slotlist:null,
        slotidx:null
      }
    )

  },//end function

  getPrivilageInfo(arg) {
    let success = arg.success
    let fail = arg.fail
    let cdn = " AND SUPERMENUNAME LIKE 'CSTMask_Mask%' "
    util.getPrivilageInfo({
      userinfo: app.globalData.userinfo.oic,
      cdn: cdn,
      success: success,
      fail: fail
    })

  },//end function

  opetypeChange(arg) {
    console.log('opetypeChange:', arg)
    this.data.opetype = arg.detail.value

  },//end function
  rowClick(arg) {
    console.log('rowClick arg:', arg)
    this.data.selectrowinfo = arg.detail.rowdata
  },//end function

  stockinClick(arg) {
    if (this.data.selectrowinfo == null) {
      wx.showToast({
        title: '未选择MASK',
        icon: 'error',
        duration: 1500
      })

    } else {
      this.data.slotlist = null
      this.setData({
        slotidx: null,
        slotlist: null
      })
      this.getMaskStockList({
        userinfo: app.globalData.userinfo.oic,
        success: (res) => {
          this.data.slotidx == null
          this.setData({
            maskshow: true,
            operation: 'stockinope',
            operationtext: '确认入库',
            stocklist: res,

          })

        },
        fail: (err) => {

        }

      })
    }

  },//end function

  stockoutClick(arg) {
    let that = this.data
    that.slotlist = null
    that.slotidx = null
    this.setData({
      slotlist: null,
      slotidx: null
    })
    if (this.data.selectrowinfo == null) {
      wx.showToast({
        title: '未选择MASK',
        icon: 'error',
        duration: 1500
      })

    } else {
      this.getMaskStockList({
        userinfo: app.globalData.userinfo.oic,
        success: (res) => {
          this.setData({
            maskshow: true,
            operation: 'stockoutope',
            operationtext: '确认出库',
            stocklist: res
          })

        },
        fail: (err) => {

        }

      })
    }

  },//end function
  stockinope(arg) {
    console.log('stockinope arg', arg)
    
    let value=arg.detail.value
    if(value.stock.length<1)
    {
      wx.showToast({
        title: 'STOCK未选',
        icon:'error',
        duration:2000
      })
      return null
    }
    if(value.slotno==null)
    {
      wx.showToast({
        title: '槽位未选',
        icon:'error',
        duration:2000
      })
      return null
    }
    if(value.comment.length<1)
    {
      wx.showToast({
        title: '备注未填写',
        icon:'error',
        duration:2000
      })
      return null
    }
  
    let that=this.data
    let comment=value.comment
    let stockname=value.stock
    let slotno=value.slotno
    let stockerslot=value.slotno==null?'': that.slotlist[slotno].ENUMVALUE

    let maskinfo=[{maskname:that.selectrowinfo.DURABLENAME,stockerslot:stockerslot}]
          this.sendStockInOutEvent({
            userinfo:app.globalData.userinfo.oic,
            comment:comment,
            isin:true,
            stockname:stockname,
            maskinfo:maskinfo,
            success:(res)=>
            {
                console.log('stockin event res:',res)
                let rtn=res.result.Message.Return
                if(rtn.RETURNCODE=='0')
                {
                  this.setData({
                    maskshow:false
                  })
                  wx.showToast({
                    title: '入库操作成功',
                    duration:2000,
                    
                  })
                  this.refresh()
                }else
                {
                  this.errpop('入库操作失败',rtn.RETURNMESSAGE)
                }
            },
            fail:(err)=>
            {
              this.errpop('信息发送失败',err)
            }
          })


   
    

  },//end function

  stockoutope(arg) {
    let value=arg.detail.value
    let that=this.data
    console.log('stockoutope arg', arg)
    /*
    if(value.stock.length<1)
    {
      wx.showToast({
        title: 'STOCK未选',
        icon:'none',
        duration:2000
      })
      return null
    }  */

    if(value.comment.length<1)
    {
      wx.showToast({
        title: '备注未填写',
        icon:'error',
        duration:2000
      })
      return null
    }

    let comment=value.comment
     //let stockname=value.stock
    let stockname=that.selectrowinfo.MACHINENAME
    

    let maskinfo=[{maskname:that.selectrowinfo.DURABLENAME}]
          this.sendStockInOutEvent({
            userinfo:app.globalData.userinfo.oic,
            comment:comment,
            isin:false,
            stockname:stockname,
            maskinfo:maskinfo,
            success:(res)=>
            {
                console.log('stockout event res:',res)
                let rtn=res.result.Message.Return
                if(rtn.RETURNCODE=='0')
                {
                  this.setData({
                    maskshow:false
                  })
                  wx.showToast({
                    title: '出库操作成功',
                    duration:2000,
                    icon:'success'
                  })
                  this.refresh()
                }else
                {
                  this.errpop('出库操作失败',rtn.RETURNMESSAGE)
                }
            },
            fail:(err)=>
            {
              this.errpop('信息发送失败',err)
            }
          })




  },//end function

  getMaskStockList(arg) {
    let success = arg.success
    let fail = arg.fail
    let uf = arg.userinfo
    util.sendQueryMsg({
      env: uf.env,
      userid: uf.userid,
      queryid: 'GetMaskStokList',
      map: { EVENTUSER: uf.userid, FACTORYNAME: uf.factory, },
      success: (res) => {
        console.log('getMaskStockList res:', res)
        if (success != undefined && success != null) {
          let ls = res.result.Message.Body.DATALIST
          let dls = (ls.DATA == undefined || ls.DATA == null) ? ls : [{ DTAT: ls.DATA }]
          success(dls)
        }
      },
      fail: (err) => {
        if (fail != undefined && fail != null) {
          fail(err)
        }
      }
    })

  },//end function

  opecancelClick() {
    this.setData(
      { maskshow: false }
    )
  },

  errpop(title, text) {
    wx.showModal({
      cancelColor: 'cancelColor',
      showCancel: false,
      title: title,
      content: text
    })

  },//end function

  maskstockChange(arg) {
    console.log('maskstockChange', arg)
    this.data.slotidx = null
    let stk = arg.detail.value
    this.getMaskStockSlotList({
      userinfo: app.globalData.userinfo.oic,
      stk: stk,
      success: (res) => {
        this.data.slotlist = res
        this.setData({
          slotlist: res,
          slotidx: null
        })

      },
      fail: (err) => {

      }

    })
  },//end function

  getMaskStockSlotList(arg) {
    let success = arg.success
    let fail = arg.fail
    let uf = arg.userinfo
    let stk = arg.stk
    util.sendQueryMsg(
      {
        env: uf.env,
        userid: uf.userinfo,
        queryid: 'getMaskStockSlotList',
        map: { EVENTUSER: uf.userid, TAG: stk },
        success: (res) => {
          console.log('getMaskStockSlotList res:', res)
          if (success != undefined && success != null) {
            let ls = res.result.Message.Body.DATALIST
            let dls = (ls.DATA == undefined || ls.DATA == null) ? ls : [{ DTAT: ls.DATA }]
            let ls2 = []
            dls.forEach(el => {
              ls2.push(el.DATA)

            });

            console.log('stocklist:', ls2)
            success(ls2)

          }
        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          }
        }
      }
    )

  },//end function

  slotChange(arg) {
    console.log('slotChange arg', arg)
    this.data.slotidx = arg.detail.value
    this.setData({
      slotidx: this.data.slotidx
    })

  },//end function

  sendStockInOutEvent(arg) {
    let uf = arg.userinfo
    let success = arg.success
    let fail = arg.fail
    let isin = arg.isin
    let maskinfo = arg.maskinfo
    let masks = []
    let comment=arg.comment
    let stockname=arg.stockname
    if (isin) {
      maskinfo.forEach(el => {
        masks.push({
          STOCKINMASK: {
            MASKNAME: el.maskname,
            STOCKERSLOT: el.stockerslot
          }

        })

      });
    } else {
      maskinfo.forEach(el => {
        masks.push({
          STOCKOUTMASK: {
            MASKNAME: el.maskname,
          }
        })

      });
    }
    let body = isin ? { STOCKINMASKLIST: masks } : {STOCKOUTMASKLIST:masks}

    util.sendEventMsg({
      env:uf.env,
      userid:uf.userid,
      messagename:'StockInAndStockOutMask',
      map:{EVENTUSER:uf.userid,MACHINENAME:stockname,EVENTCOMMENT:comment,MACHINENAME:stockname},
      body:body,
      success:success,
      fail:fail
      


    })

  },//end function

  refresh()
  {
    this.data.selectrowinfo=null,
    
     this.getmasklistinfo(
       {
         masklist:this.data.masknamelist
       }
     )
  },// end function

  historyClick(arg)
  {
    let sl=this.data.selectrowinfo
    if(sl==null)
    {
      wx.showToast({
        title: 'MASK未选',
        icon:'error',
        duration:1500
      })
      return null
    }
    
    wx.navigateTo({
      url: 'maskhistory?maskname='+sl.DURABLENAME,
    })

  },//end function

  verifyLocation(arg)
  {
    let uf=app.globalData.userinfo.oic
    if(uf.env=='test')
    {
      this.data.locationok=true
      this.setData({
        locationok:true
      })
      return null
    }

    wx.showToast({
      title: '获取当前位置',
      duration: 3000
    })
    wx.getLocation({
      success:(res)=>
      {
        wx.hideToast({
          success: (res) => {},
        })
        app.verifyUserLocation({
          location: res,
          success:(res2)=>
          {
            console.log('verify location OK')
            this.data.locationok=true
            this.setData({
              locationok:true
            })
          },
          fail:(err)=>
          {
            wx.showToast({
              title: '验证位置失败',
              icon:'error'
            })
            this.data.locationok=false
            this.setData({
              locationok:false
            })
          }
        })
      }
    })
  }

})