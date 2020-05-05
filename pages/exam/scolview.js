// pages/exam/scolview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView:0,
    scrollTop:0 ,
    scrollitems:[{id:"item1",text:"A"},
      { id: "item2", text: "B" },
      { id: "item3", text: "C" },
      { id: "item4", text: "C" },
      { id: "item5", text: "E" },
      { id: "item6", text: "F" },
      { id: "item7", text: "G" },
      { id: "item8", text: "H" },
      { id: "item9", text: "I" },
      { id: "item10", text: "J" },
      { id: "item11", text: "K" },],

      scrollheigh:200,

    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.getSystemInfo({
        success:(res)=>
        {
         this.data.scrollheigh=res.screenHeight;
         
        }
      })
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
   

  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },


  /**
   * 
   * 
   */
  scroll:function(res)
  {
    console.log(res);
  },
  
  click:function()
  {
    wx.getSystemInfo({
      success: function(res) {
       
        console.log(res);

      },
    })


    this.setData(
      {
        toView:"item8"
      }
    )

  }

})