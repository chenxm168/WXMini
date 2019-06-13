// miniprogram/pages/user/userManager.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    userList:null,
    waitForAuthCnt:0,
    

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
    var user = app.globalData.appUserInfo;
    if(user==null||!user.appadmin||!user.deptmanager)
    {
      wx.navigateBack({
        
      })
    }else
    {
      if(user.appadmin)
      {
        if (this.data.userList == null || this.data.userList.length < 1) {
          app.getAllUser(
            (res) => {
              console.log(res)
              if (res.result.data != null) {
                this.data.userList = res.result.data
              }
            },
            (err) => {
              app.navigateToMessage("程序出错了", err, "warn")
            }
          )
        }

      }else
      {

      }
     /*
      if(this.data.userList!=null&&this.data.userList>0)
      {
        for(let i=0;i<this.data.userList.length;i++)
        {
          if(!this.data.userList[i].auth)
          {
            waitForAuthCnt++
          }
        }
      }*/
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



  /**
   *  用户点击待审核用户
   */

  onWaitForAuthList:function()
  {
    console.log("click onWaitForAuthList")

    wx.cloud.callFunction(
      {
        name:'getDeilyCheckTest',
        data:{},
        success:(res)=>
        {
          console.log(res)
        },
        fail:(err)=>
        {
          console.log(err)
        }
      }
    )

  },//end onWaitForAuthList


    /**
   *  用户点击黑名单用户
   */

  onBlackList: function () {

    console.log("click onBlackList")

  },//end onBlackList

  getUserBydept:function(fab,dept,resolve,reject)
  {

  },

})