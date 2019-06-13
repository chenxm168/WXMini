// miniprogram/pages/eqdailycheck.js
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

    },
    shifts: ["A", "B", "C"],
   

    workTimes: ["DayTime", "Night"],
   


    multiArray: [
      ["ARRAY", "CELL", "CF"],
      [],
      []
    ],
    multiIndex: [0, 0, 0],

    storagekey: null,

    storagedata:null,







  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var eqid = ((options.eqid != undefined && options.eqid != null) ? options.eqid : "") + ((options.eqId != undefined && options.eqId != null) ? options.eqId : "")

    if (options.locationok != undefined && options.locationok != null) {

      //加载点检项目的逻辑
      if (eqid.length > 6) {
        this.data.storagekey = "dailyCheck-" + eqid
        this.data.checkdetail.eqid = eqid
        //this.loadCheckList(eqid)
        this.preLoadCheckList(eqid, this.loadOldData, this.loadNewData)
      } else {
        this.loadCheckList(null)
      }
      /*
      if (options != undefined && options != null && options.eqid != undefined && options.eqid != null) {
        this.data.storagekey = "dailyCheck-" + eqid
        this.data.checkdetail.eqid = options.eqid;
        this.loadCheckList(options.eqid)
      } else {
        if (options != undefined && options != null && options.eqId != undefined && options.eqId != null) {
          this.data.storagekey = "dailyCheck-" + eqId
          this.data.checkdetail.eqid = options.eqId;
          this.loadCheckList(options.eqId)
        } else {
          this.loadCheckList(null)
        }

      } */
    } else {
      var args = {
        codeid: options.codeid,
        codepoint: null

      }
      if (eqid.length > 6) {
        this.data.storagekey = "dailyCheck-" + eqid
        app.verifyCode(args, (res2) => {
          if (res2 == undefined || res2.result == undefined || res2.result.codeInfo == undefined || res2.result.returnCode == undefined || res2 == null || res2.result == null || res2.result.codeInfo == null || res2.result.returnCode == null) {
            app.navigateToMessage("二维码出错", "您扫描的二维码无效，或未经系统理注册！", "warn")
          } else {
            if (res2.result.returnCode < 0) {

              app.navigateToMessage("当前位置出错", "您扫描的二维码位置与您所处的当前位置不一致！\n距离差别为：" + res2.result.defValue + "米", "warn")

            } else {

               
                  this.preLoadCheckList(eqid,this.loadOldData,this.loadNewData)

               
                
             
               
              


              /*
              //加载点检项目的逻辑
              if (options != undefined && options != null && options.eqid != undefined && options.eqid != null) {
                this.data.storagekey = "dailyCheck-" + eqid
                this.data.checkdetail.eqid = options.eqid;
                this.loadCheckList(options.eqid)
              } else {
                if (options != undefined && options != null && options.eqId != undefined && options.eqId != null) {
                  this.data.storagekey = "dailyCheck-" + eqId
                  this.data.checkdetail.eqid = options.eqId;
                  this.loadCheckList(options.eqId)
                } else {
                  this.loadCheckList(null)
                }

              }*/




            }

          }

        }, (err) => {
          app.navigateToMessage("验证二维码出错", err, "warn")
        })

      } else {

        this.loadCheckList(null)

      }

    } //end else

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {





  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.hideLoading();

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onDailyCheckDataRequest: function(eqid, resolve, reject) {
    this.data.checkdetail.eqid = eqid
    this.getDailyCheckData(this.data.checkdetail.eqid, (res) => {
      console.log(this.data.checkdetail)
      var eqlist = [];
      eqlist.push(this.data.checkdetail.eqid)
      for (let i = 0; i < this.data.checkdetail.subeqlist.length; i++) {
        eqlist.push(this.data.checkdetail.subeqlist[i].subeqid)
      }
      console.log(eqlist)
      const db = wx.cloud.database();
      const cmd = db.command;
      db.collection('machinespec').where({
        MACHINENAME: cmd.in(eqlist)
      }).get({
        success: (res) => {
          console.log(res);
          for (let j = 0; j < res.data.length; j++) {
            if (res.data[j].MACHINENAME == this.data.checkdetail.eqid) {
              this.data.checkdetail.eqdesc = res.data[j].DESCRIPTION
            } else {
              for (let x = 0; x < this.data.checkdetail.subeqlist.length; x++) {
                if (this.data.checkdetail.subeqlist[x].subeqid == res.data[j].MACHINENAME) {
                  this.data.checkdetail.subeqlist[x].subeqdesc = res.data[j].DESCRIPTION
                }
              }
            }
          } //end for j

          console.log(this.data.checkdetail)
          this.setData({
            checkdetail: this.data.checkdetail
          })
          if (resolve != undefined && resolve != undefined) {
            resolve(null)
          }
        },
        fail: (err) => {

          console.log(err)
          if (reject != undefined && reject != undefined) {
            reject(err)
          }
        }
      })



    }, (err) => {
      if (reject != undefined && reject != undefined) {
        reject(err)
      }
    })

  },



  getDailyCheckData: function(machine, resolve, reject) {
    console.log(machine)
    wx.cloud.callFunction({

      name: 'getDailyCheckData', //测试
      data: {
        eqid: machine
      },
      success: (res) => {
        console.log(res)
        var rs = res.result
        //var rs=res.result.data //test 
        if (rs == null) {
          if (reject != undefined && reject != null) {
            reject(new Error("Not find Check Items!"))


          }
          // res = []
        }
        for (let i = 0; i < rs.length; i++) {


          var checkIt = {
            "ACTIVATESTATE": rs[i].ACTIVATESTATE,
            "INSPECTIONID": rs[i].INSPECTIONID,
            "INSPECTIONSTATE": rs[i].INSPECTIONSTATE,
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
            "CHECKRESULTFLAG": true
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
            sublist.itemlist.push(checkIt)
            this.data.checkdetail.subeqlist.push(sublist)


          } else {
            for (let j = 0; j < this.data.checkdetail.subeqlist.length; j++) {
              if (this.data.checkdetail.subeqlist[j].subeqid == checkIt.UNITNAME) {
                this.data.checkdetail.subeqlist[j].itemlist.push(checkIt)
                checkIt.ITEMINDEX = [j, i]
                break;
              } else {
                if (j == this.data.checkdetail.subeqlist.length - 1) {
                  var sublist = {
                    subeqid: checkIt.UNITNAME,
                    subeqdesc: '',
                    showflag: true,
                    isOk: null,
                    itemlist: [],
                    subeqindex: this.data.checkdetail.subeqlist.length
                  }
                  checkIt.ITEMINDEX = [j, i]
                  sublist.itemlist.push(checkIt)
                  this.data.checkdetail.subeqlist.push(sublist)


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


        //resolve(res.result.data)
      },
      fail: (err) => {
        if (reject != undefined && reject != null) {
          reject(err)
        }

      }

    })


  },

  getPmsGroupList: function(fab, resolve, reject) {
    const db = wx.cloud.database();

    db.collection('pmsgroup').where({
      "FACTORYNAME": fab
    }).get({
      success: (res) => {
        if (resolve != undefined && resolve != null) {
          resolve(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  },

  getEqList: function(group, resolve, reject) {
    const db = wx.cloud.database();
    db.collection('machinespec').where({
      "PMS_MACHINEGROUPNAME": group
    }).get({
      success: (res) => {
        if (resolve != undefined && resolve != null) {
          resolve(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  },



  setFabColumn: function(resolve, reject) {
    const db = wx.cloud.database();
    const c = db.command;
    db.collection('fabs').where({
      "fab": c.neq("OTHER")
    }).get({
      success: (res) => {
        console.log(res)
        var list = []

        for (let i = 0; i < res.data.length; i++) {
          list.push(res.data[i].fab)
        }
        this.data.multiArray[0] = list
        /*
        this.setData(
          {
            multiArray: this.data.multiArray
          }
        )*/
        console.log(this.data.multiArray)
        this.setPmsGroupColumn()
        if (resolve != undefined && resolve != null) {
          resolve(res)
        }

      },
      fail: (err) => {
        if (reject != undefined && reject != null) {
          reject(res)
        }
      }

    })

  },

  setPmsGroupColumn: function(resolve, reject) {
    let index = this.data.multiIndex[0];
    let fab = this.data.multiArray[0][index];
    this.getPmsGroupList(fab,
      (res) => {
        console.log(res)
        var ls = [];
        var rs = res.data;
        for (let i = 0; i < rs.length; i++) {
          ls.push(rs[i].PMS_MACHINEGROUPNAME)
        }
        this.data.multiArray[1] = ls;
        //this.setEqColumn()
        /*
        this.setData(
          {
            multiArray:this.data.multiArray
          }
        )*/
        if (resolve != null) {
          resolve()
        }
      }, (err) => {

      })
  },

  setEqColumn(resolve, reject) {
    let index = this.data.multiIndex[1];
    let group = this.data.multiArray[1][index];
    this.getEqList(group,
      (res) => {
        console.log(res)
        var ls = [];
        var rs = res.data;
        for (let i = 0; i < rs.length; i++) {
          ls.push(rs[i].MACHINENAME)
        }
        this.data.multiArray[2] = ls;
        /*
        this.setData(
          {
            multiArray: this.data.multiArray
          } 
        )*/
        if (resolve != null) {
          resolve()
        }
      }, (err) => {

      })

  },


  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    switch (e.detail.column) {
      case 0:
        {
          this.setPmsGroupColumn(
            (res) => {
              this.setEqColumn((res) => {
                this.setData(data)
              }, (err) => {

              })
            },
            (err) => {

            }
          )
          break
        }

      case 1:
        {
          this.setEqColumn((res) => {
            this.setData(data)

          }, (err) => {

          })
          break
        }

    }



  },


  bindMultiPickerChange: function(e) {
    this.data.multiIndex = e.detail.value
    console.log(e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    wx.showLoading({
      title: '加载点检项目列表中,请稍后',
    })
    var eqid = this.data.multiArray[2][this.data.multiIndex[2]]
    this.onDailyCheckDataRequest(eqid,
      (res) => {
        wx.hideLoading();
        if (this.data.checkdetail.subeqlist.length < 1) {
          wx.showModal({
            title: '未找到点检项目',
            showCancel: false,
            content: '未找到点检项目，请重新选择设备！',
          })
          this.data.checkdetail.eqid = null;
          this.setData({
            checkdetail: this.data.checkdetail
          })
        }

      }, (err) => {
        wx.hideLoading();
        app.navigateToMessage("未找到点检项目", "未能找到此设备的点检项目", "warn")
      });
  },


  test: function() {
    this.setFabColumn(
      (res) => {
        this.setPmsGroupColumn(
          (res) => {
            this.setEqColumn(
              (res) => {
                this.setData({
                  multiArray: this.data.multiArray,
                  multiIndex: this.data.multiIndex
                })
              },
              (err) => {

              }
            )
          },
          (err) => {

          }
        )
      }, (err) => {

      })




  },

  loadCheckList: function(eqid) {
    //let eqid = this.data.checkdetail.eqid;
    if (eqid == null) {
      this.data.errMsg.onError = true;
      this.data.errMsg.errorText = "设备ID为空，请重新扫描！"
      this.setData({
        errMsg: this.data.errMsg
      })

    } else {
      wx.showLoading({
        title: '加载点检项目中',
      })
      this.onDailyCheckDataRequest(eqid,
        (res) => {
          wx.hideLoading()
          //wx.hideLoading();
          if (this.data.checkdetail.subeqlist.length < 1) {
            this.data.errMsg.onError = true;
            this.data.errorText = "未能找到此设备的点检项目，请联系管理员检查PMS或网系统!"
            this.data.checkdetail.eqid = null;

            this.setData({
              checkdetail: this.data.checkdetail,
              errMsg: this.data.errMsg
            })
          }

        }, (err) => {
          wx.hideLoading()
          //wx.hideLoading();
          this.data.errMsg.onError = true;
          this.data.errMsg.errorText = "未能找加载的点检项目，请联系管理员检查网系统!\n" + err
          this.data.checkdetail.eqid = null
          this.setData({
            checkdetail: this.data.checkdetail,
            errMsg: this.data.errMsg
          })
        })




    } //end else
  }, //end function

  onInputChange: function(e) {
    console.log(e)
    let crrValue = e.detail.value
    let reg1 = new RegExp("^([0-9])+(\.)?([0-9])*$")
    let reg2 = new RegExp("^(-$|-([0-9])+(\.)?([0-9])*$)")
    if (crrValue.length < 1 || reg1.test(crrValue) || reg2.test(crrValue)) {
      let subeqindex = e.currentTarget.dataset.index[0]
      let itemindex = e.currentTarget.dataset.index[1]
      this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].INSPECTIONVALUE = e.detail.value
      this.setData({
        checkdetail: this.data.checkdetail
      })

    }
    //subeqindex= e.currenttarget
    else {
      this.setData({
        checkdetail: this.data.checkdetail
      })
    }

  }, //end function

  shiftPickerChange: function(e) {
    this.data.checkdetail.shiftIndex = e.detail.value
    this.setData({
      checkdetail: this.data.checkdetail
    })
  }, //end function

  workTimePickerChange: function(e) {
    this.data.checkdetail.workTimeIndex = e.detail.value
    this.setData({
      checkdetail: this.data.checkdetail
    })

  },

  onSumit: function() {
    var spaceerrcnt = 0;
    var checkerrcnt = 0
    var data = this.data.checkdetail

    for (let i = 0; i < data.subeqlist.length; i++) {
      for (let j = 0; j < data.subeqlist[i].itemlist.length; j++) {
        data.subeqlist[i].itemlist[j].SHIFT = this.data.shifts[this.data.checkdetail.shiftIndex],
          data.subeqlist[i].itemlist[j].WORKTIME = this.data.workTimes[this.data.checkdetail.workTimeIndex]
        if (data.subeqlist[i].itemlist[j].INSPECTIONVALUE.length < 1) {
          data.subeqlist[i].itemlist[j].ISOK = false
          data.subeqlist[i].spacecnt++
            spaceerrcnt++
        } else {
          data.subeqlist[i].itemlist[j].ISOK = true
        }



        //start check values
        try {
          let item = data.subeqlist[i].itemlist[j]
          /*let numflag = ((item.MAXIMUMFLAG != undefined && item.MAXIMUMFLAG != null) ? 0 : 1) + ((item.MINIMUMFLAG != undefined && item.MINIMUMFLAG != null) ? 0 : 2)*/
          let num = ((item.MAXIMUM != undefined && item.MAXIMUM != null && item.MAXIMUMFLAG != undefined && item.MAXIMUMFLAG != null) ? 1 : 0) + ((item.MINIMUM != undefined && item.MINIMUM != null && item.MINIMUMFLAG != undefined && item.MINIMUMFLAG != null) ? 2 : 0)
          if (item.INSPECTIONVALUE.length > 0) {


            switch (num) {
              //max min has value
              case 3:
                {
                  let max = parseFloat(item.MAXIMUM)
                  let min = parseFloat(item.MINIMUM)
                  let v = parseFloat(item.INSPECTIONVALUE)
                  let innerflag = (item.MAXIMUMFLAG == ">" ? 0 : 1) + (item.MINIMUMFLAG == ">" ? 0 : 2)

                  switch (innerflag) {
                    // 大于最小值，小于最大值
                    case 0:
                      {
                        if (v < max && v > min) {
                          data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                        } else {
                          data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                          data.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                          data.subeqlist[i].checkerrcnt++
                            checkerrcnt++
                        }
                        break
                      }

                      // 小于等于max  大于最小值  
                    case 1:
                      {
                        if (v <= max && v > min) {
                          data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                        } else {
                          data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                          data.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                          data.subeqlist[i].checkerrcnt++
                            checkerrcnt++
                        }
                        break
                      }

                      //小于MAX 大于等于最小
                    case 2:
                      {
                        if (v < max && v >= min) {
                          data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                        } else {
                          data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                          data.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                          data.subeqlist[i].checkerrcnt++
                            checkerrcnt++
                        }
                        break
                      }

                      //小于等于MAX，大于等于MIN
                    case 3:
                      {
                        if (v <= max && v >= min) {
                          data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                        } else {
                          data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                          data.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                          data.subeqlist[i].checkerrcnt++
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


                  let min = parseFloat(item.MINIMUM)
                  let v = parseFloat(item.INSPECTIONVALUE)
                  if (item.MINIMUMFLAG == ">") {

                    if (v > min) {
                      data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                    } else {
                      data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                      data.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                      data.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                    }

                  } else {
                    if (v >= min) {
                      data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                    } else {
                      data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                      data.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                      data.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                    }

                  }

                  break
                }

                //only max has value
              case 1:
                {
                  let max = parseFloat(item.MAXIMUM)

                  let v = parseFloat(item.INSPECTIONVALUE)

                  if (item.MAXIMUMFLAG == ">") {
                    if (v < max) {
                      data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                    } else {
                      data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                      data.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                      data.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                    }

                  } else {
                    if (v <= max) {
                      data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                    } else {
                      data.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                      data.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                      data.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                    }
                  }


                  break
                }










            }



          }

          /*
                    if (item.INSPECTIONVALUE.length > 0) {
                      if (item.MINIMUM != undefined && item.MINIMUM != null && item.MAXIMUM != undefined && item.MAXIMUM != null) {

                        let max = parseFloat(item.MAXIMUM)
                        let min = parseFloat(item.MINIMUM)
                        let v = parseFloat(item.INSPECTIONVALUE)
                        if (max == min) {
                          if (v == min) {
                            item.INSPECTIONRESULT = "OK"
                          } else {
                            item.INSPECTIONRESULT = "NG"
                          }



                        } else {


                        }


                      } else {


                      }
                    } */

        } catch (e) {
          console.log(e)
        } //end check values

      }
    }

    console.log(JSON.stringify(this.data.checkdetail))
    this.data.checkdetail = data
    this.setData({
      checkdetail: this.data.checkdetail
    })

      this.storageToMobile()
    let innernum = (checkerrcnt < 1 ? 0 : 1) + (spaceerrcnt < 1 ? 0 : 2)

    switch (innernum) {
      case 0:
        {
          this.sumitToPms()
          break
        }


      case 1:

        {
          this.hasErrorValue()
          break
        }


      case 2:
        {
          this.hasSpaceValue()
          break
        }


      case 3:
        {
          this.hasSpaceValue()
          break
        }


    }


    /*
    if (spaceerrcnt > 0) {
      wx.showModal({
        showCancel: false,
        title: '输入错误',
        content: '点检值不能为空',
        success:(res)=>
        {
           
        }
      })

      
    } else {

      if(checkerrcnt<1)
      {
      wx.showLoading({
        title: '点检表提交中',
      })
     
      }else
      {
        wx.hideLoading()
        wx.showModal({
          title: '点检存在超标',
          content: '点检值存在超标的项目，是否继续提交？',
          success:(res)=>
          { 
           if(res.cancel)
           {
             this.setData({
               checkdetail: this.data.checkdetail
             })
           }else
           {
             

           }
          },
          fail:(err)=>
          {
            wx.hideLoading()
          }
        })

      }
    } */


  }, //end sumit function


  onSubeqclick: function(e) {
    this.data.checkdetail.subeqlist[e.currentTarget.dataset.index].showflag = !this.data.checkdetail.subeqlist[e.currentTarget.dataset.index].showflag
    this.setData({
      checkdetail: this.data.checkdetail
    })

  }, //end function


  sumitToPms: function(res) {
    
    wx.showLoading({
      title: '点检表提交中',
    })
    wx.cloud.callFunction({
      name: "sumitDailyCheckData",
      data: this.data.checkdetail,
      success: (res) => {
        this.data.checkdetail = {
          eqid: null,
          eqdesc: null,
          fab: null,
          subeqlist: []
        }
        this.setData({
          checkdetail: this.data.checkdetail
        })
        wx.hideLoading()
        wx.removeStorage({
          key: this.data.storagekey,
          success: function(res) {},
        })
        app.navigateToMessage("提交成功", "点检表已成功提交到PMS", "success")
      },
      fail: (err) => {
        wx.hideLoading()
        app.navigateToMessage("提交错误", "点检表未能提交到PMS\n" + err, "warn")
      }
    })




  }, //end function


  hasSpaceValue: function() {
    wx.hideLoading()
    this.setData({
      checkdetail: this.data.checkdetail
    })


    wx.showModal({
      showCancel: false,
      title: '输入错误',
      content: '点检值不能为空',
      success: (res) => {
        
        return

      },
      fail: (err) => {
        this.setData({
          checkdetail: this.data.checkdetail
        })
        wx.hideLoading()
        app.navigateToMessage("程序出错了", "出错了" + err, "warn")
      }
    })

  },

  hasErrorValue: function() {
    wx.hideLoading()
    wx.showModal({
      title: '点检存在超标',
      content: '点检值存在超标的项目，是否继续提交？',
      success: (res) => {
        if (res.cancel) {
          
          this.setData({
            checkdetail: this.data.checkdetail
          })
        } else {

          this.sumitToPms()
        }
      },
      fail: (err) => {
        wx.hideLoading()
        this.setData({
          checkdetail: this.data.checkdetail
        })
        
        app.navigateToMessage("程序出错了", "出错了" + err, "warn")
      }
    })



  }, //end function

  /**
   * storage checkdetail to mobile
   */
  storageToMobile: function() {
    if (this.data.storagekey != null) {
      wx.setStorage({
        key: this.data.storagekey,
        data: this.data.checkdetail,
      })

    }

  }, //end function


  preLoadCheckList:function(eqid,loadOld,startNew)
  {
    

    wx.getStorage({
      key: this.data.storagekey,
      success: function (res) {
        console.log(res)
        //this.data.storagedata = res.data
        var eqdata = res.data
       
        
        wx.showModal({
          title: '存在未提交的记录',
          content: '本机存上未完成提交的记录，是否继续上次未完成记录',
          cancelText: "不继续",
          confirmText: "继续上次",
          success: (res) => {
            if (res.confirm) {
                loadOld(eqdata)
              
            } else {
              startNew(eqid)
            }

          },

        }) 

      },
      fail: (res) => {
        this.data.checkdetail.eqid = eqid
        this.loadCheckList(eqid)
      }
    })

  },//end function






    loadOldData:function(data)
    {
      this.data.checkdetail=data
      this.setData
      (
      {
        checkdetail:this.data.checkdetail
      }
      )
    },//end function

    loadNewData: function(eqid)
    {
       
      this.loadCheckList(eqid)
    }



    




})