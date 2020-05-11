// pages/canguna/diancai.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    pageHeight:500,
    pageWidth:"100%",

    autoPlayParam:
    {
      autoPlayBoxClass: "auto-play-box",
      autoPlayBoxHeight: "90px",
      autoPlayBoxWidth: "100%",

      swiperPlayClass: "swiper-play",
      autoPalyIndicatorDots: true,
      isAutoplay: true,
      autoPlayInterval: 5000,
      autoPlayDuration: 500,

      autoPlayImageClass: "auto-play-image",
      autoPlayImageWidth: "100%",
      autoPlayImageHeight: "100%",
      swiperClickEvent: "swiperClick"
    },

    autoPlayVisible: true,
    autoplayimages: [{ name: "youhuijuan", src: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/replayimage/001.jpg" },
    { name: "xinchangping", src: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/replayimage/002.jpg" }],
   
    
      dianCaishu:0,
      pageBodyHeight:"300px",
      pageBodyWidth:"100%",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    try {

      //获取手机象素
      const res = wx.getSystemInfoSync()
      
      this.data.pageHeight=res.windowHeight+"px";
      this.setData({pageHeight:this.data.pageHeight,pageWidth:this.data.pageWidth})

    }
      catch(e)
      {
        
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

  swiperClick:function(res)
  {
    console.log(res);
  }
})