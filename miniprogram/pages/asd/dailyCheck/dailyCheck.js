// miniprogram/pages/asd/dailyCheck/dailyCheck.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    errMsg: {
      onError: false,
      errorText: ""
    },

    checkdetail: {
      eqid: null,
      eqdesc: null,
      fab: null,
      subeqlist: [],

      workTimeIndex: 0,
      shiftIndex: 0,
      result: true,

    },

    shifts: ["A", "B", "C"],
    workTimes: ["DayTime", "Night"],
    storagemachinename: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.storagemachinename = options.machinename
    let key = app.globalData.userinfo.pms.env + options.machinename + "dailyCheck"
    wx.getStorage({
      key: key,
      success: (res) => {
        wx.showModal({
          cancelColor: 'cancelColor',
          title: "本机存有记录",
          content: options.machinename + "存有上次未提交的记录，是否继续上次未提交的记录？",
          confirmText: "继续",
          cancelText: "重新",
          success: (rs) => {
            if (rs.confirm) {
              this.data.checkdetail = res.data
              this.setData(
                {
                  checkdetail: this.data.checkdetail
                }
              )
            } else {
              this.loadNewData(options)
            }
          }
        })
      },
      fail: (err) => {
        this.loadNewData(options)
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
    if (app.globalData.userinfo.pms.env == 'test') {
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
        console.log("wHeight")
        console.log(result.windowHeight)
        this.setData(
          {
            wHeight: result.windowHeight
          }
        )

      },
    })


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

  loadNewData: function (options) {
    console.log(options)
    let machinename = ""
    if (options.machinename.length > 7) {
      machinename = options.machinename.substring(0, 7)
      this.getDailyCheckData(
        {
          machinename: options.machinename.substring(0, 7),
          unitname: options.machinename,
          level: options.level,

          success: (res) => {
            this.data.checkdetail.eqid = machinename

            this.setData
              (
                {
                  checkdetail: this.data.checkdetail
                }
              )
          },
          fail: (err) => {

          }
        }
      )

    } else {
      machinename = options.machinename
      this.getDailyCheckData(
        {
          machinename: options.machinename,
          unitname: null,
          level: options.level,
          success: (res) => {
            this.data.checkdetail.eqid = machinename
            console.log("getDailyCheckData:this.data.checkdetail")
            console.log(this.data.checkdetail)
            this.setData
              (
                {
                  checkdetail: this.data.checkdetail
                }
              )
          },
          fail: (err) => {

          }
        }
      )
    }

  },//end function

  getDailyCheckData: function (arg) {
    let machinename = arg.machinename
    let unitname = arg.unitname
    let resolve = arg.success
    let reject = arg.fail
    let level = arg.level
    console.log(machinename)




    app.getInspectionList(
      {
        env: app.globalData.userinfo.pms.env,
        userid: app.globalData.userinfo.userid,
        machinename: machinename,
        unitname: unitname,

        success: (res) => {
          let data = res.result.Message
          console.log(res)
          if (data.Return.RETURNCODE == '0') {
            console.log("Start Check DATALIST")
            app.checkReurnDATALIST(
              {
                res: res,
                success: (list) => {
                  console.log("Check DATALIST OK")
                  console.log(list)
                  console.log("Start filter list")
                  this.filterData(
                    {
                      list: list,
                      level: level,
                      complete: (res) => {
                        console.log("filter data complete")
                        console.log(res)
                        console.log("star makeDailyCheckData")
                        this.makeDailyCheckData(
                          {
                            rs: res,
                            complete: (res) => {
                              if (resolve != undefined && resolve != null) {
                                resolve(res)
                              }
                            }

                          }
                        )

                      }
                    }
                  )

                },
                fail: (list) => {
                  wx.showModal({
                    cancelColor: 'cancelColor',
                    showCancel: false,
                    title: "未有点检项目",
                    content: machinename + "未有点检项目!",
                    success(res) {
                      //do nothing
                    }

                  })
                }

              }
            )
          }
          else {
            console.log("getDailyCheckData: RETURNCODE!='0'")
            console.log(data.Return)
          }


          /*
          let data= res.result.Message
          //if return errr
          if(data.Return.RETURNCODE!='0')
          {
            console.log("getDailyCheckData: RETURNCODE!='0'")
          }else
          {
            let rs=[]
            let list=res.result.Message.Body.DATALIST
            console.log("getDailyCheckData: DATALIST")
            console.log(list)
            if(list.length==undefined)
            {

              //only one item
              if(list.DATA!=undefined&&list.DATA!=null)
              {
                console.log("getDailyCheckData: only one item")
                rs.push(list.DATA)
              }else
              {
                console.log("getDailyCheckData: DATALIST NO DATA")
                wx.showModal({
                  cancelColor: 'cancelColor',
                  showCancel:false,
                  title:"未有点检项目",
                  content:machinename+"未有点检项目!",
                  success(res)
                  {
                    //do nothing
                  }

                })
              }
            // has many itemss
            }else
            {
              if(list.length>0)
              {
                console.log(list)
                rs=list
              }
              else
              {

              }
              

            }


          } */

        },
        fail: (err) => {
          wx.showModal({
            cancelColor: 'cancelColor',
            showCancel: false,
            title: "未有点检项目",
            content: machinename + "未有点检项目!",
            success(res) {
              //do nothing
            }

          })
        }

      }
    ) //end  app.getInspectionList

    /*
     wx.cloud.callFunction({
 
       name: 'getDailyCheckData', //测试
       data: {
         eqid: machine,
         env: app.globalData.appUserInfo.env
       },
       success: (res) => {
         console.log(res)
         var rs = res.result.data  //cxm change
         //var rs=res.result.data //test 
         if (rs == null || rs.length < 1 || res.result.returnCode != 0) {
           if (reject != undefined && reject != null) {
             if (res.result.returnText != null) {
               reject(new Error(res.result.returnText))
               this.data.errMsg = res.result.returnText
             }
             else {
               reject(new Error("Not find Check Items!"))
             }
 
 
 
           }
           // res = []
         } else {
           console.log("download check data from pms")
           console.log(rs)
           for (let i = 0; i < rs.length; i++) {
 
 
 
             var checkIt = {
               "ACTIVATESTATE": rs[i].ACTIVATESTATE,
               "INSPECTIONID": rs[i].INSPECTIONID,
               // "INSPECTIONSTATE": rs[i].INSPECTIONSTATE,
               "INSPECTIONSTATE": "Entering",
               "INSPECTIONUNIT": rs[i].INSPECTIONUNIT,
               "ITEMNAME": rs[i].ITEMNAME,
               "LASTEVENTUSER": rs[i].LASTEVENTUSER,
               "MACHINEGROUPNAME": rs[i].MACHINEGROUPNAME,
               "MACHINENAME": rs[i].MACHINENAME,
               "MACHINESTATENAME": rs[i].MACHINESTATENAME,
               "MAXIMUM": rs[i].MAXIMUM,
               "MAXIMUMFLAG": rs[i].MAXIMUMFLAG,
               "MINIMUM": rs[i].MINIMUM,
               "MINIMUMFLAG": rs[i].MINIMUMFLAG,
               "UNITNAME": rs[i].UNITNAME,
               "VERIFIER": rs[i].VERIFIER,
               "INSPECTIONRESULT": '',
               "INSPECTIONVALUE": "",
               "ISOK": true,
               "ITEMINDEX": [],
               "WORKTIME": "DayTime",
               "SHIFT": "A",
               "KEYBOARDTYPE": "digit",
               "CHECKRESULTFLAG": true,
               "EQSTOP": false,
               "UNIQUE": "",
               "UNIQUESEQ": 0
             }
 
 
             try {
 
               if (checkIt.MAXIMUM != undefined && checkIt.MAXIMUM != null && checkIt.MINIMUM != undefined && checkIt.MINIMUM != null) {
                 let max = parseFloat(checkIt.MAXIMUM)
                 let min = parseFloat(checkIt.MINIMUM)
                 if (max < 0 || min < 0) {
                   checkIt.KEYBOARDTYPE = "text"
                 }
               } else {
                 if ((checkIt.MAXIMUM == undefined || checkIt.MAXIMUM == null) && checkIt.MINIMUM != undefined && checkIt.MINIMUM != null) {
                   let min = parseFloat(checkIt.MINIMUM)
                   if (min < 0) {
                     checkIt.KEYBOARDTYPE = "text"
                   }
                 } else {
 
                   if ((checkIt.MAXIMUM == MINIMUM || checkIt.MINIMUM == null) && checkIt.MAXIMUM != undefined && checkIt.MAXIMUM != null) {
                     let max = parseFloat(checkIt.MAXIMUM)
                     if (max < 0) {
                       checkIt.KEYBOARDTYPE = "text"
                     }
                   }
 
                 }
 
               }
 
             } catch (e) {
               console.log(e)
             }
 
 
             if (this.data.checkdetail.subeqlist < 1 && i < 1) {
               var sublist = {
                 subeqid: checkIt.UNITNAME,
                 subeqdesc: '',
                 showflag: true,
                 isOk: null,
                 checkerrcnt: 0,
                 spacecnt: 0,
                 subeqindex: 0,
                 itemlist: []
               }
               checkIt.ITEMINDEX = [0, 0]
               checkIt.UNIQUE = checkIt.UNIQUE = sublist.subeqid + "-" + checkIt.INSPECTIONID + "-" + i
               checkIt.UNIQUESEQ = 0;
               sublist.itemlist.push(checkIt)
               this.data.checkdetail.subeqlist.push(sublist)
 
 
             } else {
               for (let j = 0; j < this.data.checkdetail.subeqlist.length; j++) {
                 if (this.data.checkdetail.subeqlist[j].subeqid == checkIt.UNITNAME) {
 
                   //checkIt.ITEMINDEX = [j, i]
 
                   checkIt.ITEMINDEX = [j, this.data.checkdetail.subeqlist[j].itemlist.length]
                   checkIt.UNIQUE = checkIt.UNIQUE = sublist.subeqid + "-" + checkIt.INSPECTIONID + "-" + i
                   checkIt.UNIQUESEQ = j + i;
                   this.data.checkdetail.subeqlist[j].itemlist.push(checkIt)
                   break;
                 } else {
                   if (j == this.data.checkdetail.subeqlist.length - 1) {
                     let sublist = {
                       subeqid: checkIt.UNITNAME,
                       subeqdesc: '',
                       showflag: true,
                       isOk: null,
                       itemlist: [],
                       subeqindex: this.data.checkdetail.subeqlist.length
                     }
                     //checkIt.ITEMINDEX = [j, i]
                     checkIt.ITEMINDEX = [this.data.checkdetail.subeqlist.length, 0]
                     checkIt.UNIQUE = checkIt.UNIQUE = sublist.subeqid + "-" + checkIt.INSPECTIONID + "-" + i
                     checkIt.UNIQUESEQ = j + i;
                     sublist.itemlist.push(checkIt)
                     this.data.checkdetail.subeqlist.push(sublist)
                     break
 
                   } else {
                     continue
                   }
                 }
               }
 
 
             }
 
 
 
           } //enf for i
           if (resolve != undefined && resolve != null) {
             resolve()
           }
 
         }
 
 
         //resolve(res.result.data)
       },
       fail: (err) => {
         if (reject != undefined && reject != null) {
           reject(err)
         }
 
       }
 
 
     })*/


  },//end function

  filterData: function (arg) {
    let level = arg.level
    let list = arg.list
    let rtn = []
    let complete = arg.complete
    if (level == undefined) {
      if (complete != undefined && complete != null) {

        /*
        for(let k=0;k<list.length;k++)
        {
          rtn.push(list[k].DATA)
        } */
        complete(list)
      }

    } else {
      let f = (level == 1 || level == '1') ? 1 : 2
      for (let i = 0; i < list.length; i++) {
        if (list[i].ITEMNAME.search("1楼") >= 0 || list[i].ITEMNAME.search("一楼") >= 0) {
          if (f == 1) {
            rtn.push(list[i])
          }

        } else {
          if (f == 2) {
            rtn.push(list[i])
          }

        }

      }//end for i
      complete(rtn)
    }


  },//end function

  makeDailyCheckData: function (arg) {
    let rs = arg.rs
    let complete = arg.complete

    for (let i = 0; i < rs.length; i++) {



      var checkIt = {
        "ACTIVATESTATE": rs[i].ACTIVATESTATE,
        "INSPECTIONID": rs[i].INSPECTIONID,
        // "INSPECTIONSTATE": rs[i].INSPECTIONSTATE,
        "INSPECTIONSTATE": "Entering",
        "INSPECTIONUNIT": rs[i].INSPECTIONUNIT,
        "ITEMNAME": rs[i].ITEMNAME,
        "LASTEVENTUSER": rs[i].LASTEVENTUSER,
        "MACHINEGROUPNAME": rs[i].MACHINEGROUPNAME,
        "MACHINENAME": rs[i].MACHINENAME,
        "MACHINESTATENAME": rs[i].MACHINESTATENAME,
        "MAXIMUM": rs[i].MAXIMUM,
        "MAXIMUMFLAG": rs[i].MAXIMUMFLAG,
        "MINIMUM": rs[i].MINIMUM,
        "MINIMUMFLAG": rs[i].MINIMUMFLAG,
        "UNITNAME": rs[i].UNITNAME,
        "VERIFIER": rs[i].VERIFIER,
        "INSPECTIONRESULT": '',
        "INSPECTIONVALUE": "",
        "ISOK": true,
        "ITEMINDEX": [],
        "WORKTIME": "DayTime",
        "SHIFT": "A",
        "KEYBOARDTYPE": "digit",
        "CHECKRESULTFLAG": true,
        "EQSTOP": false,
        "UNIQUE": "",
        "UNIQUESEQ": 0,
        "DESCRIPTION": ""
      }
      let num = ((checkIt.MAXIMUM == undefined || checkIt.MAXIMUM == null || checkIt.MAXIMUM.length < 1) ? 0 : 1) + ((checkIt.MINIMUM == undefined || checkIt.MINIMUM == null || checkIt.MINIMUM.length < 1) ? 0 : 2)
      switch (num) {
        case 1:
          {
            try {
              let max = parseFloat(checkIt.MAXIMUM)
              if (max < 0) {
                checkIt.KEYBOARDTYPE = "text"
              }

            } catch (err) {
              checkIt.KEYBOARDTYPE = "text"
            }

            break
          }
        case 3:
          {
            try {
              let max = parseFloat(checkIt.MAXIMUM)
              let min = parseFloat(checkIt.MINIMUM)
              if (max < 0 || min < 0) {
                checkIt.KEYBOARDTYPE = "text"
              }

            } catch (err) {
              checkIt.KEYBOARDTYPE = "text"
            }
            break
          }
        case 2:
          {
            try {
              let min = parseFloat(checkIt.MINIMUM)
              if (min < 0) {
                checkIt.KEYBOARDTYPE = "text"
              }

            } catch (err) {
              checkIt.KEYBOARDTYPE = "text"
            }
            break
          }
        default:
          {
            break
          }
      }
      if (this.data.checkdetail.subeqlist < 1 && i < 1) {
        var sublist = {
          subeqid: checkIt.UNITNAME,
          subeqdesc: '',
          showflag: true,
          isOk: null,
          checkerrcnt: 0,
          spacecnt: 0,
          subeqindex: 0,
          itemlist: []
        }
        checkIt.ITEMINDEX = [0, 0]
        checkIt.UNIQUE = checkIt.UNIQUE = sublist.subeqid + "-" + checkIt.INSPECTIONID + "-" + i
        checkIt.UNIQUESEQ = 0;
        sublist.itemlist.push(checkIt)
        this.data.checkdetail.subeqlist.push(sublist)


      } else {
        for (let j = 0; j < this.data.checkdetail.subeqlist.length; j++) {
          if (this.data.checkdetail.subeqlist[j].subeqid == checkIt.UNITNAME) {

            //checkIt.ITEMINDEX = [j, i]

            checkIt.ITEMINDEX = [j, this.data.checkdetail.subeqlist[j].itemlist.length]
            // checkIt.UNIQUE = checkIt.UNIQUE = sublist.subeqid + "-" + checkIt.INSPECTIONID + "-" + i
            checkIt.UNIQUE = checkIt.UNIQUE = checkIt.UNITNAME + "-" + checkIt.INSPECTIONID + "-" + i
            checkIt.UNIQUESEQ = j + i;
            this.data.checkdetail.subeqlist[j].itemlist.push(checkIt)
            break;
          } else {
            if (j == this.data.checkdetail.subeqlist.length - 1) {
              let sublist = {
                subeqid: checkIt.UNITNAME,
                subeqdesc: '',
                showflag: true,
                isOk: null,
                itemlist: [],
                subeqindex: this.data.checkdetail.subeqlist.length
              }
              //checkIt.ITEMINDEX = [j, i]
              checkIt.ITEMINDEX = [this.data.checkdetail.subeqlist.length, 0]
              checkIt.UNIQUE = checkIt.UNIQUE = sublist.subeqid + "-" + checkIt.INSPECTIONID + "-" + i
              checkIt.UNIQUESEQ = j + i;
              sublist.itemlist.push(checkIt)
              this.data.checkdetail.subeqlist.push(sublist)
              break

            } else {
              continue
            }
          }
        }
      }

    } //enf for i
    console.log(this.data.checkdetail)
    if (complete != undefined && complete != null) {
      complete(null)
    }

  }, //end function

  //点检输入失去焦点
  dianjianzhiblur: function (e) {
    console.log(e);
    if(e.detail.value.length>0)
    {
      let crrValue = e.detail.value.indexOf(".")==0? ("0"+e.detail.value):e.detail.value
     let reg1 = new RegExp("^([0-9])+(\.)?([0-9])*$")
      let reg2 = new RegExp("^(-$|-([0-9])+(\.)?([0-9])*$)")
      if(reg1.test(crrValue) || reg2.test(crrValue))
      {
        let subeqindex = e.currentTarget.dataset.index[0]
        let itemindex = e.currentTarget.dataset.index[1]
        this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].INSPECTIONVALUE = crrValue
        this.dianjianzhichaobiao(subeqindex, itemindex, (res)=>
        {
          this.setData(
            {
              checkdetail: this.data.checkdetail
            }
          )
        })
      

      }else
      {
        wx.showToast({
          title: '输入无效的值',
          icon: 'node',
          duration: 2000

        })
        this.setData(
          {
            checkdetail: this.data.checkdetail
          }
        )
      }
    } 
    
   

  },//end function


  //检查是否超标
  dianjianzhichaobiao: function (subeqindex, itemidex, resovle) {
    let item = this.data.checkdetail.subeqlist[subeqindex].itemlist[itemidex];
    let checkerrcnt = 0;
    if (!item.EQSTOP) {

      try {

        let i = subeqindex;
        let j = itemidex;
        let max = parseFloat(item.MAXIMUM)
        let min = parseFloat(item.MINIMUM)
        let v = parseFloat(item.INSPECTIONVALUE)

        /*let numflag = ((item.MAXIMUMFLAG != undefined && item.MAXIMUMFLAG != null) ? 0 : 1) + ((item.MINIMUMFLAG != undefined && item.MINIMUMFLAG != null) ? 0 : 2)*/
        let num = ((item.MAXIMUM == undefined || item.MAXIMUM == null || item.MAXIMUM.length < 1 || item.MAXIMUMFLAG == undefined || item.MAXIMUMFLAG == null || item.MAXIMUMFLAG.length < 1) ? 0 : 1) + ((item.MINIMUM == undefined || item.MINIMUM == null || item.MINIMUM.length < 1 || item.MINIMUMFLAG == undefined || item.MINIMUMFLAG == null || item.MINIMUMFLAG.length < 1) ? 0 : 2)
        if (item.INSPECTIONVALUE.length > 0) {


          switch (num) {
            //max min has value
            case 3:
              {
                //let max = parseFloat(item.MAXIMUM)
                // let min = parseFloat(item.MINIMUM)
                //let v = parseFloat(item.INSPECTIONVALUE)
                let innerflag = (item.MAXIMUMFLAG == "≥" ? 0 : 1) + (item.MINIMUMFLAG == "≥" ? 0 : 2)
                console.log(item.MAXIMUMFLAG+"--"+item.MINIMUMFLAG)
                switch (innerflag) {
                  // 大于等于最小值，小于等于最大值
                  case 0:
                    {
                      if (v <= max && v >= min) {
                        this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                        item.INSPECTIONVALUE=v.toString()
                      } else {
                        this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                        this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                        this.data.checkdetail.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                      }
                      break
                    }

                  // 小于等于max  大于最小值  
                  //20210705 case 1:
                  case 2:
                    {
                      if (v <= max && v > min) {
                        this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                        item.INSPECTIONVALUE=v.toString()
                      } else {
                        this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                        this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                        this.data.checkdetail.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                      }
                      break
                    }

                  //小于MAX 大于等于最小
                 //20210705 case 2:
                 case 1:
                    {
                      if (v < max && v >= min) {
                        this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                        item.INSPECTIONVALUE=v.toString()
                      } else {
                        this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                        this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                        this.data.checkdetail.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                      }
                      break
                    }

                  //小于MAX，大于MIN
                  case 3:
                    {
                      if (v < max && v > min) {
                        this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                        item.INSPECTIONVALUE=v.toString()
                      } else {
                        this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                        this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                        this.data.checkdetail.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                      }
                      break
                    }

                }


                break
              } //end case 3

            // only min has value
            case 2:
              {


                //  let min = parseFloat(item.MINIMUM)
                //  let v = parseFloat(item.INSPECTIONVALUE)
                if (item.MINIMUMFLAG == ">") {

                  if (v > min) {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                    item.INSPECTIONVALUE=v.toString()
                  } else {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                    this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                    this.data.checkdetail.subeqlist[i].checkerrcnt++
                    checkerrcnt++
                  }

                } else {
                  if (v >= min) {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                    item.INSPECTIONVALUE=v.toString()
                  } else {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                    this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                    this.data.checkdetail.subeqlist[i].checkerrcnt++
                    checkerrcnt++
                  }

                }

                break
              }

            //only max has value
            case 1:
              {
                //  let max = parseFloat(item.MAXIMUM)

                //   let v = parseFloat(item.INSPECTIONVALUE)

                if (item.MAXIMUMFLAG == ">") {
                  if (v < max) {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                    item.INSPECTIONVALUE=v.toString()
                  } else {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                    this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                    this.data.checkdetail.subeqlist[i].checkerrcnt++
                    checkerrcnt++
                  }

                } else {
                  if (v <= max) {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                    item.INSPECTIONVALUE=v.toString()
                  } else {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                    this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                    this.data.checkdetail.subeqlist[i].checkerrcnt++
                    checkerrcnt++
                  }
                }


                break
              }

          }

          if (resovle != null) {
            resovle(checkerrcnt)
          }


        } //end if



      } catch (e) {
        console.log(e)
      } //end check values



    }

  }, //end 检查是否超标

  baochunclick: function (res) {
    wx.setStorage({
      data: this.data.checkdetail,
      key: app.globalData.userinfo.pms.env + this.data.storagemachinename + "dailyCheck",
      success: (res) => {
        wx.showToast({
          title: '保存成功',
          duration: 1500
        })
      }
    })
  }, //end function

  //停机switch change
  tingjichange: function (e) {

    let vl = e.detail.value;
    console.log(e);
    let subeqindex = e.currentTarget.dataset.index[0]
    let itemindex = e.currentTarget.dataset.index[1]
    this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].EQSTOP = vl;
    if (vl) {

      //this.data.checkdetail.subeqlist[itemIdx[0]].itemlist[itemIdx[1]].INSPECTIONSTATE="Entering"
      this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].INSPECTIONSTATE = "StopInspection"
      this.setData(
        {
          checkdetail: this.data.checkdetail
        }
      )

    } else {
      this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].INSPECTIONSTATE = "Entering"
      this.setData(
        {
          checkdetail: this.data.checkdetail
        }
      )
      if (this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].INSPECTIONVALUE.length > 0) {
        //this.dianjianzhichaobiao(subeqindex, itemindex, null)
      }
    }

    console.log(this.data.checkdetail);

  }, //end function

  // 全部项目停机免点
  alltingjichange: function (e) {
    let vl = e.detail.value;
    let cdata = this.data.checkdetail.subeqlist
    for (let i = 0; i < cdata.length; i++) {
      for (let k = 0; k < cdata[i].itemlist.length; k++) {
        cdata[i].itemlist[k].EQSTOP = vl
        cdata[i].itemlist[k].INSPECTIONSTATE = vl ? "StopInspection" : "Entering"
      }
    }
    this.setData(
      {
        checkdetail: this.data.checkdetail
      }
    )


  }, //end function

  workTimePickerChange: function (res) {
    console.log(res);
    this.data.checkdetail.workTimeIndex = res.detail.value;
    this.setData({
      checkdetail: this.data.checkdetail
    })
  }, //end function

  shiftPickerChange: function (res) {
    console.log(res);
    this.data.checkdetail.shiftIndex = res.detail.value;
    this.setData({
      checkdetail: this.data.checkdetail
    })
  },//end function

  submitclick: function (res) {
    console.log(res)
    let comment = res.detail.value.comment
    let spaceerrcnt = 0;
    let checkerrcnt = 0
    let data = this.data.checkdetail
    for (let i = 0; i < data.subeqlist.length; i++) {
      for (let j = 0; j < data.subeqlist[i].itemlist.length; j++) {
        let item = data.subeqlist[i].itemlist[j]
        item.DESCRIPTION = "wx:" + comment
        if (item.EQSTOP) {
          continue;
        }
        if (item.INSPECTIONVALUE.length < 1) {
          item.isOk = false;
          spaceerrcnt++;
          data.subeqlist[i].spacecnt++
        } else {
          item.ISOK = true;
        }
        if (item.INSPECTIONRESULT == "NG") {
          checkerrcnt++;
        }


      } //end itemlist for

    }//end subeqlist for
    //点检项目存有未填写的情况
    if (spaceerrcnt > 0) {

      wx.showModal({
        title: '错误',
        content: '存在未填写项目，未能提交！',
        success: (res) => {
          let key = app.globalData.userinfo.pms.env + this.data.storagemachinename + "dailyCheck"

          wx.setStorage({
            data: this.data.checkdetail,
            key: key,
            success: (res) => {
              wx.showToast({
                title: '数据缓存本机',
                duration: 2000
              })
            }
          }) //end setStorage
        }
      })


    }
    //没有点检未填写的情况
    else {

      if (checkerrcnt > 0) {
        wx.showModal({
          title: '提示',
          content: '存在超标项目，是否继续提交',
          success: (res) => {
            if (res.confirm) {
              this.submitToPms(null);  //TODO
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      else {
        this.submitToPms(null); //TODO
      }

    }

    console.log(checkerrcnt);

  },     //end submit

  submitToPms: function (res) {
    let INSPECTIONLIST = []
    for (let i = 0; i < this.data.checkdetail.subeqlist.length; i++) {
      for (let j = 0; j < this.data.checkdetail.subeqlist[i].itemlist.length; j++) {
        let item = this.data.checkdetail.subeqlist[i].itemlist[j]
        let inpsetionvalue = item.INSPECTIONSTATE == 'StopInspection' ? "" : item.INSPECTIONVALUE
        INSPECTIONLIST.push({ INSPECTION: { INSPECTIONID: item.INSPECTIONID, ITEMNAME: item.ITEMNAME, MACHINEGROUPNAME: item.MACHINEGROUPNAME, MACHINENAME: item.MACHINENAME, MACHINESTATENAME: item.MACHINESTATENAME, UNITNAME: item.UNITNAME, SHIFT: item.SHIFT, MAXIMUM: item.MAXIMUM, MAXIMUMFLAG: item.MAXIMUMFLAG, INSPECTIONVALUE: inpsetionvalue, MINIMUMFLAG: item.MINIMUMFLAG, MINIMUM: item.MINIMUM, INSPECTIONUNIT: item.INSPECTIONUNIT, WORKTIME: item.WORKTIME, VERIFIER: item.VERIFIER, ACTIVATESTATE: item.ACTIVATESTATE, DESCRIPTION: item.DESCRIPTION, INSPECTIONSTATE: item.INSPECTIONSTATE, INSPECTIONRESULT: item.INSPECTIONRESULT } })

      }//end for j
    } //end for i
    let date = new Date()
    let datestring = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') + date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0') + date.getSeconds().toString().padStart(2, '0')
    console.log("get date string")
    console.log(datestring)
    app.sendPmsEventMsg(
      {
        latitude: app.globalData.userlocation.latitude,
        longitude: app.globalData.userlocation.longitude,
        messagename: "EnteringInspectionV3",
        env: app.globalData.userinfo.pms.env == undefined ? "test" : app.globalData.userinfo.pms.env,
        userid: app.globalData.userinfo.pms.userid,
        body: { INSPECTIONLIST: INSPECTIONLIST },
        map: { INSPECTIONTIME: datestring, EVENTUSER: app.globalData.userinfo.pms.userid },
        success: (res) => {
          let rtn = res.result.Message.Return
          if (rtn != undefined && rtn != null && rtn.RETURNCODE != undefined && rtn.RETURNCODE != null && rtn.RETURNCODE == '0') {
            console.log("submit inspetion success")
            console.log(res)
            this.data.checkdetail = null;
            this.setData(
              {
                checkdetail: null
              }
            )
            wx.showModal({
              cancelColor: 'cancelColor',
              showCancel: false,
              title: "成功提交",
              content: "点检记录已经成功提交到PMS系统",
              success: (res) => {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
            let key = app.globalData.userinfo.pms.env + this.data.storagemachinename + "dailyCheck"

            //cxm add 20210811
            wx.removeStorage({
              key: key,
            })
          } else {
            wx.showModal({
              cancelColor: 'cancelColor',
              showCancel: false,
              title: "提交失败",
              content: "点检记录未成功提交到PMS系统！RETURNCODE=" + rtn.RETURNCODE,

            })
          }

        },
        fail(err) {
          wx.showModal({
            cancelColor: 'cancelColor',
            showCancel: false,
            title: "提交失败",
            content: "因为网络或系统故障，点检记录未成功提交到PMS系统！",
            success: (res) => {
            }
          })
        }

      })


  } //end submitToPms




})