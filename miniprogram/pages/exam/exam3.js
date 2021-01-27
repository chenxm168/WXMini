// miniprogram/pages/exam/exam3.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  test1Click:function(res)
  {
    let userid = 'cxm'
    let password = '1'
    let factory = 'ARRAY'
    
    let env = 'test'
    
    let msg = JSON.parse(JSON.stringify(app.globalData.msg))
    msg.data.JsonMessage.Service = "asduserloginsrv"
    msg.data.JsonMessage.Message.MODULE = "oic"
    msg.data.JsonMessage.Message.MESSAGENAME = "UserLogin"
    msg.data.JsonMessage.Userinfo.ENV = 'test'
    let map = { USERID: userid, PASSWORD: password }
    msg.data.JsonMessage.Message.PARAMMAP = map
    wx.request({
      url: 'http://172.28.64.21/trulyasdwx',
      data:msg,
      method:'POST',
      success:(res)=>
      {
        console.log(res)
      },
      fail:(err)=>
      {
        console.log(err)
      }

    })

  },
  uploadClick:function()
  {
    wx.chooseImage({
      count: 6,
      sizeType:'original',
      sourceType:'album',
      success:(res)=>
      {
        console.log(res)
        let files=res.tempFiles
        for(let i=0;i<files.length;i++)
        {
          let file=files[i].path
           let num=file.lastIndexOf('.')
           if(num>=0)
           {
             let suffix= file.substr(num,file.length-num)
             wx.cloud.uploadFile(
              {
                cloudPath:'AsdTempFile/image1.'+suffix,
                filePath:file,
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
           }
        
          /*
          wx.uploadFile({
            filePath: file,
            name: 'file',
            url: 'https://172.28.64.21/fileupload:80',
            success:(res)=>
            {

            },
            fail:(err)=>
            {
               console.log(err)
            }
          }) */
        }

      },fail:(err)=>
      {

      }
    })
  },//end function

  test2Click:function(res)
  {
    this.testPromise(
      {
        num:1
      }
    ).then((res)=>
    {
      console.log(res)
    }).catch((err)=>
    {
      console.log(err)
    })
   

  },

  testPromise:function (arg) {
   let success=arg.success
   let fail=arg.fail
   let num=arg.num
   let result='test promise'
   if(num==0)
   {
     console.log(success)
    if(success!=undefined&&success!=null)
    {
      success(result)
         
    }else
    {
      console.log('return promise resolve')
      return new Promise(function (resolve,reject) {
        resolve('excute')
          
      })
    }
   }else
   {
     if(fail!=undefined&&fail!=null)
     {
       fail(result)
     }else
     {
      console.log('return promise reject')
      return new Promise(function (resolve,reject) {
        reject(result)
          
      })
     }
    
   }
   
    
  },//end function

})