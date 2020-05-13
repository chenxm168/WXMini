// pages/common/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    param: {
      dishesBoxHeight: "160rpx",
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

    trolleyParam:
    {
      shoppingTrolleyBoxClass:"shopping-trolley-box",
      trolleyBoxHeight:"100rpx",
      trolleyBoxWidth:"auto",
      
      shoppingSaleOffInfoCellClass:"shopping-saleoff-info-cell",
      saleOffCellHeight:"40rpx",
      saleOffCellWidth:"auto",
      
      shoppingSaleOffTextClass:"shopping-saleoff-text",
      shoppingSaleOffTextHeight:"auto",
      shoppingSaleOffTextWidth:"auto",

      troleyCellsClass:"trolley-cells",
      troleyCellstHeight:"auto",
      troleyCellsWidth:"auto",

      trolleyInfoCellClass:"trolley-info-cell",
      trolleyInfoCellHeight:"auto",
      trolleyInfoCellWidth:"70%",

      trolleyIconClass:"trolley-icon",
      trolleyIconHeight:"50rpx",
      trolleyIconWidth:"50rpx",

      orderCountIconClass:"order-count-icon",
      orderCountIconHeight:"34rpx",
      orderCountIconWidth:"34rpx",

      totalPriceClass:"total-price",
      totalPriceHeight:"auto",
      totalPriceWidth:"auto",
         
      toOrderClass:"to-order",
      toOrderHeight:"100%",
      toOrderWidth:"30%",    
      
      toOrderTextClass:"to-order-text",

    },
    
    totalPrice:39.0,
    toOderText:"选好了>",
    toOrderEvent:"toOrderClick",



    autoPlayParam:
    {
      autoPlayBoxClass:"auto-play-box",
      autoPlayBoxHeight:"90px",
      autoPlayBoxWidth:"100%",

      swiperPlayClass:"swiper-play",
      autoPalyIndicatorDots:true,
      isAutoplay:true,
      autoPlayInterval:5000,
      autoPlayDuration:500,
      
      autoPlayImageClass:"auto-play-image",
      autoPlayImageWidth:"100%",
      autoPlayImageHeight:"100%",
      swiperClickEvent:"swiperClick"
    },
     
    autoPlayVisible:true,
    autoplayimages: [{ name: "youhuijuan", src: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/replayimage/001.jpg" },
    { name: "xinchangping", src: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/replayimage/002.jpg" }],



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

     isMask:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var total =39;
    this.data.totalPrice= total.toFixed(1);
    this.setData({totalPrice:this.data.totalPrice});
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
  },
  toOrderClick:function(res)
  {
    console.log(res);
    let total = res.currentTarget.dataset.total;
    console.log(total);
  },

  openMask:function()
  {
    this.data.isMask = !this.data.isMask;
    this.setData({isMask:this.data.isMask});
  },

  closeMask:function()
  {
    this.data.isMask = !this.data.isMask;
    this.setData({ isMask: this.data.isMask });
  }

})