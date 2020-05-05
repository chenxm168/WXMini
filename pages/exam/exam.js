// miniprogram/pages/exam/exam.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

     ts:60,
     ms:1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

    },1000)

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

  onInterval:function()
  {
    console.log(ts);
  },
  onAddImage:function()
  {
    wx.chooseImage({
      success: function(res) {
        console.log(res.tempFilePaths[0]);
        
        wx.cloud.uploadFile({

          cloudPath: 'my-photo.png',
          filePath:res.tempFilePaths[0],
          success:function(res)
          {
             wx.showToast({
               title: 'Success!',
               icon: 'success'
             })
          },


        })
         


      },
    })
    console.log("ddd");
  }

})