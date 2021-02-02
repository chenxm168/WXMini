// miniprogram/pages/exam/exam.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    ts: 60,
    ms: 1,

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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options);

    if (options.eqid != undefined && options.eqid != null && options.eqid.length > 0) {
      let key = 'dailycheck' + options.eqid
      this.data.checkdetail.eqid = options.eqid;

      let vl = wx.getStorageSync(key);
      if (vl == undefined || vl == null || vl.length < 1) {
        this.loadCheckList(options.eqid);
      } else {
        wx.showModal({
          title: '存在未提交的记录',
          content: '本机存在未完成提交的记录，是否继续上次未完成记录',
          cancelText: "不继续",
          confirmText: "继续上次",
          success: (res) => {
            if (res.confirm) {
              this.data.dailycheck = vl
              this.setData(
                {
                  checkdetail: this.data.dailycheck
                }
              )

            } else {
              this.loadCheckList(options.eqid);
            }

          },

        })

      }

      /*
      wx.getStorage({
        key: "dailycheck"+options.eqid,
        success:(res)=>
        {
          console.log(res)
          if(res.data==undefined||res.data==null)
          {
            this.loadCheckList(options.eqid);
          }else
          {
            console.log(res)
            this.data.dailycheck=res.data
          }
          
          
        },
        reject:function(err)
        {
          console.log(err)
        }

      }) */


    }
    console.log(this.data.checkdetail.eqid);





    /*
    var that = this;
    var ts2 = this.data.ts;
    var ms2 = this.data.ms;
    var t = setInterval(function(
    ){
      //console.log(ts2);



     if((ts2--)==0)
     {

        if(ms2<1)
        {
          clearInterval(t);
        }else
        {
          ms2--
          ts2=59
        }


     }
     if(ts2==0&&ms2==0)
     {
       clearInterval(t)
     }



      that.setData(
        {
          ts: ts2,
          ms:ms2
        }
      )

    },1000)  */

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
    let user = app.globalData.appUserInfo
    console.log(user)
    if (user.env == "prod") {

      if (app.globalData.globalconfig != null) {
        wx.setNavigationBarColor({
          frontColor: app.globalData.globalconfig.prodnavcolor,
          backgroundColor: app.globalData.globalconfig.prodnavbackcolor,
        })

        wx.setNavigationBarTitle({
          title: app.globalData.globalconfig.prodnavtitle,
        })

      }


    } else {
      if (app.globalData.globalconfig != null) {
        wx.setNavigationBarColor({
          frontColor: app.globalData.globalconfig.devnavcolor,
          backgroundColor: app.globalData.globalconfig.devnavbackcolor,
        })

        wx.setNavigationBarTitle({
          title: app.globalData.globalconfig.devnavtitle,
        })
      }


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
    this.loadCheckList(null);
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

  onInterval: function () {
    console.log(ts);
  },
  onAddImage: function () {
    wx.chooseImage({
      success: function (res) {
        console.log(res.tempFilePaths[0]);

        wx.cloud.uploadFile({

          cloudPath: 'my-photo.png',
          filePath: res.tempFilePaths[0],
          success: function (res) {
            wx.showToast({
              title: 'Success!',
              icon: 'success'
            })
          },


        })



      },
    })
    console.log("ddd");
  },
  soterAuth: function () {
    wx.getSystemInfo({
      success: (result) => {
        if (result.enviroment == undefined) {
          console.log("weichart environment");
        }

        // console.log(result)
      },
    })

    wx.checkIsSupportSoterAuthentication({
      success: (res) => {
        if (res.supportMode != []) {
          wx.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: '123456',
            authContent: '请用指纹解锁',
            success(res) {
              console.log(res)
            }
          })
        }
        console.log(res)

      },
    })
  },
  workTimePickerChange: function (res) {
    console.log(res);
    this.data.checkdetail.workTimeIndex = res.detail.value;
    this.setData({
      checkdetail: this.data.checkdetail
    })
  },
  shiftPickerChange: function (res) {
    console.log(res);
    this.data.checkdetail.shiftIndex = res.detail.value;
    this.setData({
      checkdetail: this.data.checkdetail
    })
  },

  loadCheckList: function (eqid) {
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

  onDailyCheckDataRequest: function (eqid, resolve, reject) {
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



  getDailyCheckData: function (machine, resolve, reject) {
    console.log(machine)
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
              "UNIQUE":"",
              "UNIQUESEQ":0
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
               checkIt.UNIQUE=checkIt.UNIQUE=sublist.subeqid+ "-"+ checkIt.INSPECTIONID+"-"+i
               checkIt.UNIQUESEQ=0;
              sublist.itemlist.push(checkIt)
              this.data.checkdetail.subeqlist.push(sublist)


            } else {
              for (let j = 0; j < this.data.checkdetail.subeqlist.length; j++) {
                if (this.data.checkdetail.subeqlist[j].subeqid == checkIt.UNITNAME) {
                  
                  //checkIt.ITEMINDEX = [j, i]
                  
                  checkIt.ITEMINDEX = [j,  this.data.checkdetail.subeqlist[j].itemlist.length]
                  checkIt.UNIQUE= checkIt.UNIQUE=sublist.subeqid+ "-"+ checkIt.INSPECTIONID+"-"+i
                  checkIt.UNIQUESEQ=j+i;
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
                    checkIt.ITEMINDEX = [this.data.checkdetail.subeqlist.length,  0]
                    checkIt.UNIQUE= checkIt.UNIQUE=sublist.subeqid+ "-"+ checkIt.INSPECTIONID+"-"+i
                    checkIt.UNIQUESEQ=j+i;
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


    })


  },

  //点检输入失去焦点
  dianjianzhiblur: function (e) {
    console.log(e);
    let crrValue = e.detail.value
    let reg1 = new RegExp("^([0-9])+(\.)?([0-9])*$")
    let reg2 = new RegExp("^(-$|-([0-9])+(\.)?([0-9])*$)")
    if (crrValue.length < 1 || reg1.test(crrValue) || reg2.test(crrValue)) {
      let subeqindex = e.currentTarget.dataset.index[0]
      let itemindex = e.currentTarget.dataset.index[1]
      this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].INSPECTIONVALUE = e.detail.value
      this.dianjianzhichaobiao(subeqindex, itemindex, null)
      this.setData(
        {
          checkdetail: this.data.checkdetail
        }
      )
    } else {
      if (e.detail.value.length > 0) {
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

  },

  //停机switch change
  tingjichange: function (e) {

    let vl = e.detail.value;
    console.log(e);
    let subeqindex = e.currentTarget.dataset.index[0]
    let itemindex = e.currentTarget.dataset.index[1]
    this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].EQSTOP = vl;
    if(vl)
    {
      
      //this.data.checkdetail.subeqlist[itemIdx[0]].itemlist[itemIdx[1]].INSPECTIONSTATE="Entering"
      this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].INSPECTIONSTATE = "StopInspection"
      
    }else
    {
      this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].INSPECTIONSTATE = "Entering"
      if(this.data.checkdetail.subeqlist[subeqindex].itemlist[itemindex].INSPECTIONVALUE.length>0)
      {
        //this.dianjianzhichaobiao(subeqindex, itemindex, null)
      }
    }
    this.setData(
      {
        checkdetail: this.data.checkdetail
      }
    )
    console.log(this.data.checkdetail);

  },

  //点击保存按键
  baochunclick: function (res) {
    console.log("baochun")
    let key = "dailycheck" + this.data.checkdetail.eqid;

    wx.setStorage({
      data: this.data.checkdetail,
      key: key,
    })
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000

    })
  },

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
        let num = ((item.MAXIMUM != undefined && item.MAXIMUM != null && item.MAXIMUMFLAG != undefined && item.MAXIMUMFLAG != null) ? 1 : 0) + ((item.MINIMUM != undefined && item.MINIMUM != null && item.MINIMUMFLAG != undefined && item.MINIMUMFLAG != null) ? 2 : 0)
        if (item.INSPECTIONVALUE.length > 0) {


          switch (num) {
            //max min has value
            case 3:
              {
                //let max = parseFloat(item.MAXIMUM)
                // let min = parseFloat(item.MINIMUM)
                //let v = parseFloat(item.INSPECTIONVALUE)
                let innerflag = (item.MAXIMUMFLAG == ">" ? 0 : 1) + (item.MINIMUMFLAG == ">" ? 0 : 2)

                switch (innerflag) {
                  // 大于最小值，小于最大值
                  case 0:
                    {
                      if (v < max && v > min) {
                        this.this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                      } else {
                        this.this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                        this.this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                        this.this.data.checkdetail.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                      }
                      break
                    }

                  // 小于等于max  大于最小值  
                  case 1:
                    {
                      if (v <= max && v > min) {
                        this.this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                      } else {
                        this.this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                        this.this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                        this.this.data.checkdetail.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                      }
                      break
                    }

                  //小于MAX 大于等于最小
                  case 2:
                    {
                      if (v < max && v >= min) {
                        this.this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
                      } else {
                        this.this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                        this.this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                        this.data.checkdetail.subeqlist[i].checkerrcnt++
                        checkerrcnt++
                      }
                      break
                    }

                  //小于等于MAX，大于等于MIN
                  case 3:
                    {
                      if (v <= max && v >= min) {
                        this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
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
                  } else {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                    this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                    this.data.checkdetail.subeqlist[i].checkerrcnt++
                    checkerrcnt++
                  }

                } else {
                  if (v >= min) {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
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
                  } else {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "NG"
                    this.data.checkdetail.subeqlist[i].itemlist[j].CHECKRESULTFLAG = false
                    this.data.checkdetail.subeqlist[i].checkerrcnt++
                    checkerrcnt++
                  }

                } else {
                  if (v <= max) {
                    this.data.checkdetail.subeqlist[i].itemlist[j].INSPECTIONRESULT = "OK"
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

  //完成提交
  submitclick: function (res) {
    let spaceerrcnt = 0;
    let checkerrcnt = 0
    let data = this.data.checkdetail
    for (let i = 0; i < data.subeqlist.length; i++) {
      for (let j = 0; j < data.subeqlist[i].itemlist.length; j++) {
        let item = data.subeqlist[i].itemlist[j]
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
        success:(res)=> {
          let key = "dailycheck" + this.data.dailycheck.eqid

          wx.setStorage({
            data: this.data.dailycheck,
            key: key,
            success:(res)=>
            {
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
         
        if(checkerrcnt>0)
        {
          wx.showModal({
            title: '提示',
            content: '存在超标项目，是否继续提交',
            success: (res)=> {
            if (res.confirm) {
              this.submitToPms(null);
            } else if (res.cancel) {
            console.log('用户点击取消')
            }
            }
            })
        }
        else
        {
          this.submitToPms(null);
        }

    }

    console.log(checkerrcnt);

  },     //end submit

  submitToPms: function (res) {
    let key ="dailycheck" +this.data.checkdetail.eqid;
    wx.showLoading({
      title: '点检表提交中',
    })
    console.log(JSON.stringify(this.data.checkdetail))
    let args =
    {
      env: app.globalData.appUserInfo.env,
      checkdetail: this.data.checkdetail
    }
    console.log(JSON.stringify(args))
    wx.cloud.callFunction({
      name: "sumitDailyCheckData",
      data: args,
      success: (res) => {
        if (res.result.returnCode != 0) {
          wx.hideLoading()
          app.navigateToMessage("提交错误", res.result.returnText, "warn")
        }
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
          key: key,
          success: function (res) { },
        })
        app.redirectToMessage("提交成功", "点检表已成功提交到PMS", "success")
      },
      fail: (err) => {
        wx.hideLoading()
        app.navigateToMessage("提交错误", "点检表未能提交到PMS\n" + err, "warn")
      }
    })




  }

})