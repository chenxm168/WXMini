// miniprogram/pages/asd/prodlist.js
const app = getApp()
const utils = require("../utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    factory: (app.globalData.userinfo.factory == null || app.globalData.userinfo.factory.length < 1) ? 'ARRAY' : app.globalData.userinfo.factory,
    // factory:'ARRAY',
    productiontype: ['P', 'E', 'T', 'D'],
    type: 'P',
    factories: ['ARRAY', 'CELL', 'CF'],
    orgintext: '点我选择',
    product: '点我选择',
    products: [],
    operationlist: [],
    operation: '点我选择',
    header: [],
    tabledata: null,
    rawdata: [],
    peplist: ['ALL'],
    pep: 'ALL'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getProductList(
      {
        success: (res) => {

        },
        fail: (err) => {

        }
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
    if (app.globalData.userinfo.oic.env == 'test') {
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

  factoryChange: function (res) {
    console.log(res)
    let idx = res.detail.value

    if (this.data.factory != this.data.factories[idx]) {
      this.data.factory = this.data.factories[idx]
      this.data.products = null
      this.data.product = this.data.orgintext
      this.data.operationlist = null
      this.data.operation = this.data.orgintext
      this.getProductList(
        {
          success: (res) => {
            this.setData
              (
                {
                  operation: this.data.operation,
                  product: this.data.product,
                  products: this.data.products,
                  operationlist: this.data.operationlist,
                  factory: this.data.factory,
                  tabledata: null,
                  peplist:['ALL'],
                  pep:'ALL'
                }

              )
          }
        }
      )


    }


  },//end function
  productionTypeChange: function (res) {
    let idx = res.detail.value
    if (this.data.type != this.data.productiontype[idx]) {
      this.data.type = this.data.productiontype[idx]
      this.data.products = null
      this.data.product = this.data.orgintext
      this.data.operationlist = null

      this.data.operation = this.data.orgintext
      this.setData(
        {
          operation: this.data.operation,
          product: this.data.product,
          products: this.data.products,
          operationlist: this.data.operationlist,
          tabledata: null,
          type: this.data.type,
          peplist:['ALL'],
          pep:'ALL'
        }
      )
    }
    this.getProductList(
      {
        success: (res) => {
          this.setData(
            {
              operation: this.data.operation,
              product: this.data.product,
              products: this.data.products,
            }
          )
        }
      }
    )

  },//end function
  opeChange: function (res) {
    console.log(res)
    let idx = res.detail.value
    if (this.data.operation != this.data.operationlist[idx].OPENAME) {
      this.data.operation = this.data.operationlist[idx].OPENAME
      let op=this.data.operation
      if(op=='ALL')
      {
         if(this.data.tabledata.datalist.length!=this.data.rawdata.length)
         {
           this.data.tabledata.datalist=this.data.rawdata
           this.setData(
            {
              operation: this.data.operation,
              tabledata: this.data.tabledata,
              pep:'ALL'
            }
          )
         }
      }else
      {
        this.filterOpe(
          {
            targetope: { valuekey: 'PROCESSOPERATIONNAME', value: this.data.operation },
            rawdata: this.data.rawdata,
            complete: (res2) => {
              console.log("after filter rawdata")
              console.log(res2)
              this.data.tabledata.datalist = res2
              this.setData(
                {
                  operation: this.data.operation,
                  tabledata: this.data.tabledata
                }
              )
            }
          }
        )
      }
     


    }




  },//end function
  pepChange: function (res) {
    let idx = res.detail.value
    console.log('pepChange peplist length:',this.data.peplist.length)
    if (this.data.peplist.length > 0 && this.data.pep != this.data.peplist[idx]) {
      this.data.pep = this.data.peplist[idx]
      let datalist=[]
      console.log('pepChange rawdata:',this.data.rawdata)
      this.data.operation='ALL'
      if(this.data.pep=='ALL')
      {
        if(this.data.rawdata.length!=this.data.tabledata.datalist.length)
        {
          this.data.tabledata.datalist=this.data.rawdata
          this.setData(
            {
              pep: this.data.pep,
              tabledata: this.data.tabledata,
              operation:'ALL'
              
            }
          )
        }
      }else
      {
        this.data.rawdata.forEach(el => {
          //console.log('select pep:',this.data.pep)
          let data = (el.DATA != undefined && el.DATA != null) ? el.DATA : el
          //console.log('foreach data pep:',data.PEP)
          if (data.PEP != undefined && data.PEP != null && data.PEP.length > 0) {
            if (data.PEP == this.data.pep) {
              datalist.push(data)
            } 
          }
          
        });
          
        this.data.tabledata.datalist = datalist
        this.setData(
          {
            pep: this.data.pep,
            tabledata: this.data.tabledata,
            operation:'ALL'
          }
        )
      }
      
     /*
      let datalist = utils.FileerListData(this.data.rawdata, el => {
        console.log('select pep:', this.data.pep)
        let data = (el.DATA != undefined && el.DATA != null) ? el.DATA : el
        if (data.PEP != undefined && el.PEP != null && data.PEP.length > 1) {
          if (data.PEP == this.data.pep) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }) */

    }
  },//end function

  productChange: function (res) {
    console.log(res)
    let data = this.data
    if (data.products != null && data.products.length > 0 && data.product != data.products[res.detail.value]) {
      data.product = data.products[res.detail.value]
    
     
      this.setData(
        {
          product: data.product,
          operationlist:['ALL'],
          operation:'ALL',
          peplist:['ALL'],
          pep:'ALL',
          tabledata:null
        }
      )
      /*
      this.getOperationList(
        {
          success:(res)=>
          {

          },
          fail:(err)=>
          {

          }
        }
      )*/
    }


  },//end function

  queryClick: function (res) {
    console.log(res)
    if (this.data.product != this.data.orgintext) {
      this.getLotList(
        {
          success: (res) => {
            console.log(res)
            this.data.rawdata = res.DATALIST
            this.data.tabledata = { datalist: res.DATALIST, headers: res.headers, attachseq: true, sumrequest: [{ valuekey: 'PRODUCTQUANTITY', value: 0, desc: '基板总数' }],attachcolor:{warning:{valuekey:'LOTHOLDSTATE',op:'eq',value:'OnHold'}} }
            this.setData
              (
                {
                  tabledata: this.data.tabledata,
                  setting: res.setting
                }
              )
            this.MakePepData(this.data.rawdata)

            this.makeOpeData(
              {
                rawdata: res.DATALIST,
                complete: (res3) => {
                  this.data.operationlist = res3
                  console.log(res3)
                  this.setData(
                    {
                      operationlist: res3
                    }
                  )
                }
              }
            )
            /*
            this.makeOpeData(
              {
                rawdata:res.rawdata,
                complete:(res3)=>
                {
                  this.data.operationlist=res3
                  console.log(res3)
                  this.setData(
                    {
                      operationlist:res3
                    }
                  )
                }
              }
            )*/
          },
          fail: (err) => {

          }
        }
      )

    } else {
      wx.showModal({
        cancelColor: 'cancelColor',
        showCancel: false,
        title: "选投生产型号",
        content: "请先选择生产型号"
      })
    }
  },//end function

  getProductList: function (arg) {
    let factory = this.data.factory
    let type = this.data.type
    let userid = app.globalData.userinfo.oic.userid
    let env = app.globalData.userinfo.oic.env
    let success = arg.success
    let fail = arg.fail
    let map = { PRODUCTIONTYPE: type, FACTORYNAME: factory, USERID: userid }
    let queryid = 'GetProductSpecListForProduction'
    app.sendQueryMsg(
      {
        env: env,
        map: map,
        userid: userid,
        queryid: queryid,
        success: (res) => {

          console.log(res)
          let datalist = res.result.Message.Body.DATALIST
          if (datalist.DATA != undefined || datalist.length > 0) {
            utils.DataList2List(
              {
                datalist: datalist,
                valuename: 'PRODUCTSPECNAME',
                complete: (list) => {
                  console.log(list)
                  this.data.products = list
                  this.setData(
                    {
                      products: list
                    }
                  )
                  if (success != undefined && success != null) {
                    success(list)
                  }
                }
              }
            )
          }
        },
        fail(err) {
          console.log(err)
        }
      }
    )
  },//end function

 
  getLotList: function (arg) {
    let factory = this.data.factory
    let type = this.data.type
    let env = app.globalData.userinfo.oic.env
    let userid = app.globalData.userinfo.oic.userid
    let product = this.data.product
    let map = { FACTORYNAME: factory, PRODUCTIONTYPE: type, PRODUCTSPECNAME: product, PAGE_NAME: 'prodlist', TABLE_NAME: 'lotlist', TABLE_SETTING: 'Y', HEADER_SETTING: 'Y' }
    let success = arg.success
    let fail = arg.fail
    app.sendQueryMsg(
      {
        env: env,
        userid: userid,
        map: map,
        queryid: 'GetLotListForWX',
        service: 'asdcommonquerysrv',
        success: (res) => {
          console.log(res)
          let lotlist = res.result.Message.Body.lotlist
          success(lotlist)
          /*
          app.makeTableData(
           {
             datalist:lotlist.DATALIST,
             headers:lotlist.headers,
             tablename:"lotlist",
             success:(res2)=>
             {
               console.log(res2)
               this.data.header=res2.header
               this.data.rawdata=res2.rawdata
               this.setData(
                 {
                   header:res2.header,
                   setting:lotlist.setting,
                   rows:res2.rows
                 }
               )
               if(success!=undefined&&success!=null)
               {
                 success(res2)
               }
             }
           }
         ) */

        },
        fail: (err) => {
          console.log(err)
        }
      }
    )
  },//end function

 

  makeOpeData: function (arg) {
    let complete = arg.complete
    let rawdata = arg.rawdata
    let tempope = []
    let ope = [{OPENAME:'ALL',DISPLAY:'ALL'}]
    for (let i = 0; i < rawdata.length; i++) {
      let data = (rawdata[i].DATA != undefined && rawdata[i].DATA != null) ? rawdata[i].DATA : rawdata[i]
      if (tempope.indexOf(data.PROCESSOPERATIONNAME) >= 0) {
        continue
      } else {
        tempope.push(data.PROCESSOPERATIONNAME)
        ope.push({ OPENAME: data.PROCESSOPERATIONNAME, DESC: data.DESCRIPTION, DISPLAY: data.PROCESSOPERATIONNAME + "-" + data.DESCRIPTION })
      }
    }
    complete(ope)


  },//end function

  MakePepData: function (rawdata) {
    this.data.peplist=['ALL']
    rawdata = (rawdata.DATA!=undefined&& rawdata.DATA!=null)? [rawdata.DATA]:rawdata
    rawdata.forEach(el=>
      {
        let data = (el.DATA != undefined && el.DATA != null) ? el.DATA : el
        if (data.PEP != undefined && data.PEP != null && data.PEP.length > 0&&this.data.peplist.indexOf(data.PEP)<0) {
          this.data.peplist.push(data.PEP)
        }
      })
  
    console.log('peplist', this.data.peplist)
    this.setData({
      peplist: this.data.peplist
    })

  },//end function

  filterOpe: function (arg) {
    let targetope = arg.targetope
    let rawdata = arg.rawdata
    let complete = arg.complete
    let rtn = []
    console.log("Start filter ope")
    for (let i = 0; i < rawdata.length; i++) {
      let data = (rawdata[i].DATA != undefined && rawdata[i].DATA != null) ? rawdata[i].DATA : rawdata[i]

      if (data[targetope.valuekey] == targetope.value) {
        rtn.push(data)
      }

    }
    complete(rtn)

  },//end

  toGroupClick: function (res) {
    let param = '?prodspec=' + this.data.product + '&type=' + this.data.type + '&factory=' + this.data.factory
    wx.navigateTo({
      url: '/chartpages/pages/productioninfo/prodinfo' + param
    })
  },//end

  rowClick:function(res)
  {
    console.log('Row Click',res)
  }



})