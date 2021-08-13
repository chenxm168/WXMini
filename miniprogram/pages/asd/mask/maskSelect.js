// miniprogram/pages/asd/mask/maskSelect.js
const app = getApp()
const util = require("../utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    masknamelist:[],
    maskinputplaceholder:'请输MASK名称：例CA00215或215',


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
        console.log('SystemInfo:', result)
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

  addmasksubmit(arg)
  {
    let ls=this.data.masknamelist
    console.log('addmasksubmit arg:',arg)
    let nm=arg.detail.value.maskname
    if(nm.length>0)
    {
        
      if(nm.length==7)
      {
        if(ls.indexOf(nm)>=0)
        {
          wx.showToast({
            title: '重复的MASK',
            duration:1000,
            icon:'error'
          })
        }else
        {
          this.data.masknamelist.push(nm)
        }

        
      }else
      {
        let maskname='CA'+nm.padStart(5,'0')
         if(ls.indexOf(maskname)>=0)
         {
          wx.showToast({
            title: '重复的MASK',
            duration:1000,
            icon:'error'
          })

         }else
         {
          this.data.masknamelist.push(maskname)
         }
        
      }
      console.log('masknamelist',this.data.masknamelist)
      this.setData({
        masknamelist:this.data.masknamelist
      })


    }

  },//end function

  cleanClick(arg)
  {
     this.data.masknamelist.length=0
     this.setData(
       {
         masknamelist:this.data.masknamelist
       }
     )
  },//end function
  scanClick(arg)
  {
    wx.scanCode({
      onlyFromCamera: true,
      success:(res)=>{
        console.log('scan res:',res)
        if(res.result.length!=7)
        {
          wx.showToast({
            title: '无效的条码',
            duration:1000,
            icon:'error'
          })
        }else
        {
          let ls=this.data.masknamelist
          if(ls.length>0&&ls.indexOf(res.result>=0))
          {
              wx.showToast({
                title: '重复的MASK',
                duration:1000,
                icon:'error'
              })
          }
          else
          {
            this.data.masknamelist.push(res.result)
            wx.showToast({
              title: '扫码成功',
            })
            this.setData({
              masknamelist:this.data.masknamelist
            })
          }
         
        }

      },
      fail:(err)=>
      {

      }
    })

  },//end function
  endScan(arg)
  {
    let ls=this.data.masknamelist
    if(ls.length>0)
    {
      let str='?masklist='
      for(let i=0;i<ls.length;i++)
      {
        if(i==ls.length-1)
        {
          str+=ls[i]
        }else
        {
          str+=ls[i]+';'
        }
      }
      wx.navigateTo({
        url: 'mask'+str,
      })
    }
    

  },// end function
})