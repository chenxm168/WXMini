// miniprogram/pages/msg/messsage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    message: '',
    iconType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.title != undefined && options.title != null) {
      this.data.title = options.title
    }
    if (options.message != undefined && options.message != null) {
      this.data.message = options.message
    }
    if (options.iconType != undefined && options.iconType != null) {
      this.data.iconType = options.iconType
    }

    this.setData(
      {
        title: this.data.title,
        message: this.data.message,
        iconType: this.data.iconType
      }
    )
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

  }
})