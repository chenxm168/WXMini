// miniprogram/pages/asd/material/materailSelect.js
const app = getApp()
const util = require("../utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialtypelist:[],
    materialtype:'',
    materialtypeselectshow:true,
    scanshow:false,
    materialnamelist:[]

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

    let userinfo=app.globalData.userinfo.oic
    let that=this.data
    that.materialtypelist.length=0
    util.sendQueryMsg({
       env:userinfo.env,
       userid:userinfo.userid,
       queryid:'getMaterialType',
       map:{EVENTUSER:userinfo.userid,FACTORYNAME:userinfo.factory},
       success:(res)=>
       {
          that.materialtypelist.length=0
          console.log('getMaterialType res',res)
          let rtn=res.result.Message.Return
          if(rtn.RETURNCODE=='0')
          {
             let datalist=res.result.Message.Body.DATALIST
             let list = (datalist.DATA == undefined && datalist.length > 1) ? datalist : [{ 'DATA': datalist.DATA }]
                console.log('request EDDownType DATALIST:', datalist)

                list.forEach(element => {
                  that.materialtypelist.push({ TYPE:element.DATA.ENUMVALUE,DESCRIPTION:element.DATA.DESCRIPTION })

                });
                console.log('materialtypelist:',this.data.materialtypelist)
                if(that.materialtypelist.length>0)
                {
                  that.materialtype=that.materialtypelist[0].TYPE
                }
              this.setData({
                materialtypelist:that.materialtypelist
              })
          }else
          {

          }
       },
       fail:(err)=>
       {

       }

    })

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
  selectChange:function(arg)
  {
    console.log('selectChange:',arg)
    this.data.materialtype=arg.detail.value
    
  },//end function
  selectOK(arg)
  {
     console.log('select materialtype:',this.data.materialtype)
     this.data.materialtypeselectshow=false
     this.data.scanshow=true
     this.setData({
       materialtypeselectshow:false,
       scanshow:true,
       materialtype:this.data.materialtype
     })
  },//end funvtion

  scanClick(res)
  {
    let mts=this.data.materialnamelist
    wx.scanCode({
      onlyFromCamera: true,
      success:(res)=>
      {
         console.log('scan result:',res)
         let code=res.result
         /*
         if(code.indexOf("operation=materail"))
         {
           wx.navigateTo({
             url: 'materialOperation?'+code,
           })
         } */

         if(mts.indexOf(code)<0)
         {
           mts.push(code)
           this.setData({
             materialnamelist:mts
           })
           wx.showToast({
             title: '扫码成功！',
             duration:800,
           })
         }else
         {
          wx.showToast({
            title: '重复扫码',
            duration:1000,
            icon:'warn',
          })
         }
      },
      fail:(err)=>
      {
           
      }
    })
    
  },//end function
  endScan(arg)
  {
    let mts=this.data.materialnamelist
    if(mts.length>0)
    {
      let mtstr='?materialtype='+this.data.materialtype+'&materiallist='
      for(let i=0;i<mts.length;i++)
      {
        if(i==mts.length-1)
        {
          mtstr+=mts[i]
        }else
        {
          mtstr=mtstr+mts[i]+';'
        }
      }
      console.log('material list string:',mtstr)
      wx.navigateTo({
        url: 'material'+mtstr,
      })
    }
  

  },//end function
  cleanClick(arg)
  {
    this.data.materialnamelist.length=0
    this.setData(
      {
        materialnamelist:this.data.materialnamelist
      }
    )

  },//end function
})