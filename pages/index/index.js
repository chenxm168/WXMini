//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        app.globalData.openid=res.openid
      },
      fail:function()
      {
        let oppenid = wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            app.globalData.openid = res.result.openid;
            wx.setStorage({
              key: 'openid',
              data: res.result.openid,
            })
          },
        }
        )
      }
    })
    // 获取用户oppenid

    
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      console.log(e.detail);
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        console.log(res)
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  clicktest:function()
  {
    /*
    wx.cloud.callFunction(
    {
      name:'getdeptbaseinfo',
      data:{ },
      success:function(res)
      {
        
         const app= getApp();
        app.globalData.deptinfo = res.result.deptinfo.data;
        app.globalData.roleinfo=res.result.roleinfo.data;
        console.log(app.globalData.deptinfo)
        console.log(app.globalData.roleinfo)
        var downLoadate = new Date();
        console.log(downLoadate)
      },
      fail:function(err)
      {
        console.log(err)
      }

    }
    )*/
    wx.redirectTo({
      url: '../userRegist/userRegist',
    })
  },

})
