// miniprogram/pages/asd/task/maintenance.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {


    tasktable: [{ col: "单元名称", row:[]}, { col: "维护名称",row:[]}, { col: "维护状态", row:[]}, { col: "维护计划时间",row:[] }, { col: "提醒时间", row:[]}, { col: "执行时间", row:[]}, { col: "执行结果", row:[]}, { col: "执行描述", row:[]}, { col: "执行者", row:[]}, { col: "上次执行时间", row:[]}, { col: "维护检查时间", row:[]}, { col: "检查结果", row:[]}, { col: "检查者", row:[]}, { col: "项目类型", row:[]}, { col: "维护维码", row:[]}, { col: "组名", row:[]}, { col: "表格名称", row:[]}, { col: "表格编码", row:[]}, { col: "设备组", row:[]}, { col: "设备名称", row:[]}],
    tasklist: [],
    taskidx: null,
    cleantype:null,
    cleanstate:null,
    unitname:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.data.cleanstate=options.cleanstate
   this.data.cleantype=options.cleantype
   this.data.unitname=options.unitname
   console.log(this.data.tasktable)
   for (let k = 0; k < this.data.tasktable.length; k++) {
    // console.log("clean table row")
    console.log(this.data.tasktable[k].row.length)
    

  }
  this.getMainenanceList(
    {
      env: app.globalData.userinfo.pms.env,
      userid: app.globalData.userinfo.pms.userid,
      cleanstate: this.data.cleanstate,
      cleantype: this.data.cleantye,
      unitname: this.data.unitname,
      machinename: this.data.unitname.substring(0, 7),
      success: (res) => {
        this.makeMaIntenanceData(
          {
            res: res,
            success: (res) => {
              this.setData(
                {
                  wHeight: app.globalData.wHeight,
                  tasktable: this.data.tasktable,
                  tasklist: this.data.tasklist
                }
              )

            },
            fail: (err) => {
              //TODO
            }
          }
        )

      },
      fail: (err) => {
        //TODO
      }

    }
  )
   


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /*
    this.getMainenanceList(
      {
        env: app.globalData.userinfo.pms.env,
        userid: app.globalData.userinfo.pms.userid,
        cleanstate: this.data.cleanstate,
        cleantype: this.data.cleantye,
        unitname: this.data.unitname,
        machinename: this.data.unitname.substring(0, 7),
        success: (res) => {
          this.makeMaIntenanceData(
            {
              res: res,
              success: (res) => {
                this.setData(
                  {
                    wHeight: app.globalData.wHeight,
                    tasktable: this.data.tasktable,
                    tasklist: this.data.tasklist
                  }
                )

              },
              fail: (err) => {
                //TODO
              }
            }
          )

        },
        fail: (err) => {
          //TODO
        }

      }
    ) */


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

  getMainenanceList: function (arg) {
    let success = arg.success
    let fail = arg.fail
    let unitname = arg.unitname
    let machinename = arg.machinename
    let cleantye = arg.cleantype
    let cleanstate = arg.cleanstate
    let env = arg.env
    let userid = arg.userid
    let map = { ITEMTYPE: cleantye, MACHINENAME: machinename, UNITNAME: unitname }
    app.sendQueryMsg(
      {
        env: env,
        userid: userid,
        map: map,
        queryid: "GetCleanMaintenanceList",
        success: (res) => {
          console.log(res)
          if (success != undefined && success != null) {
            success(res)
          }
        },
        fail: (err) => {
          console.log(err)
          if (fail != undefined && fail != null) {
            fail(err)
          }
        }

      }
    )

  },
  makeMaIntenanceData: function (arg) {
    let success = arg.success
    let fail = arg.fail
    let res = arg.res
    let list = res.result.Message.Body.DATALIST
    let tasklist = this.data.tasklist
    let tasktable = this.data.tasktable
    tasklist.length = 0;
    console.log("tasktable")
    console.log(tasktable)
    for (let k = 0; k < this.data.tasktable.length; k++) {
      // console.log("clean table row")
         if(this.data.tasktable[k].row.length!=0)
       {
         this.data.tasktable[k].row.length=0
       }

    }
    console.log("DATALIST")
    console.log(list)
    if (list.length == undefined) {
      console.log("list length is undefined")
      if (list.DATA == undefined) {
        console.log("DATALIST.DATA IS NULL")
        if (fail != undefined && fail != null) {

          fail("查询不到数据")
        }
      }
      else {
        console.log("show list.DATA")
        console.log(list.DATA)
        let task = list.DATA
        tasklist.push(task)
        tasktable[0].row.push({ value: task.UNITNAME, ID: "00", IDX: [0, 0] })
        tasktable[1].row.push({ value: task.CLEANMAINTENANCENAME, ID: "01", IDX: [0, 1] })
        tasktable[2].row.push({ value: task.CLEANMAINTSTATUS, ID: "02", IDX: [0, 2] })
        tasktable[3].row.push({ value: task.CLEANMAINTPLANDATE, ID: "03", IDX: [0, 3] })
        tasktable[4].row.push({ value: task.CLEANMAINTPREDATE, ID: "04", IDX: [0, 4] })
        tasktable[5].row.push({ value: task.CLEANMAINTEXECUTEDATE, ID: "05", IDX: [0, 5] })
        tasktable[6].row.push({ value: task.RESULT, ID: "06", IDX: [0, 6] })
        tasktable[7].row.push({ value: task.MAINTDODESC, ID: "07", IDX: [0, 7] })
        tasktable[8].row.push({ value: task.EXECUTEUSER, ID: "08", IDX: [0, 8] })
        tasktable[9].row.push({ value: task.BEFOREEXECUTEDATE, ID: "09", IDX: [0, 9] })
        tasktable[10].row.push({ value: task.CLEANMAINTCHECKDATE, ID: "010", IDX: [0, 10] })
        tasktable[11].row.push({ value: task.CHECKRESULT, ID: "011", IDX: [0, 11] })
        tasktable[12].row.push({ value: task.EXECUTEUSER, ID: "012", IDX: [0, 12] })
        tasktable[13].row.push({ value: task.ITEMTYPE, ID: "013", IDX: [0, 13] })
        tasktable[14].row.push({ value: task.PMCLEANCODE, ID: "014", IDX: [0, 14] })
        tasktable[15].row.push({ value: task.GROUPNAME, ID: "015", IDX: [0, 15] })
        tasktable[17].row.push({ value: task.FROMNUMBER, ID: "017", IDX: [0, 17] })
        tasktable[16].row.push({ value: task.FROMNAME, ID: "016", IDX: [0, 16] })
        tasktable[18].row.push({ value: task.MACHINEGROUPNAME, ID: "018", IDX: [0, 18] })
        tasktable[19].row.push({ value: task.MACHINENAME, ID: "019", IDX: [0, 19] })
        console.log(this.data.tasktable)
        if (success != undefined && success != null) {
          success(null)
        }

      }//end if

    } else {
      for (let i = 0; i < list.length; i++) {
        let task = list[i].DATA
        tasklist.push(task)

        tasktable[0].row.push({ UNITNAME: task.UNITNAME, ID: i + "0", IDX: [i, 0] })
        tasktable[1].row.push({ CLEANMAINTENANCENAME: task.CLEANMAINTENANCENAME, ID: i + "01", IDX: [i, 1] })
        tasktable[2].row.push({ CLEANMAINTSTATUS: task.CLEANMAINTSTATUS, ID: i + "2", IDX: [i, 2] })
        tasktable[3].row.push({ CLEANMAINTPLANDATE: task.CLEANMAINTPLANDATE, ID: i + "3", IDX: [i, 3] })
        tasktable[4].row.push({ CLEANMAINTPREDATE: task.CLEANMAINTPREDATE, ID: i + "4", IDX: [i, 4] })
        tasktable[5].row.push({ CLEANMAINTEXECUTEDATE: task.CLEANMAINTEXECUTEDATE, ID: i + "5", IDX: [i, 5] })
        tasktable[6].row.push({ RESULT: task.RESULT, ID: i + "6", IDX: [i, 6] })
        tasktable[7].row.push({ MAINTDODESC: task.MAINTDODESC, ID: i + "7", IDX: [i, 7] })
        tasktable[8].row.push({ EXECUTEUSER: task.EXECUTEUSER, ID: i + "8", IDX: [i, 8] })
        tasktable[9].row.push({ BEFOREEXECUTEDATE: task.BEFOREEXECUTEDATE, ID: i + "9", IDX: [i, 9] })
        tasktable[10].row.push({ CLEANMAINTCHECKDATE: task.CLEANMAINTCHECKDATE, ID: i + "10", IDX: [i, 10] })
        tasktable[11].row.push({ CHECKRESULT: task.CHECKRESULT, ID: i + "11", IDX: [i, 11] })
        tasktable[12].row.push({ EXECUTEUSER: task.EXECUTEUSER, ID: i + "12", IDX: [i, 12] })
        tasktable[13].row.push({ ITEMTYPE: task.ITEMTYPE, ID: i + "13", IDX: [i, 13] })
        tasktable[14].row.push({ PMCLEANCODE: task.PMCLEANCODE, ID: i + "14", IDX: [i, 14] })
        tasktable[15].row.push({ GROUPNAME: task.GROUPNAME, ID: i + "15", IDX: [i, 15] })
        tasktable[17].row.push({ FROMNUMBER: task.FROMNUMBER, ID: i + "17", IDX: [i, 17] })
        tasktable[16].row.push({ FROMNAME: task.FROMNAME, ID: i + "16", IDX: [i, 16] })
        tasktable[18].row.push({ MACHINEGROUPNAME: task.MACHINEGROUPNAME, ID: i + "18", IDX: [i, 18] })
        tasktable[19].row.push({ MACHINENAME: task.MACHINENAME, ID: i + "19", IDX: [i, 19] })


      }//end for
      if (success != undefined && success != null) {
        success(null)
      }
    }//end else

  }
})