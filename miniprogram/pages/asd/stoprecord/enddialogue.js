// pages/asd/stoprecord/enddialogue.js
const util = require("../utils.js")
Component({

  externalClasses: ['my-../../../style/asd.wxss'],


  /**
   * 组件的属性列表
   */
  properties: {
    isended: Boolean,
    edinfo: Object,
    userinfo: Object,

  },

  /**
   * 组件的初始数据
   */
  data: {
    // isended:null,
    selectdate: null,
    selecttime: null,
    comment: null,
    edtypelist: null,
    edreasonlist: null,
    selectdatetitle: '宕机结束日期',
    selecttimetitle: '宕机结束时间',
    btntext: '结束宕机',
    eddowntypelist: [],
    downreasonlist: [],

  },
  lifetimes: {
    attached: function () {
      let now = new Date()
      let nowdate = now.getFullYear().toString() + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0')
      let nowtime = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0')//+':'+now.getSeconds()
      console.log("now date:", nowdate)
      let that = this.data
      this.data.selectdatetitle = that.isended ? '宕机结束日期' : '宕机开始日期'
      that.selecttimetitle = that.isended ? '宕机结束时间' : '宕机开始时间'
      that.btntext = that.isended ? '结束宕机' : '开始宕机'

      this.setData({
        selectdate: nowdate,
        selecttime: nowtime,
        selectdatetitle: that.selectdatetitle,
        selecttimetitle: that.selecttimetitle,
        btntext: that.btntext


      })
      if (!this.data.isended) {
        util.sendQueryMsg(
          {
            queryid: 'GetEnumDefValueList',
            userid: this.data.userinfo.userid,
            env: this.data.userinfo.env,
            map: { ENUMNAME: 'EDDownType', VERSION: '00019' },
            success: (res) => {
              console.log('request EDDownType success:', res)
              let msg = res.result.Message
              let rtncode = msg.Return.RETURNCODE
              let datalist = msg.Body.DATALIST
              let types = this.data.eddowntypelist
              types.length = 0
              if (rtncode == '0') {

                let list = (datalist.DATA == undefined && datalist.length > 1) ? datalist : [{ 'DATA': datalist.DATA }]
                console.log('request EDDownType DATALIST:', datalist)

                list.forEach(element => {
                  types.push({ TYPE: element.DATA.ENUMVALUE, DESCRIPTION: element.DATA.ENUMVALUE + '--' + element.DATA.DESCRIPTION })

                });

                this.setData({
                  eddowntypelist: types,

                })

                console.log('request EDDownType types:', types)

              }
            },
            fail: (err) => {
              console.log('request EDDownType success:', err)
            }
          }
        )
      }
      console.log('property isended', this.data.isended)
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {

    onLoad: function () {
      console.log('onLoad property isended', this.data.isended)
    },

    dateChange: function (arg) {
      console.log('datechange', arg)
      this.data.selectdate = arg.detail.value

      this.setData(
        {
          selectdate: this.data.selectdate
        }
      )

    },
    timeChange: function (arg) {
      this.data.selecttime = arg.detail.value
      this.setData(
        {
          selecttime: this.data.selecttime
        }
      )
    },//end function

    eddowntypeChange: function (arg) {
      console.log('eddowntypeChange arg:', arg)
      let index = arg.detail.value
      let that = this.data
      let reasons = that.downreasonlist
      reasons.length = 0
      util.sendQueryMsg({
        queryid: 'GetEnumDefValueList',
        userid: this.data.userinfo.userid,
        env: this.data.userinfo.env,
        map: { ENUMNAME: 'EDDownReason%' + this.data.eddowntypelist[index].TYPE, VERSION: '00055' },
        success: (res) => {
          console.log('request EDDownReason' + this.data.eddowntypelist[index].TYPE + ' result:', res)
          let msg = res.result.Message
          let rtncode = msg.Return.RETURNCODE
          let datalist = msg.Body.DATALIST
          if(rtncode=='0')
          {
            let list = (datalist.DATA == undefined && datalist.length > 1) ? datalist : [{ 'DATA': datalist.DATA }]
                console.log('request EDDownType DATALIST:', datalist)

                list.forEach(element => {
                  reasons.push({ REASON: element.DATA.ENUMVALUE,DESC:element.DATA.DESCRIPTION , DESCRIPTION: element.DATA.ENUMVALUE + '--' + element.DATA.DESCRIPTION })

                });

                console.log('downreasons:',reasons)
                this.setData(
                  {
                    edtypeidx: arg.detail.value,
                    downreasonlist:reasons
          
                  }
                )
          }


        },
        fail: (err) => {

        }
      })


    },

    downreasonChange:function(arg)
    {
      this.setData(
        {
          downreasonidx:arg.detail.value
        }
      )
    },//end function

    formSubmit: function (arg) {
      console.log('form submit', arg)
      console.log('userinfo', this.data.userinfo)



      let that = this.data
      let data = arg.detail.value
      let selecttime = (function (date, time) {
        let datetime = date + ' ' + time + ':00'
        let newdate = new Date(datetime)
        return newdate.getFullYear().toString() + (newdate.getMonth() + 1).toString().padStart(2, '0') + newdate.getDate().toString().padStart(2, '0') + newdate.getHours().toString().padStart(2, '0') + newdate.getMinutes().toString().padStart(2, '0') + '00'

      })(data.selectdate, data.selecttime)

      let flexdatetime = that.isended ? ((time) => {
        let newdate = new Date(time)
        return newdate.getFullYear().toString() + (newdate.getMonth() + 1).toString().padStart(2, '0') + newdate.getDate().toString().padStart(2, '0') + newdate.getHours().toString().padStart(2, '0') + newdate.getMinutes().toString().padStart(2, '0') + newdate.getSeconds().toString().padStart(2, '0')
      })(data.edstarttime) : ''


      let map = that.isended ? { EVENTUSER: that.userinfo.userid, EDID: data.edid, EVENTCOMMENT: 'WX:' + data.comment, EDSTARTTIME: flexdatetime, EDENDTIME: selecttime, USERID: that.userinfo.userid } : {EVENTUSER:that.userinfo.userid,EVENTCOMMENT: 'WX:' + data.comment,MACHINENAME:data.machinename,UNITNAME:data.unitname,USERID:that.userinfo.userid,EQDOWNTYPE:that.eddowntypelist[data.edtypeidx].TYPE,EQDOWNREASON:that.downreasonlist[data.edreasonidx].DESC,EDSTARTTIME:selecttime,MACHINEGROUPNAME:that.edinfo.machinegroup}
      console.log('map:', map)

     
      util.sendPmsEventMsg(
        {
          env: that.userinfo.env,
          userid: that.userinfo.userid,
          messagename: that.isended ? 'EndED' : 'StartED',
          map: map,
          success: (res) => {
            console.log('sendPmsEventMsg success:', res)
            let rtn=res.result.Message.Return
            if(rtn.RETURNCODE=='0')
            {
              wx.showModal({
                cancelColor: 'cancelColor',
                title:'数据提uqPMS成功！',
                content:'数据提交PMS成功！',
                showCancel:false,
                success:(res)=>
                {
                  this.triggerEvent('edsuccess',{},{})
                  
                },
                fail:(err)=>
                {

                }
              })

            }else
            {
                wx.showModal({
                  cancelColor: 'cancelColor',
                  showCancel:false,
                  title:'数据提交失败',
                  content:'宕机数据提交PMS失败！CODE:'+rtn.RETURNCODE+';RETURNMESSAGE:'+rtn.RETURNMESSAGE
                })
            }
          },
          fail: (err) => {
            console.log('sendPmsEventMsg fail:', err)
          }


        }
      ) 


    },//end function

    observers:
    {
      'isended': function (isended) {
        console.log('observers', isended)
        let now = new Date()
        let nowdate = now.getFullYear.toString() + '-' + (now.getMonth + 1).toString()
        console.log("now date:", nowdate)
      }
    },

  }
})
