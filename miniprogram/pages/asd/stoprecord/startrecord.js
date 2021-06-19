// miniprogram/pages/asd/stoprecord/startrecord.js
const app = getApp()
const util = require("../utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: null,
    selectshow: true,
    edlistshow: false,
    rowselectinfo: null,
    enddialogueshow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userinfo = app.globalData.userinfo.pms
    this.setData({
      userinfo: this.data.userinfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: (result) => {
        console.log('SystemInfo:', result)
        this.setData(
          {
            height: result.windowHeight - 2
          }
        )
      },
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    if (app.globalData.userinfo.pms.env == 'test') {
      this.data.locationod = true

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
  selectok: function (arg) {
    console.log('selectok arg:', arg)
    
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '请选择宕机开始或结束',
      content: '开始停机生产请选择开始，开始恢复生产请选择结束',
      confirmText: '宕机开始',
      cancelText: '宕机结束',

      success: (arg2) => {
        console.log('confirm dailog resule:', arg)
        if (!arg2.confirm)   // end eq stop
        {
          this.EdlistRequest(
            {
              machinename: arg.detail.machinename,
              success: (res) => {
                let result = res.result.Message.Body
                let tabledata = { datalist: result.edlist.DATALIST, headers: result.edlist.headers }
                this.setData({
                  selectshow: false,
                  edlistshow: true,
                  tabledata: tabledata,
                  setting: result.edlist.setting
                })
              }
            }
          )

        } else
        // start ED
        {
         let mname=arg.detail.machinename
         let machinename=mname.length>7?mname.substring(0,7):mname
         let unitname=mname.length>7?mname:''
          this.setData(
            {
              selectshow: false,
              isended: false,
              enddialogueshow: true,
              edinfo: { machinename: machinename,unitname:unitname,machinegroup:arg.detail.machinegroup},
              userinfo: this.data.userinfo

            }
          )

        }
      },
      fail: (err) => {

      }
    })
    console.log('selectinfo:', arg)
  },//end function



  rowClick: function (arg) {
    //console.log('rowclick:',arg)
    if (this.data.rowselectinfo != arg.detail.rowdata) {
      this.data.rowselectinfo = arg.detail.rowdata
      this.setData({
        rowselectinfo: this.data.rowselectinfo
      })
    }



  },//end function

  endClick: function (arg) {
    let that = this.data
    let rowinfo = that.rowselectinfo
    console.log('rowselectinfo:', that.rowselectinfo)
    let machinename = rowinfo.MACHINENAME.length > 7 ? rowinfo.MACHINENAME.substring(7) : rowinfo.MACHINENAME
    let unitname = rowinfo.MACHINENAME.length > 7 ? rowinfo.MACHINENAME : ""
    this.setData({
      edlistshow: false,
      isended: true,
      enddialogueshow: true,
      edinfo: { machinename: machinename, edid: rowinfo.EDID, unitname: unitname, edstarttime: rowinfo.EDSTARTTIME },
      userinfo: this.data.userinfo



    })

  },//end function

  EdlistRequest: function (arg) {
    let userid = app.globalData.userinfo.pms.userid
    let env = app.globalData.userinfo.pms.env

    let edid = '%' + arg.machinename + '%'
    let success = arg.success
    let fail = arg.fail
    util.sendQueryMsg(
      {
        env: env,
        userid: userid,
        queryid: 'GetEDList',
        service: 'asdcommonquerysrv',
        map: { EDID: edid, EVENTUSER: 'userid', PAGE_NAME: 'stoprecord', TABLE_NAME: 'edlist', TABLE_SETTING: 'Y', HEADER_SETTING: 'Y' },
        success: (arg) => {
          console.log('edlistRequest result:', arg)
          if (success != undefined && success != null) {
            success(arg)
          }
        },
        fail: (err) => {

        }


      }
    )

  },//end function
  edsuccess:function(arg)
  {
    this.setData(
     {
      enddialogueshow:false,
      selectshow:true,
     } 

    )
  }

})