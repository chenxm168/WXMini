// miniprogram/pages/main/main.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: [0, 1, 3],
    scanStr: "",
    userManagerShow:true,
    isOnScanNow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    

    

     

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
    this.data.isOnScanNow=false
    wx.hideLoading()
    let user = app.globalData.appUserInfo
    console.log(user)
    if (user.env == "prod") {

      if(app.globalData.globalconfig!=null)
      {
        wx.setNavigationBarColor({
          frontColor: app.globalData.globalconfig.prodnavcolor,
          backgroundColor: app.globalData.globalconfig.prodnavbackcolor,
        })

        wx.setNavigationBarTitle({
          title: app.globalData.globalconfig.prodnavtitle,
        })

      }
      

    }else
    {
      if(app.globalData.globalconfig!=null)
      {
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
  onHide: function() {
    wx.hideLoading()
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

  },  //end 


  /**
   * 
   * onScan binding
   */

  onScan: function() {
    if (this.data.isOnScanNow)
    {
      return
    }

    wx.scanCode({
      success:(res)=>
      {
        var args=
        {
          codeurl: res.result,
         codepoint:null,
         env:null

        }
        app.verifyCode(args,(res2)=>
        {
          console.log(res2)
          if (res2 == undefined || res2.result == undefined || res2.result.data.codeInfo == undefined || res2.result.returnCode == undefined || res2 == null || res2.result == null || res2.result.data.codeInfo == null || res2.result.returnCode == null)
          {
            app.navigateToMessage("二维码出错", "您扫描的二维码无效，或未经系统理注册！", "warn")
          }else
          {
            if (res2.result.returnCode <0){

              app.navigateToMessage("当前位置出错", "您扫描的二维码位置与您所处的当前位置不一致！\n距离差别为：" + res2.result.data.defValue+"米", "warn")

            }else
            {
              let url1 = res2.result.data.codeInfo.page + res2.result.data.codeInfo.args+"&locationok=Y"
            
            wx.navigateTo({
              url: url1,
            })
            }

          }

        }, (err)=>
        { 
          app.navigateToMessage("验证二维码出错", err, "warn")
        })
      }
    })

   

  },//end onScan

  onUserManager: function() {
   
   let eqid ="A1CVD01"
   
   if(eqid.length<8)
   {
     let fab= eqid.substring(0,2)
     let eqtype= eqid.substring(2,5)
     let eqnum = eqid.substring(5,7)
     let str2= "/(^"+fab+"$)|(^"+fab+eqtype+"$)|(^"+fab+eqtype+eqnum+")/i"
     console.log(str2)
     let str = "(^A1)|(^A1CVD)|(^A1CVD01)"
     let reg = new RegExp(str2)

      let rs = reg.test("A1CDV")
      console.log(rs)
    
      let db = wx.cloud.database()
      console.log(eqid)
        db.collection("pageprivilege").where(
          {
            userid:"99052728",
            eqid:new db.RegExp(
              {
                regexp:str2,
                options:'i'
              }
            ),
            page:"dailyCheck"
          }
        ).get(
          {
            success:(res)=>
            {
              console.log(res)
            }
          }
        )

   }else
   {

   }

   wx.showModal({
     title: '暂未开放使用',
     content: '开发测试中，暂未开放用户使用',
     showCancel:false,
   })
    

/*
    let reg1 = new RegExp("^([0-9])+(\.)?([0-9])*$")
    //let reg2 = new RegExp("^(-|-\d){1,1}([0-9])*(\.)?([0-9])*$")
    let reg2 = new RegExp("^(-$|-([0-9])+(\.)?([0-9])*$)")
    console.log("reg")
    let s ="-0."
    let r = reg2.test(s)
    if(r)
    {
      console.log(r)
    }else
    {
      console.log(r)
    }*/


    /*
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {

            this.setData(
              {
                scanStr: res.result
              }
            )
            console.log(res)
          },
          fail: (err) => {
            console.log(err)
          }
        }) */



    /*
    var code ={
      eqpid:"C1ODF01",
      eqdesc:"ODF 1# ",
      fab:"CELL",
      url:"../dailyCheck/eqdailycheck",
      args:"? eqid=A1CVD01"
    }
    let str = JSON.stringify(code)
    console.log(str)
    wx.navigateTo({
      url: '../dailyCheck/eqdailycheck?eqid=A1CVD01',
    })
    wx.authorize({
      scope: 'scope.userLocation',
      success:(res)=>
      {
        console.log(res)
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {

            this.setData(
              {
                scanStr: res.result
              }
            )
            console.log(res)
          },
          fail: (err) => {
            console.log(err)
          }
        })
      },
      fail:(err)=>
      {
        console.log(err)
      }

    }) */


    //test
    /*
    var url = "https:xxxxx.com?codeId=WXDailCheckC1ODF01001&eqId=C1ODF01&codeCategory=dailyCheck"
    app.get2DCodeUrlArgs(url, (res) => {
      console.log(res)

      for (let key in res) {
        console.log(key + "=" + res[key])

      }

    }, (err) => {

    }) */

  },

  onBinding: function(e) {
    
    wx.navigateTo({
      url: '../bindingCode/bindingCode',
    })

     /* 权限验证证放到下级页面
     wx.cloud.callFunction(
       {
         
         
         name:"verifyPrivilege",
         data:
         {
           page:"bindingCode"
         },
         success:(res)=>
         {
           if(res.result.userinfo!=undefined&&res.result.userinfo!=null)
           {
             app.globalData.appUserInfo=res.result.userinfo
           }
           if(res.result.returnCode<0)
           {
             app.navigateToMessage("权限验证失败",res.result.returnText,"warn")
           }else
           {
             wx.navigateTo({
               url: '../bindingCode/bindingCode',
             })
           }
         },
         fail:(err)=>
         {
           app.navigateToMessage("权限验证出错", err, "warn")
         }
       }
     )*/
 

  },

  /**
   * 
   * sumit code loaction to server db
   * 
   */
  sumitCodeLocation: function(arg, resolve, reject) {
    wx.showLoading({
      title: '位置信息绑定中',
    })
    app.getCurrentLocation(res => {
      wx.cloud.callFunction({
        name: "bindingCodeLocation",
        data: {
          codeId: arg,
          point: res,


        },
        success: (res) => {
          app.navigateToMessage("绑定成功", "二维码位置已成功绑定", "success")
        },
        fail: (err) => {
          app.navigateToMessage("绑定信息提交失败!", err, "warm")
        }

      })


    }, (err) => {
      app.navigateToMessage("获取当前位置失败!", err, "warn")
    })

   

  }, //end function


  /**
   * 
   * get current loacation for binding
   *

  getCurrentLocation: function(resolve, reject) {

    wx.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        console.log(res)
        wx.getLocation({
          type: 'wgs84',
          success: function(res2) {


            console.log(res2)

            var point = {
              latitude: res2.latitude,
              longitude: res2.longitude,
              horizontalAccuracy: res2.horizontalAccuracy,
              speed: res2.speed,
              verticalAccuracy: res2.verticalAccuracy,
              accuracy: res2.accuracy
            }

            resolve(point)


          },
          fail: (err) => {
            console.log(err)
            reject(new Error("获取位置失败"))
            //app.navigateToMessage("获取位置失败!", err, "warm")
          }
        }) //end wx scan
      },
      fail: (err) => {
        console.log(err)
        reject(new Error(err))
      }
    }) //end get current loaction

  }, */


  /**
   * 
   * verify code 
   * 
   *

  verifyCode:function(arg,resolve,reject)
  {
     let  codeid= arg
     
     this.getCurrentLocation(
       (res)=>
       {
         wx.cloud.callFunction(
           {
             name: "verifyCodeLocation",
             data: {
               'codeid': codeid,
                codepoint:res.point
             },
             success: (res) => {
               resolve(res)
             },
             fail: (err) => {
               reject(new Error(err))
             }

           }
         )
       }
       ,(err)=>
       {
          reject(new Error("获取当前位置失败\n"+err))
       }
     )

   
   


  }, */ //end verifyCode



})