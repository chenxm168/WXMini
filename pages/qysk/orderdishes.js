// pages/qysk/orderdishes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

      pageheight:500,
      bodyheight:400,
      headerheight:120,
      footheight:50,
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 500,
      autoplayimages: [{ name: "youhuijuan", src: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/TestImages/testimage06.jpg" },
    { name: "xinchangping", src: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/TestImages/testimage03.jpg" }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    try {
      const res = wx.getSystemInfoSync()
     
      // this.data.bodyheight=res.windowHeight-this.data.headerheight-this.data.footheight-8;
      // this.setData({bodyheight:this.data.bodyheight});
      this.data.pageheight=res.windowHeight;
      
      this.data.bodyheight=res.windowHeight-this.data.headerheight-this.data.footheight;
      this.setData({ pageheight: this.data.pageheight,bodyheight:this.data.bodyheight,headerheight:this.data.headerheight,footheight:this.data.footheight });
    } catch (e) {
      // Do something when catch error
    }

  

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

    wx.setNavigationBarTitle({
      title: '秦 爷 烧 烤',
    });

    wx.setNavigationBarColor({
      frontColor: '#ffffff',

      backgroundColor: '#e43535',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
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

  }
})