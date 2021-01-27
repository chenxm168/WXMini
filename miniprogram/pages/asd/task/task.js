// miniprogram/pages/asd/task/task.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    header: null,
    rows: null,
    rawdata: null,
    //rawdata: null,
    cleantype: null,
    cleanstate: null,
    machinename: null,
    setting: null,
    onlyshowwarning: false,
    selectidx: null,
    btns: { execute: { show: false, text: "执行" }, modify: { show: false, text: "修改" }, check: { show: false, text: "核查" }, delay: { show: false, text: "推迟" } },
    nowstr: "",
    cleanresult: 'OK',
    tables: { tasklist: { header: null, setting: null, rows: null, rawdata: null }, partlist: { header: null, setting: { tabletile: '附属信息', tableminwidth: '400px' }, rows: null, rawdata: null } },




  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSystemInfo({
      success: (result) => {
        this.setData(
          {
            wHeight: result.windowHeight
          }
        )
      },
    })

    console.log(options)
    this.data.machinename = options.machinename
    this.data.cleanstate = options.cleanstate
    this.data.cleantype = options.cleantype

    this.getTaskList(
      {
        cleantype: options.cleantype,
        cleanstate: options.cleanstate,
        env: app.globalData.userinfo.pms.env,
        userid: app.globalData.userinfo.pms.userid,
        dept: app.globalData.userinfo.pms.usergroup,
        machinename: options.machinename.substr(0, 7),
        success: (res) => {
          this.data.header = res.header
          this.data.rows = res.rows
          this.data.rawdata = res.rawdata

          this.setData(
            {
              header: this.data.header,
              rows: this.data.rows,
              btns: this.data.btns
            }
          )
        },
        fail: (err) => {

        }
      }
    )
    let test = {}

    test['test1'] = 'test1value'
    console.log(test)
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
  getTaskList: function (arg) {
    let success = arg.success
    let fail = arg.fail
    let userid = arg.userid
    let env = arg.env
    let machinename = arg.machinename
    let cleantype = arg.cleantype
    let cleanstate = arg.cleanstate
    let dept = arg.dept
   // let dept = 'Administrator'
    app.sendQueryMsg(
      {
        env: env,
        userid: userid,
        map: { EVENTUSER: userid, MACHINENAME: machinename, ITEMTYPE: cleantype, CLEANMAINTSTATUS: cleanstate, USERID: userid, DEPT: dept },
        service: 'queryplantasklist',
        success: (res) => {
          console.log(res)
          let body = res.result.Message.Body
          this.data.setting = body.page.setting
          console.log("settting print")
          console.log(this.data.setting)
          this.setData(
            {
              setting: this.data.setting,
              cleanstate: this.data.cleanstate,
              cleantype: this.data.cleantype
            }
          )
          this.makeTableData(
            {
              datalist: body.TABLEDATA.tasklist.DATALIST,
              headers: body.page.tables.tasklist.headers,
              btnlist: body.TABLEDATA.usergrade.DATALIST,
              tablename: 'tasklist',
              success: (res) => {
                console.log(res)
                if (success != undefined && success != null) {
                  success(res)
                }
              }
            }
          )

        },
        fail: (err) => {

        }
      }
    )
  },//end function

  makeTableData: function (arg) {
    let headers = arg.headers
    let datalist = arg.datalist
    let btnlist = arg.btnlist
    let success = arg.success
    let fail = arg.fail
    let tablename = arg.tablename
    let list = datalist.DATA == undefined ? datalist : [{ DATA: datalist.DATA }]
    let rawlist = []
    let rows = []
    let header = []
    console.log("Start makeTableData")
    // console.log(headers)
    //console.log(list)
    for (let k = 0; k < headers.length; k++) {

      header.push({ header: headers[k].header.name, show: headers[k].header.show, unique: tablename + "hd" + k })
    }
    for (let i = 0; i < list.length; i++) {
      let DATA = {}
      let row = []
      let warning = false
      for (let k = 0; k < headers.length; k++) {

        let show = headers[k].header.show
        let data = list[i].DATA

        let key = headers[k].header.valuename.length > 0 ? headers[k].header.valuename : headers[k].header.id
        let value = data[key] == undefined ? headers[k].header.defaulvalue : data[key]
        DATA[key] = value
        row.push({ name: key, value: value, oth1: null, oth2: null, oth3: null, unique: tablename + 'cell' + i + '-' + k, index: [i, k], show: show })
        /*
        if (key == 'CLEANMAINTPLANDATE') {
          let plandate = new Date(value)
          let date = new Date()
          let nowstr = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + " 23:59:59"
          let now = new Date(nowstr)

          if (plandate < now) {
            warning = true
          }
        }
        else {
          if (key == 'CLEANMAINTSTATUS') {

            warning = value == 'Created' ? warning : false
          }
        } */

      }//end for k
      let dt = list[i].DATA
      if (dt.CLEANMAINTSTATUS == 'Created') {
        let plandate = new Date(dt.CLEANMAINTPLANDATE)
        let date = new Date()
        let nowstr = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + " 23:59:59"
        let now = new Date(nowstr)

        if (plandate < now) {
          warning = true
        } else {
          warning = false
        }
        rawlist.push(DATA)
        rows.push({ row: row, oth1: null, oth2: null, oth3: null, unique: tablename + 'row' + i.toString(), index: i, warning: warning })
      }

      else {
        rawlist.push(DATA)
        rows.push({ row: row, oth1: null, oth2: null, oth3: null, unique: i.toString(), index: i, warning: false })
      }

    }//end for i

    this.makebtnprivilege(
      {
        datalist: btnlist,
        complete: (res) => {
          if (success != undefined && success != null) {
            success({ rawdata: rawlist, header: header, rows: rows })
          }
        }
      }
    )




  },//end function

  rowClick: function (res) {
    console.log(res)
    this.data.selectidx = res.currentTarget.dataset.index
    this.setData(
      {
        selectidx: this.data.selectidx
      }
    )
  },//end function

  onlyshowwarningChange: function (res) {
    this.data.onlyshowwarning = res.detail.value
    this.data.selectidx = null
    this.setData(
      {
        onlyshowwarning: this.data.onlyshowwarning,
        selectindex: this.data.selectidx
      }
    )
  }, //end function

  makebtnprivilege: function (arg) {
    let list = arg.datalist.DATA == undefined ? arg.datalist : [{ DATA: arg.datalist.DATA }]
    let complete = arg.complete
    let funlist = []
    let btns = this.data.btns
    for (let i = 0; i < list.length; i++) {
      funlist.push(list[i].DATA.FUNCTIONNAME)

    }
    btns.execute.show = funlist.indexOf("ExecutePMClean") >= 0 ? true : false
    btns.modify.show = funlist.indexOf("ModifyPMClean") >= 0 ? true : false
    btns.delay.show = funlist.indexOf("DelayPMClean") >= 0 ? true : false
    btns.check.show = funlist.indexOf("CheckPMClean") >= 0 ? true : false
    btns.showcnt = (btns.execute.show ? 1 : 0) + (btns.modify.show ? 1 : 0) + (btns.delay.show ? 1 : 0) + (btns.check.show ? 1 : 0)

    console.log(btns)
    if (complete != undefined && complete != null) {
      complete(null)
    }

  },//end function

  executeClick: function (res) {
    let date = new Date()
    let nowstr = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + " " + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0')
    this.data.nowstr = nowstr
    switch (this.data.cleantype) {
      case 'Clean':
        {
          this.setData(
            {
              cleanexcuteshow: true,
              nowstr: nowstr,
              cleanstate: this.data.cleanstate
            }
          )
          break
        }
      case 'Replace':
        {
          let id = this.data.rawdata[this.data.selectidx].CLEANMAINTENANCEID
          this.data.tables.partlist.rows=null
          this.data.tables.partlist.rawdata=null
          if(this.data.cleanstate=='Created')
          {

          
          this.getPartList(
            {
              cleanmainid: id,
              success: (res) => {
                console.log(this.data.tables)
                this.setData(
                  {
                    partlist: this.data.tables.partlist,
                    cleanexcuteshow: true,
                    nowstr: nowstr,
                    cleanstate: this.data.cleanstate
                  }
                )

              },
              fail: (err) => {

              }
            }
          )
          }else
          {
            this.setData(
              {
                partlist: this.data.tables.partlist,
                cleanexcuteshow: true,
                nowstr: nowstr,
                cleanstate: this.data.cleanstate
              }
            )
          }

          break;
        }
        case 'Test':
          {
            this.setData(
              {
                cleanexcuteshow: true,
                nowstr: nowstr,
                cleanstate: this.data.cleanstate
              })
            break
          }
      default:
        {
          break;
        }
    }

  },//end functon

  checkClick: function (res) {

    this.executeClick(res)

  },//end function

  cleanexecuteCancel: function (res) {
    this.setData(
      {
        cleanexcuteshow: false
      }
    )
  },//end function

  cleanDateChange: function (res) {
    console.log(res)
    let date = new Date()
    let nowstr = res.detail.value + " " + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0')
    this.setData(
      {
        nowstr: nowstr
      }
    )
  },//end function

  cleanResultChange: function (res) {
    console.log(res)
    this.data.cleanresult = res.detail.value
  },//end function

  cleanSubmit: function (res) {
    console.log(res)
    let comment = "wx:" + res.detail.value.comment
    let desc = res.detail.value.description
    let result = res.detail.value.cleanresult
    let id = this.data.rawdata[this.data.selectidx].CLEANMAINTENANCEID
    app.sendPmsEventMsg(
      {
        latitude: app.globalData.userlocation.latitude,
        longitude: app.globalData.userlocation.longitude,
        messagename: this.data.cleanstate == 'Created' ? "ExecuteCleanMaint" : "CheckCleanMaint",
        env: app.globalData.userinfo.pms.env == undefined ? "test" : app.globalData.userinfo.pms.env,
        userid: app.globalData.userinfo.pms.userid,
        map: { EVENTUSER: app.globalData.userinfo.pms.userid, EVENTCOMMENT: comment, MAINTDODESC: desc, EXECUTEDATE: this.data.nowstr, RESULT: result, CLEANMAINTENANCEID: id },
        success: (res) => {
          console.log(res)
          if (res.result.Message.Return.RETURNCODE == '0') {
            this.setData({
              cleanexcuteshow: false
            })
            this.submitpmssuccess(null)
          }
        },
        fail: (err) => {
          console.log(err)
          this.setData({
            cleanexcuteshow: false
          })
          this.submitpmsfail(null)
        }

      }
    )
  },
  submitpmssuccess: function (res) {
    wx.showToast({
      title: '已成功提交PMS',
      duration: 2000
    })


    this.freshdata(null)

  },//end function

  submitpmsfail: function (res) {
    wx.showModal({
      cancelColor: 'cancelColor',
      showCancel: false,
      title: '提交失败',
      content: '提交PMS失败!',


    })
  },//end function

  freshdata: function (res) {
    this.data.selectidx = null
    this.getTaskList(
      {
        cleantype: this.data.cleantype,
        cleanstate: this.data.cleanstate,
        env: app.globalData.userinfo.pms.env,
        userid: app.globalData.userinfo.pms.userid,
        dept: app.globalData.userinfo.pms.usergroup,
        machinename: this.data.machinename.substr(0, 7),
        success: (res) => {
          this.data.header = res.header
          this.data.rows = res.rows
          this.data.rawdata = res.rawdata
          this.setData(
            {
              header: this.data.header,
              rows: this.data.rows,
              btns: this.data.btns,
              selectidx: null
            }
          )
        },
        fail: (err) => {

        }
      }
    )

  },//end function

  getPartList: function (arg) {
    let cleanmainid = arg.cleanmainid
    let success = arg.success
    let fail = arg.fail
    let userid = app.globalData.userinfo.pms.userid
    app.sendQueryMsg(
      {
        env: app.globalData.userinfo.pms.env,
        userid: app.globalData.userinfo.pms.userid,
        queryid: 'GetCleanMaintenancePartList',
        service:'asdcommonquerysrv',
        map: { EVENTUSER: userid, CLEANMAINTENANCEID: cleanmainid, USERID: userid,PAGE_NAME:'plantask',TABLE_NAME:'partlist',HEADER_SETTING:'Y',TABLE_SETTING:'Y' },
        success: (res) => {
          console.log(res)
          let body=res.result.Message.Body
          this.data.tables.partlist.setting=body.partlist.setting
          app.makeTableData(
            {
              tablename: 'partlist',
              headers:  body.partlist.headers,
              datalist: body.partlist.DATALIST,
              success: (res) => {
                console.log(res)
                this.data.tables.partlist.header = res.header
                this.data.tables.partlist.rows = res.rows
                this.data.tables.partlist.rawdata = res.rawdata
                if (success != undefined & success != null) {
                  success(res)
                }
              }, fail: (err) => {
                console.log(err)
              }
            }
          )

        },
        fail: (err) => {

        }
      })
  },//end function

})