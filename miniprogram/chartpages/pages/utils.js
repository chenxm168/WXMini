module.exports = {
  globalData:{
    requesturls: { 'CIM_WIFI': "http://172.28.30.44/" },
  },
  msg: { data: { JsonMessage: { Url: "", Service: "asdquerysrv", Userinfo: { ENV: "prod", USERID: "", MOBILEMODE: "", SYSTEMMODULE: "", USERGROUP: "", LATITUDE: 0, LONGITUDE: 0, PRIVILEGEKEY: null, OPENID: null }, Message: { MODULE: "qry", MESSAGENAME: "GetQueryResult", QUERYID: "GetInspectionRecordList", VERSION: "", PARAMMAP: {}, PARAMLIST: [], Body: {} } } } },

/* 20210504 */
   sendMsg: function (arg) {
     let msg = arg.msg
     let title = arg.title
     let success = arg.success
     let fail = arg.fail
     
 
 
 
     let wifiFail=(arg)=>
     {
       let success=arg.success
       let fail=arg.fail
       let msg=arg.msg
       wx.cloud.callFunction({
         name: "sendReceive",
         data: msg,
         success: (res) => {
           wx.hideLoading({
             success: (res) => { },
           })
           if (success != undefined && success != null) {
             success(res)
           }
         },
         fail: (err) => {
           wx.hideLoading({
             success: (res) => { },
           })
           if (err != null)
             fail(err)
         }
       })
 
     }
 
     wx.showLoading({
       title: title,
     })
    
     this.getRequestUrl(
       {
         success:(res)=>
       {
         let url=res.url+'trulyasdwx?service='+msg.data.JsonMessage.Service
         console.log("ready local request! url:"+url)
         wx.request({
           url: url,
           data:msg,
           method:'POST',
           success: (res) => {
             console.log(res)
             wx.hideLoading({
               success: (res) => { },
             })
             if (success != undefined && success != null) {
               success({result:res.data})
             }
           },
           fail: (err) => {
             wx.hideLoading({
               success: (res) => { },
             })
             if (err != null)
               fail(err)
           }
           
         })
         
       },
       fail:(err)=>
       {
         wifiFail(
           {
             success:success,
             fail:fail,
             msg:msg
           }
         )
       }
       }
     )
 
 
 
 
 
    
 
   }, /* */  //for test

  /*
  sendMsg: function (arg) {
    let msg = arg.msg
    let title = arg.title
    let success = arg.success
    let fail = arg.fail
    wx.showLoading({
      title: title,
    })
    wx.cloud.callFunction({
      name: "sendReceive",
      data: msg,
      success: (res) => {
        wx.hideLoading({
          success: (res) => { },
        })
        if (success != undefined && success != null) {
          success(res)
        }
      },
      fail: (err) => {
        wx.hideLoading({
          success: (res) => { },
        })
        if (err != null)
          fail(err)
      }
    })

  }, */
  sendQueryMsg: function (arg) {
    let queryid = (arg.queryid != undefined && arg.queryid != null) ? arg.queryid : null
    let env = arg.env
    let map = (arg.map != undefined && arg.map != null) ? arg.map : null
    let userid = arg.userid
    let success = arg.success
    let list = (arg.list != undefined && arg.list != null) ? arg.list : null
    let fail = arg.fail
    let msg = JSON.parse(JSON.stringify(this.msg))
    let service = (arg.service != undefined && arg.service != null) ? arg.service : "asdquerysrv"
    let title = (arg.title != undefined && arg.title != null) ? arg.title : "请求数据中"

    msg.data.JsonMessage.Userinfo.ENV = env
    msg.data.JsonMessage.Userinfo.USERID = userid
    msg.data.JsonMessage.Message.MODULE = "qry"
    msg.data.JsonMessage.Message.PARAMLIST = list
    msg.data.JsonMessage.Message.QUERYID = queryid
    msg.data.JsonMessage.Service = service
    msg.data.JsonMessage.Message.PARAMMAP = map
    this.sendMsg(
      {
        msg: msg,
        title: title,
        success: (res) => {
          if (success != undefined && success != null) {
            success(res)
          } else {
            return new Promise(function (resolve, reject) {
              resolve(res)
            })
          }

        },

        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          } else {
            return new Promise(function (resolve, reject) {
              reject(err)
            })
          }
        }
      }
    )
  },//end function

  GroupBy: function (array, fn) {
    // debugger;
    const groups = {};
    array.forEach(function (item) {
      const group = JSON.stringify(fn(item));
      //这里利用对象的key值唯一性的，创建数组
      groups[group] = groups[group] || [];
      groups[group].push(item);
    });
    // console.log(groups)
    return groups;
    //最后再利用map循环处理分组出来
    /* disable 如果需要去掉分组的key, discomment
    return Object.keys(groups).map(function (group) {
      return groups[group];
    }); */
  },

  MesDATALIST2List: function (dl) {
    let list = []
    console.log('MesDATALIST2List dl:', dl)
    let datalist = (dl.DATA != undefined && dl != null) ? [{ DATA: dl.DATA }] : dl
    console.log('MesDATALIST2List datalist:', datalist)
    datalist.forEach(item => {
      //  console.log(item)
      list.push(item.DATA)
    });
    return list
  },
  SumaryBy: function (grouplist, sumkeys) {
    let groups = []

    //console.log(Object.keys(grouplist))
    Object.keys(grouplist).forEach(key => {
      let gp = grouplist[key]
      let group = { groupname: key }
      gp.forEach(item => {
        sumkeys.forEach(sumkey => {
          Object.keys(item).forEach(colname => {
            if (colname == sumkey) {
              group[sumkey] = groups[sumkey] || 0
              let v = parseFloat(item[colname])
              group[sumkey] += v
            }
          })
        })

      })
      groups.push(group)
    })


    /*
     Object.keys(grouplist).forEach(key=>
      {
        let group={groupneme:key}
        let list= groups[key]
        list.forEach(el2=>
          {
             sumkeys.forEach(sumkey=>
              {
                 Object.keys(el2).forEach(el3=>
                  {
                    if(sumkey==el3)
                    {
                      group[sumkey]=group[sumkey] || 0
                      let v=parseFloat( el2[el3])
                      group[sumkey]+=group[sumkey]

                    }
                  })

              })
            groups.push(group)
          })

          
      }) */

    return groups




  },//end function
  MakeTableData: function (arg) {
    let headers = arg.headers
    let datalist = arg.datalist
    let success = arg.success
    let fail = arg.fail
    let tablename = arg.tablename
    let list = datalist.DATA == undefined ? datalist : [datalist.DATA]
    let rawlist = []
    let rows = []
    let header = []
    let attachseq = arg.attachseq
    let sumrqs = (arg.sumrequest == undefined || arg.sumrequest == null) ? null : arg.sumrequest
    let sumflag = (arg.sumrequest == undefined || arg.sumrequest == null) ? false : true
    let warning = arg.warning
    let attachcolor=arg.attachcolor
    console.log("Start makeTableData")
    console.log(headers)
    console.log(headers.length)

    // console.log(list)
    if (attachseq) {
      header.push({ header: "序号", show: 'Y', headerindex: 'header0' })
    }
    for (let k = 0; k < headers.length; k++) {

      header.push({ header: headers[k].header.name, show: headers[k].header.show, headerindex: k, unique: 'header' + (k + 1) })
    }
    for (let i = 0; i < list.length; i++) {
      let DATA = {}
      let row = []
      if (attachseq) {
        row.push({ name: 'Sequence', value: i + 1, oth1: null, oth2: null, oth3: null, unique: tablename + 'cell-' + i + '-' + 0, index: [i, 0], show: 'Y' })
      }
      for (let k = 0; k < headers.length; k++) {

        let show = headers[k].header.show
        let data = list[i].DATA == undefined ? list[i] : list[i].DATA

        let key = headers[k].header.valuename.length > 0 ? headers[k].header.valuename : headers[k].header.id
        let value = data[key] == undefined ? headers[k].header.defaulvalue : data[key]
        DATA[key] = value
        row.push({ name: key, value: value, oth1: null, oth2: null, oth3: null, unique: tablename + 'cell-' + i + '-' + (k + 1), index: [i, k + 1], show: show, warning: false })
        if (sumflag) {
          for (let j = 0; j < sumrqs.length; j++) {
            if (sumrqs[j].valuekey == key) {
              sumrqs[j].value = sumrqs[j].value + parseFloat(value);
            }
          }
        }

      }
      rawlist.push(DATA)
      // console.log('warning:',warning)
       
      let rw={ row: row, oth1: null, oth2: null, oth3: null, unique: tablename + 'row' + i.toString(), index: i, warningflag: false,firebrickflag:false,slateblueflag:false,purpleflag:false }
      if(attachcolor==undefined||attachcolor==null)
      {
        rows.push(rw)
      }
      else
      {
      let tr = (list[i].DATA != undefined && list[i] != null) ? list[i].DATA : list[i]
       rw.warningflag= (attachcolor==undefined||attachcolor==null||attachcolor.warning==undefined||attachcolor.warning==null)? false: this.CompareTo({target:tr[attachcolor.warning.valuekey],op:attachcolor.warning.op,value:attachcolor.warning.value})
       let tc= attachcolor
       rw.firebrickflag=(tc.firebrick==undefined||tc.firebrick==null)?false:this.CompareTo({target:tr[tc.firebrick.valuekey],op:tc.firebrick.op,value:tc.firebrick.value})

       rw.slateblueflag=(tc.slateblue==undefined||tc.slateblue==null)?false:this.CompareTo({target:tr[tc.slateblue.valuekey],op:tc.slateblue.op,value:tc.slateblue.value})

       rw.purpleflag=(tc.purple==undefined||tc.purple==null)?false:this.CompareTo({target:tr[tc.purple.valuekey],op:tc.purple.op,value:tc.purple.value})
       
       
       rows.push(rw)
      }
      /*
      if (warning != undefined && warning != null) {
        let warningflag = false
        let tr = (list[i].DATA != undefined && list[i] != null) ? list[i].DATA : list[i]
        console.log('rawdata holdstate:', tr[warning.valuekey])
        switch (warning.op) {
          case 'gt':
            {
              break
            }

          default:
            {
              if (tr[warning.valuekey] == warning.value) {
                warningflag = true

              }
              break
            }
        }
        rows.push({ row: row, oth1: null, oth2: null, oth3: null, unique: tablename + 'row' + i.toString(), index: i, warningflag: warningflag })

      } else {
        rows.push({ row: row, oth1: null, oth2: null, oth3: null, unique: tablename + 'row' + i.toString(), index: i, warningflag: false })
      }*/

    }
    console.log(rawlist)
    console.log(rows)
    console.log(header)

    if (success != undefined && success != null) {
      success({ rawdata: rawlist, header: header, rows: rows, sums: sumflag ? sumrqs : null })
    }


  },//end function

  CompareTo: function (arg) {
    let rtn = false
    let target = arg.target
    let op = arg.ope
    let valuekey = arg.valuekey
    let value = arg.value
    let type = arg.type

    if (target == undefined || target == null || value == undefined || value == undefined) {
      return false
    }
    else {

      switch (op) {
        case 'lt':
          {
            let t = (typeof (target) == 'number') ? target : parseFloat(target)
            let v = (typeof (value) == 'number') ? value : parseFloat(value)
            if (t < v) {
              rtn = true
            }
            break
          }
        case 'lte':
          {
            let t = (typeof (target) == 'number') ? target : parseFloat(target)
            let v = (typeof (value) == 'number') ? value : parseFloat(value)
            if (t <= v) {
              rtn = true
            }
            break
          }
        case 'gt':
          {
            let t = (typeof (target) == 'number') ? target : parseFloat(target)
            let v = (typeof (value) == 'number') ? value : parseFloat(value)
            if (t > v) {
              rtn = true
            }
            break
          }
        case 'gte':
          {
            let t = (typeof (target) == 'number') ? target : parseFloat(target)
            let v = (typeof (value) == 'number') ? value : parseFloat(value)
            if (t >= v) {
              rtn = true
            }
            break
          }
        case 'in':
          {
            if (value.length != undefined && value.length != null) {
              if (value.indexOf(target) >= 0) {
                rtn = true
              }
            }
            break
          }
        case 'nin':
          {
            if (value.length != undefined && value.length != null) {
              if (value.indexOf(target) < 0) {
                rtn = true
              }
            }
            break
          }
        case 'neq':
          {
            if (target != value) {
              rtn = true
            }
            break
          }
        //数字区间比较
        case 'innum':
          {
            if (value.length != undefined && value.length != null && value.length >= 2) {
              if (target >= value[0] && target <= value[1]) {
                rtn = true
              }
            }

            break
          }


        default:
          {
            if (target == value) {
              rtn = true
            }
            break
          }
      }//end switch 
    }
    return rtn;

  },//end function

  getRequestUrl: function (arg) {
    let fail = arg.fail
    let success = arg.success
    wx.getNetworkType({
      success: (res) => {
        console.log(res)
        if (res.networkType == 'wifi') {
          wx.startWifi({
            success: (res) => {
              console.log("start get conneted wifi")
              wx.getConnectedWifi({
                success: (res) => {
                  console.log("connected wifi info")
                  console.log(res)
                  let ssid = res.wifi.SSID
                  console.log("ssid:" + ssid)
                  let url = this.globalData.requesturls[ssid]
                  console.log("url:")
                  console.log(url)
                  if (url != undefined && url != null && url.length != undefined && url.length > 0) {
                    if (success != undefined && success != null) {
                      console.log("get url success! url:" + url)
                      success({ ssid: ssid, url: url })
                    }
                  } else {
                    fail(null)
                  }

                },
                fail: fail
              })

            },
            fail: fail
          })

        } else {
          fail(null)
        }
      },
    })

  },//end function
  sendPmsEventMsg: function (arg) {
    console.log("send Event Message")
    let env = arg.env
    let userid = arg.userid
    let messagename = arg.messagename
    let map = arg.map
    let body = arg.body
    let msg = JSON.parse(JSON.stringify(this.globalData.msg))
    let success = arg.success
    let fail = arg.fail
    msg.data.JsonMessage.Message.MESSAGENAME = messagename
    msg.data.JsonMessage.Service = "asdpmssrv"
    msg.data.JsonMessage.Userinfo.LATITUDE = this.globalData.userlocation.latitude
    msg.data.JsonMessage.Userinfo.LONGITUDE = this.globalData.userlocation.longitude
    msg.data.JsonMessage.Message.MODULE = "oic"
    msg.data.JsonMessage.Userinfo.ENV = env
    msg.data.JsonMessage.Message.Body = body
    msg.data.JsonMessage.Message.PARAMMAP = map
    this.sendMsg(
      {
        msg: msg,
        title: "数据处理中",
        success: (res) => {
          if (success != undefined && success != null) {
            success(res)
          } else {
            return new Promise(function (resolve, reject) {
              resolve(res)
            })
          }
        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          } else {
            return new Promise(function (resolve, reject) {
              reject(err)
            })
          }
        }
      }
    )

  },//end function

  sendEventMsg: function (arg) {
    console.log("send Event Message")
    let env = arg.env
    let userid = arg.userid
    let messagename = arg.messagename
    let map = arg.map
    let body = arg.body
    let msg = JSON.parse(JSON.stringify(this.globalData.msg))
    let success = arg.success
    let fail = arg.fail
    msg.data.JsonMessage.Message.MESSAGENAME = messagename
    msg.data.JsonMessage.Service = "asdoicsrv"
    msg.data.JsonMessage.Userinfo.LATITUDE = this.globalData.userlocation.latitude
    msg.data.JsonMessage.Userinfo.LONGITUDE = this.globalData.userlocation.longitude
    msg.data.JsonMessage.Message.MODULE = "oic"
    msg.data.JsonMessage.Userinfo.ENV = env
    msg.data.JsonMessage.Message.Body = body
    msg.data.JsonMessage.Message.PARAMMAP = map
    this.sendMsg(
      {
        msg: msg,
        title: "数据处理中",
        success: (res) => {
          if (success != undefined && success != null) {
            success(res)
          } else {
            return new Promise(function (resolve, reject) {
              resolve(res)
            })
          }
        },
        fail: (err) => {
          if (fail != undefined && fail != null) {
            fail(err)
          } else {
            return new Promise(function (resolve, reject) {
              reject(err)
            })
          }
        }
      }
    )

  },//end function
}