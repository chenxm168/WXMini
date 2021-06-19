// pages/components/eqselect.js
const util = require("../asd/utils.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    eqgroup: Boolean,
    machineselectshow: Boolean,
    equnitselectshow: Boolean,
    eqlevelselectshow: Boolean,
    userinfo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    userinfo: null,
    machinegroupidx: null,
    machineidx: null,
    unitidx: null,
    machinegroup: [],
    machines: [],
    level: [{ ID: "ALL", DESCRIPTION: "ALL" }, { ID: "L1", DESCRIPTION: "一楼" }, { ID: "L2", DESCRIPTION: "二楼" }],
    levelidx: 0,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    observers:
    {
      'userinfo': function (userinfo) {
        this.data.userinfo = userinfo
      }
    },



    manualChange: function (arg) {
      console.log('components:', this.data.userinfo)
      this.getBaseInfo({
        env: this.data.userinfo.env,
        userid: this.data.userinfo.userid,
        success: (res) => {
          let body = res.result.Message.Body
          for (let j = 0; j < body.MACHINEGROUP.DATALIST.length; j++) {
            let data3 = body.MACHINEGROUP.DATALIST[j].DATA
            if (data3.MACHINEGROUPNAME.search("CIM") > 0) {
              continue
            }
            data3.DESCRIPTION = data3.MACHINEGROUPNAME + ' |  ' + data3.DESCRIPTION
            if (body.MACHINEGROUP.DATALIST[j].DATA.FACTORYNAME == this.data.userinfo.factory) {
              this.data.machinegroup.push(body.MACHINEGROUP.DATALIST[j].DATA);
            }

          }
          console.log("machinegroup")
          console.log(this.data.machinegroup)
          this.setData(
            {
              machinegroup: this.data.machinegroup
            }
          )
          console.log(res)
        },
        fail: (res) => {

        }
      })
    },
    eqgroupChange: function (res) {
      this.data.machinegroupidx = res.detail.value
      this.data.machines.length = 0
      this.data.machineidx = null
      this.setData(
        {
          machineidx: null,
          machinegroupidx: this.data.machinegroupidx
        }
      )
        util.getPMSMachineListByGroup(
          {
            env: this.data.userinfo.env,
            userid: this.data.userinfo.userid,
            machinegroupname: this.data.machinegroup[this.data.machinegroupidx].MACHINEGROUPNAME,
            success: (res) => {
              this.data.machines = res
              this.setData(
                {
                  machineidx: null,
                  machines: this.data.machines

                }
              )
            },
            fail: (err) => {
              wx.showModal(
                {
                  showCancel: false,
                  title: '请求数据失败',
                  content: '由于网络故障或后台服务器原因，数据请求失败，请与管理员联系'
                }
              )
            }

          }
        )


      
    },//end function

    eqChange: function (res) {
      this.data.machineidx = res.detail.value
      this.unitidx = null
      this.setData(
        {
          machines: this.data.machines,
          machineidx: this.data.machineidx,
          unitidx: null
        }
      )
    },//end function

    unitChange: function (res) {
      this.data.unitidx = res.detail.value
      this.setData(
        {
          unitidx: this.data.unitidx
        }
      )
    }, //end function

    scanClick:function(arg)
    {
      wx.scanCode({
        onlyFromCamera: true,
        success:(res)=>
        {
           console.log('scan resule:',res)
           let code = res.result
           let rs=this.verifyMachineScanCode(code)
          if(rs.result)
          {
              console.log('codeVerifyResult:',rs)
              this.triggerEvent('selectok',{'machinename':rs.machinename,'level':rs.level,machinegroup:null},{})
          }else
          {
            codeVerifyFail(code)
          }

        },
        fail:(err)=>
        {
              
        }
      })
      
      function codeVerifyFail(code)
      {
        wx.showModal({
          cancelColor: 'cancelColor',
          showCancel:false,
          title:'无效二维码',
          content:'扫描的二维码无设备信息，请确认后继续！'+code
        })
      }


    },//end function
    verifyMachineScanCode:function (code)
    {
      if(code==undefined||code==null||code.length<1||code.search("machinename")<0)
      {
        return {result:false}
      }else
      {
      
        let codeinfo= code.split("&")
        switch(codeinfo.length)
        {
          case 1:
            {
             let mn = (codeinfo[0].split("=").length<2 )?codeinfo[0].split("=")[0]:codeinfo[0].split("=")[1]
             return {result:true,machinename:mn,level:0}
              
            }
          case 2:
            {
              let mn = (codeinfo[0].split("=").length<2 )?codeinfo[0].split("=")[0]:codeinfo[0].split("=")[1]
              let level= (codeinfo[1].split("=").length<2 )?codeinfo[1].split("=")[0]:codeinfo[1].split("=")[1]
              return {result:true,machinename:mn,level:level}
            }
            default:
              {
                return {result:false}
              }
        }

         
      }
       
    },//end function
    goClick:function(arg)
    {
       let that=this.data
       if(that.machineidx==null)
       {
        wx.showToast({
          title: '请先选择设备',
          duration:3000,
          icon:'none'
        })

       }else
       {
         let machinename= that.unitidx==null? that.machines[that.machineidx].MACHINENAME:that.machines[that.machineidx].UNIT[that.unitidx].MACHINENAME
          console.log('selectmachinename:',machinename)
          let level= that.level[that.levelidx].ID
          console.log('select level:',level)
          this.triggerEvent('selectok',{'machinename':machinename,'level':level,machinegroup:that.machinegroup[that.machinegroupidx].MACHINEGROUPNAME},{})
       }

    }, //end function

    levelChange: function (res) {
      this.data.levelidx = res.detail.value
      console.log(this.data.levelidx)
      this.setData(
        {
          levelidx: this.data.levelidx
        }
      )
    }, //end function

    getBaseInfo(arg) {
      let success = arg.success
      let fail = arg.fail
      let env = arg.env
      let userid = arg.userid
      // let env='test'
      // let userid="cxm"
      let service = "asdplantaskbaseinfosrv"
      util.sendQueryMsg(
        {
          env: env,
          service: service,
          userid: userid,
          map: { EVENTUSER: userid },
          success: (res) => {
            if (success != undefined && success != null) {
              success(res)
            }
            // console.log(res)
          },
          fail: (err) => {
            if (fail != undefined && fail != null) {
              success(err)
            }
            // console.log(err)
          }
        }
      )

    },//end function



  },
  

})
