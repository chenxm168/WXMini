// pages/qysk/orderdishes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      
      ordercount:1,
      pageheight:500,
      bodyheight:400,
      headerheight:120,
      footheight:70,
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 500,
     gategoryToView:"",
      autoplayimages: [{ name: "youhuijuan", src: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/TestImages/testimage06.jpg" },
    { name: "xinchangping", src: "cloud://asd-smart-cloud-k2u5e.6173-asd-smart-cloud-k2u5e-1259294007/TestImages/testimage03.jpg" }],

      dishescategorylist:[{id:"dianzhangtuijian",desc:"1店长推荐",image:"",ischoose:true},
        { id: "jinritejia", desc: "2今日特价", image: "", ischoose: false},
        { id: "kaochuang", desc: "3烧串", image: "", ischoose: false},
        { id: "haixian", desc: "4海鲜", image: "", ischoose: false },
        
        { id: "5", desc: "5", image: "", ischoose: false },
        { id: "6", desc: "6", image: "", ischoose: false },
        { id: "7", desc: "7", image: "", ischoose: false },
        { id: "8", desc: "8", image: "", ischoose: false },
        { id: "9", desc: "9", image: "", ischoose: false },
        { id: "10", desc: "10", image: "", ischoose: false },
        { id: "11", desc: "11", image: "", ischoose: false },
        { id: "12", desc: "12", image: "", ischoose: false }, ],

    testlist: [{ id: "1", name: "name1" }, { id: "2", name: "name2"}]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    try {

      //获取手机象素
      const res = wx.getSystemInfoSync()
     
      // this.data.bodyheight=res.windowHeight-this.data.headerheight-this.data.footheight-8;
      // this.setData({bodyheight:this.data.bodyheight});
      this.data.pageheight=res.windowHeight;
      if(this.data.ordercount>0)
      {
        this.data.bodyheight = res.windowHeight - this.data.headerheight - this.data.footheight;
      }else
      {
        this.data.bodyheight = res.windowHeight - this.data.headerheight;
      }
      console.log(this.data.bodyheight);
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

  },
  
  /**
   * 点击选好，跳转订单界面
   */
  toOrder:function()
  {
    console.log("go to order");
  },

  /**
   * 轮播图象点击
   */
  swiperclick:function(res)
  {
    console.log(res);
  },

  /**
   * 点击菜品种类
   */
  dishescategoryclick:function(res)
  {
    for(let i=0;i<this.data.dishescategorylist.length;i++)
    {
      if(this.data.dishescategorylist[i].id==res.currentTarget.id)
      {
        this.data.dishescategorylist[i].ischoose=true;
      }else
      {
        this.data.dishescategorylist[i].ischoose=false;
      }
    }//end for


    this.setData({ dishescategorylist: this.data.dishescategorylist });

    console.log(res);
   // console.log(this.data.dishescategorylist);
  },

  /**
   * 菜品分类上划到顶
   */
  gategoryUpper:function()
  {

  },

  /**
   * 菜品分类下划到顶
   */
  gategoryLower:function()
  {

  },
  gategoryScroll:function(res)
  {
    let h= res.detail.scrollTop;
    let h2 = h/60+1;
    console.log(h2);
    console.log(res);
  }

})