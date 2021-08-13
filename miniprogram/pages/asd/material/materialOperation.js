// pages/asd/material/materialOperation.js
const app = getApp()
const util = require("../utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    machinename:null,
    position:null,
    materialtype:null,
    mountoperation:false,
    scanshow:true,
    rawdatalist:[],
    datalist:[],
    headers:null,
    setting:null,
    attachcolor:null,
    currentdata:null,
    productspeclist:[],
    productspecname:'请选择型号',
    prodspecselectidx:null,
    materialbomlist:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
       let that = this.data
       that.machinename=options.machinename
       that.position= options.position
       that.materialtype=options.materialtype
       wx.showModal({
         cancelColor: 'cancelColor',
         title:'上料或下料',
         content:'请先选择上料操作或下料操作',
         cancelText:'下料',
         confirmText:'上料',
         success:(res)=>
         {
           if(res.confirm)
           {
             that.mountoperation=true
             this.getProductspecList('P')
           }
           else
           {
             this.unmountoperationinit()
           }
           
         }
       })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: (result) => {
        console.log('SystemInfo:', result)
        this.setData(
          {
            wHeight: result.windowHeight,
            maskheight:result.windowHeight*0.5,
            width:result.windowWidth 
          }
        )
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.userinfo.oic.env == 'test') {
      // this.data.locationod = true
 
       wx.setNavigationBarColor({
         backgroundColor: app.globalData.testnavbackcolor,
         frontColor: app.globalData.testnavbarfontcolor,
         success(res) {
           console.log(res)
         },
         fail: (err) => {
           console.log(err)
         }
       })
     }
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

  getMountMaterialList(arg)
  {
    let userinfo=app.globalData.userinfo.oic
    let env= userinfo.env
    let userid=userinfo.userid
    let that=this.data
    let condition= that.position.length>0?" AND UNITNAME='"+that.position+"'":"";
    let map={'MACHINENAME':that.machinename,FACTORYNAME:userinfo.factory,EVENTUSER:userid,CONDITION:condition,PAGE_NAME: 'materialunmount', TABLE_NAME: 'materiallist', TABLE_SETTING: 'Y', HEADER_SETTING: 'Y'}
    util.sendQueryMsg({
        env:env,
        userid:userid,
        
        queryid:"GetMaterialListForUnmount",
        map:map,
        service:'asdcommonquerysrv',
        success:(res)=>
        {
            console.log("GetMaterialListForUnmount:",res)
            let msg= res.result.Message
            let rtn= msg.Return
            let rtncode=rtn.RETURNCODE
            if(rtncode=='0')
            {
              let mls =msg.Body.materiallist
               let setting =mls.setting
               let headers=mls.headers

               let list =null
                if(mls.DATALIST.DATA==undefined&& mls.DATALIST.length==0)
                {
                  wx.showToast({
                    title: '此设备未装载物料',
                    icon:'error',
                    duration:3000
                  })
                  return
                }
               list= (mls.DATALIST.DATA==undefined||mls.DATALIST.DATA==null)&&mls.DATALIST.length>0?mls.DATALIST:[{DATA:mls.DATALIST.DATA}]
               console.log('return datalist:',list)
               
               this.data.rawdatalist=list
               let that=this.data
               that.headers=headers
               that.setting=setting
               that.attachcolor={ rowothercolors: setting.rowothercolors }
               this.setData({
                tabledata: {datalist:that.datalist, headers: headers,attachcolor: { rowothercolors: setting.rowothercolors } },
                setting:setting
                
                 
               })
            }
        },
        fail:(err)=>{
          wx.showModal({
            cancelColor: 'cancelColor',
            showCancel:fail,
            title:'数据请求失败',
            content:'请求已装载的物料列表失败:'+err
          })
        }
    })

  },//end function
  scanClick(res)
  {
     wx.scanCode({
       onlyFromCamera: true,
       success:(res)=>
       {
         let code= res.result
         if(this.checkduplication(code))
         {
           wx.showToast({
             title: '物料重复',
             duration:1000,
             icon:'error'
           })
           return
         }

        this.addScanCode(code)
       }
     })
  },//end function

  addScanCode(code)
  {
     let that= this.data
     let found=false
     for(let i=0;i<that.rawdatalist.length;i++)
     {
       if(that.rawdatalist[i].DATA.MATERIALNAME==code)
       {
         that.currentdata=that.rawdatalist[i]
         this.setData({
           maskshow:true,
           materialname:code
         })
         // this.freshTableData();
         found=true
         break;
       }
       
     }
     if(!found)
     {
       wx.showModal({
         cancelColor: 'cancelColor',
         showCancel:false,
         title:"物料未装载",
         content:"物料["+code+"]未装载此设备或无法找到此物料信息！"
       })
     }
  },//end function

  freshTableData()
  {
    let that=this.data
    this.setData({
      tabledata: {datalist:that.datalist, headers: that.headers,attachcolor: that.attachcolor },
      setting:that.setting,
      maskshow:false,
      
       
     })
  },//end function
  
  remainqtysubmit(arg)
  {
     console.log(arg)
     let v= arg.detail.value
     let qty= (v.remain==undefined||v.remain.length<1)?"0":v.remain
     let data=this.data.currentdata
     data.DATA["REMAINQTY"]=qty
     this.data.datalist.push(data)
     this.freshTableData()
  },//end function

  cleanClick(arg)
  {
    this.data.datalist.length=0
    this.freshTableData()
  },//end function

  endScan(arg)
  {
     if(this.data.mountoperation)
     {

     }else
     {
        this.unmountoperation(null)
     }
  },//end function

  checkduplication(materialname)
  {
    let that=this.data
   if( that.datalist.length<1)
   {
     return false
   }
   for(let i=0;i<that.datalist.length;i++)
   {
      if(that.datalist[i].DATA.MATERIALNAME==materialname)
      {
        return true;
      }
   }
   return false;
  },// end function

  unmountoperation(arg)
  {
    let that = this.data
    let datalist=this.data.datalist
    let userinfo=app.globalData.userinfo.oic
    let userid=userinfo.userid
    let env=userinfo.env
    
    let unmountlist=[]
    datalist.forEach(el => {
      let unmount={UNMOUNT:{MATERIALNAME:el.DATA.MATERIALNAME,MATERIALTYPE:that.machinename,REMAINQUANTITY:el.DATA.REMAINQTY,RESOURCETYPE:el.DATA.RESOURCETYPE}}
      unmountlist.push(unmount)
    });
    let body={UNMOUNTLIST:unmountlist}
    util.sendEventMsg({
      env:env,
      userid:userid,
      messagename:'MountUnMountMaterial',
      body:body,
      success:(res)=>
      {
        console.log('Send MountUnMountMaterial Return:',res)
        let rtn=res.result.Message.Return
        if(rtn.RETURNCODE=='0')
        {
          wx.showToast({
            title: '物料卸载成功',
            icon:'success',
            duration:1000
          })
          datalist.length=0
          this.freshTableData()
        }else
        {
          wx.showModal({
            cancelColor: 'cancelColor',
            showCancel:fail,
            title:'卸载失败',
            confirmText:rtn.RETURNMESSAGE
          })
        }
      },
      fail:(err)=>
      {
        console.log('Send MountUnMountMaterial fail:',err)
        wx.showModal({
          cancelColor: 'cancelColor',
          showCancel:fail,
          title:'数据提交失败',
          confirmText:err
        })
      }
    })
  },//end function
  unmountoperationinit()
  {
    let that=this.data
    this.setData({
      materialtype:that.materialtype,
      mountoperation:that.mountoperation,
      machinename:that.machinename,
      position:that.position
    })
    if(!that.mountoperation)
    {
     this.getMountMaterialList(null)
    }
  },//end function


  getProductspecList(prodtype)
  {
    let userinfo=app.globalData.userinfo.oic
    let userid= userinfo.userid
    let env=userinfo.env
    util.sendQueryMsg({
      env:env,
      userid:userid,
      queryid:'GetProductSpecListForMaterialMount',
      map:{PRODUCTIONTYPE:prodtype,FACTORYNAME:userinfo.factory,EVENTUSER:userid},
      success:(res)=>
      {
           console.log("GetProductSpecListForMaterialMount:",res)
           let datalist=res.result.Message.Body.DATALIST
           let list=[]
           if(datalist.DATA==undefined&&datalist.length<1)
           {
             
           }
           list=datalist.DATA==undefined&&datalist.length>0?datalist:[{DATA:datalist.DATA}]
           let that=this.data
           that.productspeclist.length=0
           list.forEach(el => {
             that.productspeclist.push({NAME:el.DATA.PRODUCTSPECNAME,DESC:el.DATA.PRODUCTSPECNAME+"-"+el.DATA.DESCRIPTION})
           });
           this.setData({
            productspeclist:that.productspeclist,
            mountoperation:true
           })
      },
      fail:(err)=>
      {

      }
    })
  },//end function
  productspecChange(arg)
  {
      console.log("productspecChange:",arg)
      let that= this.data
      that.prodspecselectidx=arg.detail.value
      that.productspecname=that.productspeclist[that.prodspecselectidx].NAME
      this.setData({
        productspecname:that.productspecname
      })
      this.getMaterialBom(that.productspecname)
  },//end function

  getMaterialBom(prodspecname)
  {
    let userinfo=app.globalData.userinfo.oic
    let userid= userinfo.userid
    let env=userinfo.env
    util.sendQueryMsg({
      env:env,
      userid:userid,
      queryid:'GetMaterialBomList',
      map:{PRODUCTSPECNAME:prodspecname,FACTORYNAME:userinfo.factory,EVENTUSER:userid},
      success:(res)=>
      {
          console.log("GetMaterialBomList:",res)
          let datalist= res.result.Message.Body.DATALIST
          if(datalist.DATA==undefined&&datalist.length<1)
          {
            wx.showToast({
              title: 'BOM表无数据',
              icon:'error',
              duration:3000
            })
            return
          }
          let that =this.data
          let list =datalist.DATA==undefined&&datalist.length>0?datalist:[{DATA:datalist.DATA}]
          let list2=[]
          list.forEach(el => {
             if(el.DATA.MATERIALTYPE==that.materialtype)
             {
               list2.push(el.DATA)
             }
          });
         that.materialbomlist=list2
         if(list2.length<1)
         {
          wx.showToast({
            title: 'BOM表无数据',
            icon:'error',
            duration:3000
          })
          return
         }else
         {
           
         }
          console.log(that.materialtype+"bom:",list2)
      },
      fail:(err)=>
      {

        //TODO
      }
    })
  },//end function
})