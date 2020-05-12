// pages/canguna/diancai.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    pageHeight:500,
    pageWidth:"100%",
   
    headerHeight:100,
    footHeight:50,
    

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
   
    
    pageBodyHeight: 300,
    pageBodyWidth: "100%",
    zhongleiHeight: "inherit",
    zhongleiWidth: "20%",
    caidangHeight: "inherit",
    caidangWidth: "80%",

    zhongleiCellHeight:"50px",

    diancaishu:9,


    dishescategorylist: [{ id: "rexiao", desc: "热销", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/rexiao2.svg", ischoose: true },
      { id: "youhui", desc: "优惠", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/youhui.svg", ischoose: false },
      { id: "kaorou", desc: "烤肉类", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/kaorou.svg", ischoose: false },
      { id: "haixian", desc: "海鲜类", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/haixian.svg", ischoose: false },

      { id: "shucai", desc: "蔬菜类", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/shucai.svg", ischoose: false },
      { id: "sucui", desc: "酥脆系列", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/shucui.svg", ischoose: false },
      { id: "wanghong", desc: "网红美食", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/wanghong.svg", ischoose: false },
      { id: "xizhi", desc: "锡纸类", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/xizhi.svg", ischoose: false },
      { id: "shaguozhou", desc: "砂锅粥", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/shaguo.svg", ischoose: false },
      { id: "kaoyu", desc: "烤鱼类", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/kaoyu.svg", ischoose: false },
      { id: "liangcai", desc: "凉菜小吃", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/liangcai.svg", ischoose: false },
      { id: "zhushi", desc: "主食", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/zhushi.svg", ischoose: false },
      { id: "jiushui", desc: "酒水类", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/jiushui.svg", ischoose: false },
      { id: "taocan", desc: "套餐", image: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/qysk/zhonglei/taocan.svg", ischoose: false },
    ],

    trolleyParam:
    {
      shoppingTrolleyBoxClass: "shopping-trolley-box",
      trolleyBoxHeight: "50px",
      trolleyBoxWidth: "auto",

      shoppingSaleOffInfoCellClass: "shopping-saleoff-info-cell",
      saleOffCellHeight: "40rpx",
      saleOffCellWidth: "auto",

      shoppingSaleOffTextClass: "shopping-saleoff-text",
      shoppingSaleOffTextHeight: "auto",
      shoppingSaleOffTextWidth: "auto",

      troleyCellsClass: "trolley-cells",
      troleyCellstHeight: "auto",
      troleyCellsWidth: "auto",

      trolleyInfoCellClass: "trolley-info-cell",
      trolleyInfoCellHeight: "auto",
      trolleyInfoCellWidth: "70%",

      trolleyIconClass: "trolley-icon",
      trolleyIconHeight: "50rpx",
      trolleyIconWidth: "50rpx",

      orderCountIconClass: "order-count-icon",
      orderCountIconHeight: "18px",
      orderCountIconWidth: "18px",

      totalPriceClass: "total-price",
      totalPriceHeight: "auto",
      totalPriceWidth: "auto",

      toOrderClass: "to-order",
      toOrderHeight: "100%",
      toOrderWidth: "30%",

      toOrderTextClass: "to-order-text",

    },

    totalPrice: 39.0,
    toOderText: "选好了>",
    toOrderEvent: "toOrderClick",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    try {

      //获取手机象素
      const res = wx.getSystemInfoSync()
      
      this.data.pageHeight=res.windowHeight+"px";
      if(this.data.diancaishu<1)
      {
        
        this.data.pageBodyHeight = (res.windowHeight - this.data.headerHeight) + "px";
        console.log(this.data.pageBodyHeight);
      }else
      {
        this.data.pageBodyHeight = (res.windowHeight - this.data.headerHeight-this.data.footHeight) + "px";
      }
       
       this.data.autoPlayParam.autoPlayBoxHeight=this.data.headerHeight+"px";
       this.data.trolleyParam.troleyCellstHeight=this.data.footHeight+"px";
     
      this.setData({ pageHeight: this.data.pageHeight, pageWidth: this.data.pageWidth, autoPlayParam: this.data.autoPlayParam, pageBodyHeight: this.data.pageBodyHeight, pageBodyWidth: this.data.pageBodyWidth, zhongleiHeight: this.data.pageBodyHeight, caidangHeight: this.data.pageBodyHeight, zhongleiWidth: this.data.zhongleiWidth, trolleyParam:this.data.trolleyParam});

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

  },

  /**
 * 点击菜品种类
 */
  dishescategoryclick: function (res) {
    for (let i = 0; i < this.data.dishescategorylist.length; i++) {
      if (this.data.dishescategorylist[i].id == res.currentTarget.id) {
        this.data.dishescategorylist[i].ischoose = true;
      } else {
        this.data.dishescategorylist[i].ischoose = false;
      }
    }//end for


    this.setData({ dishescategorylist: this.data.dishescategorylist });

    console.log(res);
    // console.log(this.data.dishescategorylist);
  },

  swiperClick:function(res)
  {
    console.log(res);
  }
})