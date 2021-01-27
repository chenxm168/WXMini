// miniprogram/pages/exam/exam2.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

      eqidisok:false,
      eqid:""
      

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  eqidsubmit:function(res)
  {
    console.log("submit:"+this.data.eqid);
    
    console.log(res)
     let eqid = res.detail.value.eqid.toUpperCase()
     this.data.eqid=eqid

   
   this.verifyeqidsyn(eqid,this.navigateToDailyCheck,this.rejecteqid)
      
    
  },

  eqidblur:function(res)
  {
         console.log(res)
         let eqid= res.detail.value.toUpperCase()
         this.data.eqid=eqid
         console.log(this.data.eqid)
         /*
         const db = wx.cloud.database();
      const cmd = db.command;
      db.collection('machinespec').where({
        MACHINENAME: cmd.in(eqlist)
      }).get({
        success: (res) => {
        },
        fail:(res)=>
        {

        }
      }) */
     // let reg1 = new RegExp("^[A-Za-z][0-9]{1}[a-zA-Z]{3}[0-9]{2}")
     // let rs=reg1.test(eqid);
       //console.log("regexp result:"+rs)

        //let rs= this.verifyeqidsyn(eqid)
      // this.preverifyeqid(eqid)
      this.data.eqid=eqid

  },
/*
  preverifyeqid:function(eqid)
  {
    if(eqid.lenght>=7)
    {
       if(this.verifyeqidsyn(eqid))
       {
         
          this.data.eqidisok=true;
           
          this.setData(
            {
              eqidisok:this.data.eqidisok
            }
          )


       }

    }else
    {
         wx.showToast({
           title: '设备ID无效',
         })
    }
    {
      wx.showToast({
        title: '设备ID无效',
      })
    }
  },
  */
  verifyeqidsyn:function(eqid,resolve,reject)
  {
    let rt=false;
    if(eqid.length<7)
    {
      if(reject!=null)
      {
        reject()
      }
    }
    
    //let reg2 = new RegExp("^([0-9])+(\.)?([0-9])*$")
    let reg1 = new RegExp("^[A-Za-z][0-9]{1}[a-zA-Z]{3}[0-9]{2}")
     
      if( reg1.test(eqid))
      {
        console.log("Regexp result: true")
        let eqlist=[]
        eqlist.push(eqid)
        const db = wx.cloud.database();
        const cmd = db.command;
        db.collection('machinespec').where({
          MACHINENAME: cmd.in(eqlist)
        }).get({
          success: (res) => {
            console.log(res.data)
            if(res.data.length>0)
            {
              console.log("search db OK")
              console.log(res.data.length)
              
              if(resolve!=null)
              {
                resolve(eqid);
              }
            }else
            {
              console.log("search db NG")
              reject()
            }
            },
            
          fail:(res)=>
          {
             console.log(res)
             if(reject!=null)
             {
               reject()
             }
          }
        }) 


      }
      //console.log("verify result:"+rt)
      
  },
  navigateToDailyCheck:function(eqid)
  {
    
    let url1="exam?eqid="+eqid;
    console.log(url1);
    wx.navigateTo({
      url: url1,
    })
   
  },

  rejecteqid:function(eqid)
  {
    
    wx.showToast({
      title: '设备ID无效',
    })
   
  },

  scanclick:function(res)
  {
     wx.scanCode({
       onlyFromCamera: false,
       success:(res)=>
       {
           let eqid = res.result.toUpperCase()
           this.data.eqid=eqid
           this.verifyeqidsyn( eqid,this.navigateToDailyCheck,this.rejecteqid)

       },
       fail:(err)=>
       {

       }
     })

  }

})