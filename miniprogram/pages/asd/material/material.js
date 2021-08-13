// miniprogram/pages/asd/material/material.js
const app = getApp()
const util = require("../utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*
     showActionsheet: true,
     groups: [
       { text: '示例菜单', value: 1 },
       { text: '示例菜单', value: 2 },
       { text: '负向菜单', type: 'warn', value: 3 }
     ] */
    materialtype: null,
    datalist: null,
    selectrowinfo: null,
    materialnamelist: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('options:', options)
    this.data.materialtype = options.materialtype
    let mtstr = options.materiallist
    let mts = mtstr.split(';')
    this.data.materialnamelist = mts
    let sqlcdn = ' AND MATERIALNAME IN ('
    for (let i = 0; i < mts.length; i++) {
      if (i == mts.length - 1) {
        sqlcdn = sqlcdn + " '" + mts[i] + "')"
      } else {
        sqlcdn = sqlcdn + " '" + mts[i] + "', "
      }

    }
    console.log('condiction str:', sqlcdn)
     
    this.getPrivilageInfo(
      {
        success:(res)=>
      {
        this.getMaterialListInfo({ sqlcdn: sqlcdn })
      },
      fail:(err)=>
      {
        this.getMaterialListInfo({ sqlcdn: sqlcdn })
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
        let maskheight = result.windowHeight - 100
        let width = result.windowWidth
        this.setData({
          height: result.windowHeight,
          maskheight: maskheight,
          width: width
        })
      },
    })
    // this.getPrivilageInfo(null)
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

  close: function () {



  },
  btnClick(e) {
    /*
    console.log(e)
    this.close() */
  },//end function

  getMaterialListInfo(arg) {
    let sqlcdn = arg.sqlcdn
    let userinfo = app.globalData.userinfo.oic
    util.sendQueryMsg(
      {
        env: userinfo.env,
        userid: userinfo.userid,
        queryid: 'GetMaterialList',
        service: 'asdcommonquerysrv',
        map: { PAGE_NAME: 'material', TABLE_NAME: 'materiallist', TABLE_SETTING: 'Y', HEADER_SETTING: 'Y', EVENTUSER: userinfo.userid, CONDITION: sqlcdn },
        success: (res) => {
          console.log('GetMaterialList result:', res)
          this.data.selectrowinfo = null

          this.setMaterialData(res)
        },
        fail: (err) => {
          console.log(err)
          this.errpop('数据获取失败','err')

        }
      }
    )

  },//end function

  setMaterialData(res) {
    let body = res.result.Message.Body
    let mts = body.materiallist
    let setting = mts.setting
    let headers = mts.headers
    let rowothercolors = null
    // let tabledata =mts.DATALIST
    if (setting.rowothercolors != undefined && setting.rowothercolors != null) {
      rowothercolors = setting.rowothercolors
    }
    this.data.datalist = (mts.DATALIST.DATA == undefined || mts.DATALIST.DATA == null) ? mts.DATALIST : [{ DATA: mts.DATALIST.DATA }]
    this.setData(
      {

        setting: setting,
        tabledata: { datalist: mts.DATALIST, headers: headers, attachcolor: { rowothercolors: rowothercolors } },
        selectrowinfo: this.data.selectrowinfo
      }
    )
  },//end function
  getPrivilageInfo(arg) {
    let cdn = " AND SUPERMENUNAME LIKE 'Material_Operation%' OR SUPERMENUNAME LIKE 'Material_Hold%' "
    let userinfo = app.globalData.userinfo.oic
    let success=arg.success
    let fail=arg.fail
    util.sendQueryMsg({
      env: userinfo.env,
      userid: userinfo.userid,
      queryid: 'GetMenuListByCondition',
      map: { USERID: userinfo.userid, CONDITION: cdn },

      success: (res) => {

        console.log('getPrivilageInfo:', res)
        let datalist = res.result.Message.Body.DATALIST
        let list = (datalist.DATA == undefined || datalist.DATA == null) ? datalist : [{ DATA: datalist.DATA }]
        let menulist = {}
        if (list.length > 0) {
          list.forEach(el => {
            menulist[el.DATA.MENUNAME] = true
          });
        }
        console.log('menulist:', menulist)
        this.setData({
          menulist: menulist
        })
        success(res)

      },
      fail: (err) => {
        this.errpop('数据获取失败','err')
      }

    })
  },//end function
  stockinClick(arg) {


  },//end function

  stockoutClick(arg) {
    this.setData(
      {
        maskshow: true,
        operation: 'stockoutoper',
        operationtext: '确定出库'
      }
    )

  },//end function

  stockoutoper(arg) {
    console.log('stockout arg:', arg)
    let comment = arg.detail.value.comment
    if (comment.length < 0) {
      this.errpop('备注信息错误', '请输入备注信息')
    } else {


      this.sendStockOutEvent({
        comment: comment
      })
      this.setData(
        {
          maskshow: false
        }
      )
    }

  },//end function

  sendStockOutEvent(arg) {
    let comment = arg.comment
    let materiallist = { MATERIALLIST: [] }
    let stkoutlist = []

    this.data.datalist.forEach(dt => {
      console.log("foreach dt:", dt)
      let data = dt.DATA
      stkoutlist.push({
        MATERIAL: {
          MATERIALNAME: data.MATERIALNAME,
          MATERIALTYPE: data.MATERIALTYPE,
          RESOURCETYPE: 'Consumable'
        }
      })

    });
    let mtsstr = util.parseObjectToXml(stkoutlist, '').toString()
    console.log('MATERIALLIST STRING:', mtsstr)
    let userinfo = app.globalData.userinfo.oic

    util.sendEventMsg({
      env: userinfo.env,
      userid: userinfo.userid,
      messagename: 'StockOutMaterial',
      map: { EVENTUSER: userinfo.userid, FACTORYNAME: userinfo.factory, EVENTCOMMENT: 'WX Stockout:' + comment },
      body: { MATERIALLIST: stkoutlist },
      success: (res) => {
        console.log('StockOutMaterial result:', res)
        let rtn = res.result.Message.Return
        if (rtn.RETURNCODE == '0') {
          wx.showToast({
            title: '出库成功',
            duration: 800
          })
          this.refreshdata(null)
        } else {
          wx.showModal({
            cancelColor: 'cancelColor',
            showCancel: false,
            title: '出库操作失败',
            content: rtn.RETURNMESSAGE
          })
        }
      },
      fail: (err) => {
        this.errpop('数据获取失败','err')
      }

    })

  },//end function

  stockinClick(arg) {
    let userinfo = app.globalData.userinfo.oic
    util.sendQueryMsg({
      userid: userinfo.userid,
      env: userinfo.env,
      queryid: 'GetMaterialStockList',
      map: { EVENTUSER: userinfo.userid, ENUMGROUP: userinfo.factory },
      success: (res) => {
        console.log('GetMaterialStockList:', res)
        let datalist = res.result.Message.Body.DATALIST
        let list = (datalist.DATA == undefined || datalist.DATA == null) ? datalist : [{ DATA: datalist.DATA }]
        this.setData({
          maskshow: true,
          operation: 'stockinope',
          operationtext: '确认入库',
          stocklist: list
        })
      },
      fail: (err) => {
        this.errpop('数据获取失败','err')
      }
    })

  },//end function
  stockinope(arg) {
    console.log('stockinope arg:', arg)
    let value = arg.detail.value
    let num = (value.radio.length < 1 ? 1 : 0) + (value.comment.length < 1 ? 2 : 0)
    switch (num) {
      case 0:
        {
          this.sendStockinEvent({
            comment: value.comment,
            stkbank: value.radio
          })
          break
        }
      case 1:
        {
          erraction('stock位置错误', '请选择stock位置信息')
          break
        }
      case 2:
        {
          erraction('备注信息错误', '请输入备注信息')
          break
        }
      default:
        {
          erraction('stock位置错误', '请选择stock位置信息')
          break
        }
    }
    function erraction(title, text) {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel: false,
        title: title,
        content: text
      })
    }
  },//end function

  sendStockinEvent(arg) {
    let comment = arg.comment
    let stkbank = arg.stkbank
    let userinfo = app.globalData.userinfo.oic
    let mts = this.data.datalist
    let date = new Date()
    let datestring = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') + date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0') + date.getSeconds().toString().padStart(2, '0')



    console.log('sendStockinEvent mts:', mts)
    let stockinlist = []

    mts.forEach(dt => {
      console.log("foreach dt:", dt)
      let data = dt.DATA
      let expdatestr = ''
      if (data.EXPIRATIONDATE.length > 0) {
        let expdate = new Date(data.EXPIRATIONDATE)
        expdatestr = expdate.getFullYear().toString() + (expdate.getMonth() + 1).toString().padStart(2, '0') + expdate.getDate().toString().padStart(2, '0') + expdate.getHours().toString().padStart(2, '0') + expdate.getMinutes().toString().padStart(2, '0') + expdate.getSeconds().toString().padStart(2, '0')
      }

      console.log("foreach dt:", dt)
      stockinlist.push({
        MATERIAL: {
          MATERIALNAME: data.MATERIALNAME,
          MATERIALTYPE: data.MATERIALTYPE,
          RESOURCETYPE: 'Consumable',
          USEDQUANTITY: '0',
          MATERIALLOCATION: stkbank,
          EXPIRATIONDATE: expdatestr,
          UNFREEZESTART: datestring
        }
      })

    });
    util.sendEventMsg({
      env: userinfo.env,
      userid: userinfo.userid,
      messagename: 'StockInMaterial',
      map: { EVENTUSER: userinfo.userid, EVENTCOMMENT: comment, FACTORYNAME: userinfo.factory },
      body: { MATERIALLIST: stockinlist },
      success: (res) => {
        console.log('SendStockinEvent res:', res)
        let rtn = res.result.Message.Return
        if (rtn.RETURNCODE == '0') {
          wx.showToast({
            title: '入库操作成功',
            duration: 800
          })
          this.setData({
            maskshow: false
          })
          this.refreshdata(null)
        } else {
          this.errpop('入库操作失败', rtn.RETURNMESSAGE)
        }
      },
      fail: (err) => {
        this.errpop('入库操作失败', err)
      }
    })

  },// end function


  defoamingClick(arg) {
    this.setData(
      {
        operation: 'defoamingope',
        operationtext: '确定脱泡',
        maskshow: true

      }
    )

  },//end function

  defoamingope(arg) {
    console.log(arg)
    this.sendDefoamingEvent(
      {
        comment: arg.detail.value.comment
      }
    )

  },//end function


  opecancelClick(arg) {
    this.setData(
      {
        maskshow: false
      }
    )
  },//end function

  sendDefoamingEvent(arg) {
    let userinfo = app.globalData.userinfo.oic
    let comment = arg.comment
    if (comment.length < 1) {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel: false,
        title: '备注信息错误',
        content: '请输入备注信息'
      })
    } else {
      let mts = this.data.datalist
      console.log('sendDefoamingEvent mts:', mts)
      let defoaminglist = []

      mts.forEach(dt => {
        console.log("foreach dt:", dt)
        let data = dt.DATA
        defoaminglist.push({
          MATERIAL: {
            MATERIALNAME: data.MATERIALNAME,
            MATERIALTYPE: data.MATERIALTYPE,
            FACTORYNAME: userinfo.factory
          }
        })

      });

      console.log('defoaminglist:', defoaminglist)

      util.sendEventMsg({
        env: userinfo.env,
        userid: userinfo.userid,
        map: { EVENTUSER: userinfo.userid, EVENTCOMMENT: comment },
        messagename: 'DefoamingMaterial',
        body: { MATERIALLIST: defoaminglist },
        success: (res) => {
          console.log("DefoamingMaterial res:", res)
          let rtn = res.result.Message.Return
          if (rtn.RETURNCODE == '0') {
            wx.showToast({
              title: '脱泡操作成功',
              duration: 800
            })
            this.setData({
              maskshow: false
            })
            this.refreshdata(null)
          } else {
            this.errpop('脱泡操作失败', rtn.RETURNMESSAGE)
          }

        },
        fail: (err) => {
          this.errpop('数据获取失败','err')
        }

      })
    }

  },//end function

  errpop(title, text) {
    wx.showModal({
      cancelColor: 'cancelColor',
      showCancel: false,
      title: title,
      content: text
    })

  },//end function

  openClick(arg) {
    this.setData(
      {
        operation: 'openope',
        operationtext: '确定开封',
        maskshow: true
      }
    )

  },//end function

  openope(arg) {
    let comment = arg.detail.value.comment
    if (comment.length < 1) {
      this.errpop('备注信息错误', '请输入备注信息')

    } else {
      this.sendOpenEvent({
        comment: comment
      })
    }

  },//end function
  sendOpenEvent(arg) {
    let comment = arg.comment
    let userinfo = app.globalData.userinfo.oic
    let date = new Date()
    let datestring = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') + date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0') + date.getSeconds().toString().padStart(2, '0')
    let mts = this.data.datalist
    let openlist = []

    mts.forEach(dt => {
      let data = dt.DATA
      let expdatestr = ''
      if (data.EXPIRATIONDATE.length > 0) {
        let expdate = new Date(data.EXPIRATIONDATE)
        expdatestr = expdate.getFullYear().toString() + (expdate.getMonth() + 1).toString().padStart(2, '0') + expdate.getDate().toString().padStart(2, '0') + expdate.getHours().toString().padStart(2, '0') + expdate.getMinutes().toString().padStart(2, '0') + expdate.getSeconds().toString().padStart(2, '0')
      }
      /*
      let expdate=new Date(data.EXPIRATIONDATE)
      let expdatestr=expdate.getFullYear().toString() + (expdate.getMonth() + 1).toString().padStart(2, '0') + expdate.getDate().toString().padStart(2, '0') + expdate.getHours().toString().padStart(2, '0') + expdate.getMinutes().toString().padStart(2, '0') + expdate.getSeconds().toString().padStart(2, '0')
      console.log("foreach dt:",dt) */

      openlist.push({
        MATERIAL: {
          MATERIALNAME: data.MATERIALNAME,
          OPENDATE: datestring,
          EXPIRATIONDATE: expdatestr
        }
      })

    })

    util.sendEventMsg({
      env: userinfo.env,
      userid: userinfo.userid,
      map: { EVENTUSER: userinfo.userid, EVENTCOMMENT: comment },
      messagename: 'OpenMaterial',
      body: { MATERIALLIST: openlist },
      success: (res) => {
        console.log("DefoamingMaterial res:", res)
        let rtn = res.result.Message.Return
        if (rtn.RETURNCODE == '0') {
          wx.showToast({
            title: '开封操作成功',
            duration: 800
          })
          this.setData({
            maskshow: false
          })
          this.refreshdata(null)
        } else {
          this.errpop('openlist操作失败', rtn.RETURNMESSAGE)
        }

      },
      fail: (err) => {
        this.errpop('数据获取失败','err')
      }

    })

  },//end function

  rowClick(arg) {
    console.log('rowClick info:', arg)
    this.data.selectrowinfo = arg.detail.rowdata
    this.setData(
      {
        selectrowinfo: arg.detail.rowdata
      }
    )
  },//end function

  releaseholdClick(arg) {
    if (this.data.selectrowinfo == null) {
      this.errpop('未选择物料', '请先选择解扣的物料')
    } else {
      this.setData({
        operation: 'releaseholdope',
        operationtext: '确定解扣',
        maskshow: true,
        selectrowinfo: this.data.selectrowinfo
      })
    }

  },//end function

  releaseholdope(arg) {
    console.log('releaseholdope arg:', arg)
    let userinfo = app.globalData.userinfo.oic
    let comment = arg.detail.value.comment
    if (comment.length > 0) {
      this.sendReleaseHoldEvent(
        {
          comment: comment
        }
      )
    } else {
      this.errpop('备注信息错误', '请输入备注信息')
    }
  },//end function
  sendReleaseHoldEvent(arg) {
    let data = this.data.selectrowinfo
    let userinfo = app.globalData.userinfo.oic
    let comment = arg.comment
    let rlsholdlist = []
    rlsholdlist.push(
      {
        MATERIAL: { MATERIALNAME: data.MATERIALNAME, RESOURCETYPE: 'Consumable', MATERIALHOLDSTATE: data.MATERIALHOLDSTATE }
      }
    )
    util.sendEventMsg({
      env: userinfo.env,
      userid: userinfo.userid,
      messagename: 'ReleaseHoldMaterial',
      map: { EVENTCOMMENT: comment, EVENTUSER: userinfo.userid },
      body: { MATERIALLIST: rlsholdlist },
      success: (res) => {
        console.log('sendReleaseHoldEvent res:', res)
        let rtn = res.result.Message.Return
        if (rtn.RETURNCODE == '0') {
          wx.showToast({
            title: '解扣操作成功',
            duration: 800
          })
          this.setData(
            {
              maskshow: false
            }
          )
          this.refreshdata(null)

        } else {
          this.errpop('解扣操作失败', rtn.RETURNMESSAGE)
        }

      },
      fail: (err) => {
        this.errpop('数据获取失败','err')
      }

    })
  },//end function

  refreshdata(arg) {

    let mts = this.data.materialnamelist
    let sqlcdn = ' AND MATERIALNAME IN ('
    for (let i = 0; i < mts.length; i++) {
      if (i == mts.length - 1) {
        sqlcdn = sqlcdn + " '" + mts[i] + "')"
      } else {
        sqlcdn = sqlcdn + " '" + mts[i] + "', "
      }

    }
    console.log('condiction str:', sqlcdn)

    this.getMaterialListInfo({ sqlcdn: sqlcdn })


  },//end function



})