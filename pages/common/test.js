// pages/common/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    param: {
      dishesBoxHeight: "220rpx",
      dishesBoxWidth: "100%",
      dishesBoxClass: "dishes-box",
      dishesImageClass: "dishes-image",
      dishesImageHeight: "auto",
      dishesImageWidth: "40%",
      dishesImageMode: "scaleToFill",
      dishesDetailCellsClass: "dishes-detail-cells",
      dishesDetailCellsHeight: "auto",
      dishesDetailCellsWidth: "60%",

      dishesTitleClass: "dishes-title",

      dishesDescClass: "dishes-desc",

      dishesSaleClass: "dishes-sale",
      
      dishesPriceCellClass:"dishes-price-cell",

      dishesPriceClass:"dishes-price-text",

      dishesOldPriceClass:"dishes-old-price-text",

      dishesAddBtnCellClass:"dishes-add-btn-cell",

      dishesAddBtnClass:"dishes-add-btn"
      
    },

    datas:
    {
      dishesBoxId: "",
      dishesImageSrc: ""

    },

    boxdatas:
    {
      styles: {
        boxheight: "120rpx",
        boxwidth: "100%"
      },
      events: {
        clickevent: "caipingclick"

      },


    }, //end boxdatas

     

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
  caipingclick:function(res)
  {
    console.log(res)
  }
})