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



    },

    multiArray: [
      ["ARRAY", "CELL", "CF"],
      [],
      []
    ],
    multiIndex: [0, 0, 0],







  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (options != undefined && options != null && options.eqid != undefined && options.eqid != null) {
      this.data.checkdetail.eqid = options.eqid;
      this.loadCheckList(options.eqid)
    }else{
       this.loadCheckList(null)
    }
    /*
    if (options != undefined && options != null && options.eqid != undefined && options.eqid != null) {
      this.data.checkdetail.eqid = options.eqid
      this.onDailyCheckDataRequest(options.eqid,
        (res) => {
          //wx.hideLoading();
          if (this.data.checkdetail.subeqlist.length < 1) {
            wx.showModal({
              title: '未找到点检项目',
              showCancel: false,
              content: '未找到点检项目，请重新选择设备！',
            })
            this.data.checkdetail.eqid = null;
            this.setData(
              {
                checkdetail: this.data.checkdetail
              }
            )
          }

        }, (err) => {
          //wx.hideLoading();
          app.navigateToMessage("程序出错了！", "未能找到此设备的点检项目", "warn")
        })
    } else {


      this.setFabColumn(
        () => {
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


    }

     */

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
            "ISOK": null
          }

          if (this.data.checkdetail.subeqlist < 1 && i < 1) {
            var sublist = {
              subeqid: checkIt.UNITNAME,
              subeqdesc: '',
              showflag: true,
              isOk: null,
              itemlist: []
            }
            sublist.itemlist.push(checkIt)
            this.data.checkdetail.subeqlist.push(sublist)


          } else {
            for (let j = 0; j < this.data.checkdetail.subeqlist.length; j++) {
              if (this.data.checkdetail.subeqlist[j].subeqid == checkIt.UNITNAME) {
                this.data.checkdetail.subeqlist[j].itemlist.push(checkIt)
                break;
              } else {
                if (j == this.data.checkdetail.subeqlist.length - 1) {
                  var sublist = {
                    subeqid: checkIt.UNITNAME,
                    subeqdesc: '',
                    showflag: true,
                    isOk: null,
                    itemlist: []
                  }
                  sublist.itemlist.push(checkIt)
                  this.data.checkdetail.subeqlist.push(sublist)


                } else {
                  continue
                }
              }
            }


          }



        } //enf for i
        if (resolve != undefined && resolve != null)
        {
          resolve()
        }
        

        //resolve(res.result.data)
      },
      fail: (err) => {
        if(reject!=undefined&&reject!=null)
        {
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
        app.navigateToMessage("程序出错了！", "未能找到此设备的点检项目", "warn")
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

loadCheckList:function(eqid)
{
  //let eqid = this.data.checkdetail.eqid;
  if (eqid==null)
  {
    this.data.errMsg.onError = true;
    this.data.errMsg.errorText = "设备ID为空，请重新扫描！"
    this.setData(
      {
        errMsg: this.data.errMsg
      }
    )

  }else{
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
          
          this.setData(
            {
              checkdetail: this.data.checkdetail,
              errMsg: this.data.errMsg
            }
          )
        }

      }, (err) => {
        wx.hideLoading()
        //wx.hideLoading();
        this.data.errMsg.onError = true;
        this.data.errMsg.errorText = "未能找加载的点检项目，请联系管理员检查网系统!\n" + err
        this.data.checkdetail.eqid=null
        this.setData(
          {
            checkdetail: this.data.checkdetail,
            errMsg: this.data.errMsg
          }
        )
      })

  


  }//end else
}

})