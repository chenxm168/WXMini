module.exports = {
  globalData: {
    requesturls: { 'CIM_WIFI': "http://172.28.30.44/" },
  },

  msg: { data: { JsonMessage: { Url: "", Service: "asdquerysrv", Userinfo: { ENV: "prod", USERID: "", MOBILEMODE: "", SYSTEMMODULE: "", USERGROUP: "", LATITUDE: 0, LONGITUDE: 0, PRIVILEGEKEY: null, OPENID: null }, Message: { MODULE: "qry", MESSAGENAME: "GetQueryResult", QUERYID: "GetInspectionRecordList", VERSION: "", PARAMMAP: {}, PARAMLIST: [], Body: {} } } } },

  /* 20210504 */
  sendMsg: function (arg) {
    let msg = arg.msg
    let title = arg.title
    let success = arg.success
    let fail = arg.fail




    let wifiFail = (arg) => {
      let success = arg.success
      let fail = arg.fail
      let msg = arg.msg
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
        success: (res) => {
          let url = res.url + 'trulyasdwx?service=' + msg.data.JsonMessage.Service
          console.log("ready local request! url:" + url)
          wx.request({
            url: url,
            data: msg,
            method: 'POST',
            success: (res) => {
              console.log(res)
              wx.hideLoading({
                success: (res) => { },
              })
              if (success != undefined && success != null) {
                success({ result: res.data })
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
        fail: (err) => {
          wifiFail(
            {
              success: success,
              fail: fail,
              msg: msg
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





  DataList2List: function (arg) {
    let complete = arg.complete
    let datalist = arg.datalist
    let valuename = arg.valuename
    let rtnlist = []
    let list = (datalist.DATA == undefined && datalist.length > 1) ? datalist : [{ 'DATA': datalist.DATA }]
    for (let i = 0; i < list.length; i++) {
      rtnlist.push(list[i].DATA[valuename])
    }
    if (complete != undefined && complete != null) {
      complete(rtnlist)
    } else {
      return new Promise(function (resolve, reject) {
        resolve(rtnlist)
      })
    }
  }, //end function

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
    let attachcolor = arg.attachcolor
    console.log("Start makeTableData")
    console.log(headers)
    console.log(headers.length)

    // console.log(list)
    if (attachseq) {
      header.push({ header: "序号", show: 'Y', headerindex: 'header0' })
    }
    for (let k = 0; k < headers.length; k++) {

      header.push({id:headers[k].header.id, header: headers[k].header.name, show: headers[k].header.show, headerindex: k, unique: 'header' + (k + 1) })
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
        /* 20210623
        let key = headers[k].header.valuename.length > 0 ? headers[k].header.valuename : headers[k].header.id
        let value = data[key] == undefined ? headers[k].header.defaulvalue : data[key]
        20210623 */
        //20210623
        let key = headers[k].header.valuename.length > 0 ? headers[k].header.valuename : ''
        let value=null
        let id=''
        if( headers[k].header.id=='CHECKBOX')
        {
          id= headers[k].header.id
          if(key.length<1)
          {
            let dvalue=headers[k].header.defaulvalue
            value= (dvalue=='Y'||dvalue=='true'||dvalue=='TRUE'||dvalue=='y')? true:false
          }else
          {
             let dvalue =data[key]
             value= (dvalue=='Y'||dvalue=='true'||dvalue=='TRUE'||dvalue=='y')? true:false
          }
        }else
        {
         //20210812 value=data[key] == undefined ?'':data[key]
         value=data[key] == undefined ?headers[k].header.defaulvalue:data[key]
        }

        
        //20210623

        DATA[key] = value
        row.push({id:id, name: key, value: value, oth1: null, oth2: null, oth3: null, unique: tablename + 'cell-' + i + '-' + (k + 1), index: [i, k + 1], show: show, warning: false })
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

      let rw = { row: row, oth1: null, oth2: null, oth3: null, unique: tablename + 'row' + i.toString(), index: i, warningflag: false, firebrickflag: false, slateblueflag: false, purpleflag: false, othercolor: null }
      if (attachcolor == undefined || attachcolor == null) {
        rows.push(rw)
      }
      else {
        let tr = (list[i].DATA != undefined && list[i] != null) ? list[i].DATA : list[i]
        rw.warningflag = (attachcolor == undefined || attachcolor == null || attachcolor.warning == undefined || attachcolor.warning == null) ? false : this.CompareTo({ target: tr[attachcolor.warning.valuekey], op: attachcolor.warning.op, value: attachcolor.warning.value })
        let tc = attachcolor
        rw.firebrickflag = (tc.firebrick == undefined || tc.firebrick == null) ? false : this.CompareTo({ target: tr[tc.firebrick.valuekey], op: tc.firebrick.op, value: tc.firebrick.value })

        rw.slateblueflag = (tc.slateblue == undefined || tc.slateblue == null) ? false : this.CompareTo({ target: tr[tc.slateblue.valuekey], op: tc.slateblue.op, value: tc.slateblue.value })

        rw.purpleflag = (tc.purple == undefined || tc.purple == null) ? false : this.CompareTo({ target: tr[tc.purple.valuekey], op: tc.purple.op, value: tc.purple.value })

        //20210621  add 

        if (tc.rowothercolors == undefined || tc.rowothercolors == null) {
          rows.push(rw)
        } else {
          let oc = tc.rowothercolors.othercolor == null ? tc.rowothercolors : [{ othercolor: tc.rowothercolors.othercolor }]
          for (let j = 0; j < oc.length; j++) {
            let cdn = oc[j].othercolor
            if (this.CompareTo({ target: tr[cdn.valuekey], ope: cdn.op, value: cdn.value })) {
              rw.othercolor = { backcolor: cdn.backcolor, fontcolor: cdn.fontcolor }
              break
            }


          }//end for
          rows.push(rw)
        }

        //end add

        // 20210621 rows.push(rw)
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


  },

  MesDatalist2RawData: function (arg) {

  },//end function

  getDistinctList: function (list, fn) {
    let rtn = []
    list.forEach(el => {
      let v = fn(el)
      if (rtn.indexOf(v) < 0) {
        rtn.push(v)
      }
    })
    return rtn


  },//end function

  FilterListData: function (list, fn) {
    let rtn = []
    list.forEach(el => {
      if (fn(el)) {
        rtn.push(el)
      }

    })
    return rtn
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

        //20210621 add
        case ('ltdate'):
          {
            if (target == undefined || target == null || target.length == 0 || value == undefined || value == null || value.length == 0) {
              rtn = false
              break
            }
            let tdate = new Date(target)
            let vdate = value == 'now' ? new Date() : new Date(value)
            if (tdate == undefined || tdate == null || vdate == undefined || vdate == null) {
              rtn = false
            } else {
              if (tdate < vdate) {
                rtn = true
              }
            }

            break
          }

        case ('gtdate'):
          {
            if (target == undefined || target == null || target.length == 0 || value == undefined || value == null || value.length == 0) {
              rtn = false
              break
            }
            let tdate = new Date(target)
            let vdate = value == 'now' ? new Date() : new Date(value)
            if (tdate == undefined || tdate == null || vdate == undefined || vdate == null) {
              rtn = false
            } else {
              if (tdate < vdate) {
                rtn = true
              }
            }

            break
          }

        //end add


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

  getPMSMachineListByGroup: function (arg) {

    let success = arg.success
    let fail = arg.fail
    let env = arg.env
    let userid = arg.userid
    let service = "querymachinelistbypmsgroup"
    let machinegroupname = arg.machinegroupname
    let map = { PMS_MACHINEGROUPNAME: machinegroupname, USERID: userid, EVENTUSER: userid }
    let machines = []

    //define function
    let makeunitlist = (arg) => {
      let success = arg.success
      let list = arg.list
      if (list.length == undefined) {
        let unit = { MACHINENAME: list.DATA.MACHINENAME, DESCRIPTION: list.DATA.MACHINENAME + "--" + list.DATA.DESCRIPTION }
        let units = [unit]
        success(units)

      } else {
        let units = []
        for (let k = 0; k < list.length; k++) {

          let unit = { MACHINENAME: list[k].DATA.MACHINENAME, DESCRIPTION: list[k].DATA.MACHINENAME + "--" + list[k].DATA.DESCRIPTION }
          units.push(unit)

        }
        success(units)
      }
    }//end makeunnitlist function

    this.sendQueryMsg(
      {
        map: map,
        env: env,
        service: service,
        userid: userid,
        success: (res) => {
          console.log(res)
          let mlist = res.result.Message.Body.DATALIST
          console.log(mlist.length)
          if (mlist.length == undefined) {
            let machine = { MACHINENAME: mlist.DATA.MACHINENAME, DESCRIPTION: mlist.DATA.MACHINENAME + "--" + mlist.DATA.DESCRIPTION, UNIT: [] }
            console.log(machine)
            let ulist = mlist.DATA.UNITLIST.DATALIST
            makeunitlist(
              {
                list: ulist,
                success: (res) => {
                  machine.UNIT = res
                  machines.push(machine)
                  console.log(machines)
                  if (success != undefined && success != null) {
                    success(machines)//return machines

                  }

                }

              }
            )

          }
          else {

            for (let i = 0; i < mlist.length; i++) {
              let machine = { MACHINENAME: mlist[i].DATA.MACHINENAME, DESCRIPTION: mlist[i].DATA.MACHINENAME + "--" + mlist[i].DATA.DESCRIPTION, UNIT: [] }

              let ulist = mlist[i].DATA.UNITLIST.DATALIST
              console.log("ulist")
              console.log(ulist)
              makeunitlist(
                {
                  list: ulist,
                  success: (res) => {
                    console.log(res)
                    machine.UNIT = res;
                    machines.push(machine)
                  }
                }
              )

            }//end for
            if (success != undefined && success != null) {
              success(machines)//return machines
            }
          }
          console.log("machinelist")
          console.log(machines)


        },
        fail: (err) => {

        }
      })


  },   //end function

  sendPmsEventMsg: function (arg) {
    console.log("send Event Message")
    let env = arg.env
    let userid = arg.userid
    let messagename = arg.messagename
    let map = arg.map
    let body = arg.body
    let msg = JSON.parse(JSON.stringify(this.msg))
    let success = arg.success
    let fail = arg.fail
    msg.data.JsonMessage.Message.MESSAGENAME = messagename
    msg.data.JsonMessage.Service = "asdpmssrv"
    msg.data.JsonMessage.Userinfo.LATITUDE = arg.latitude
    msg.data.JsonMessage.Userinfo.LONGITUDE = arg.longitude
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
    let msg = JSON.parse(JSON.stringify(this.msg))
    let success = arg.success
    let fail = arg.fail
    msg.data.JsonMessage.Message.MESSAGENAME = messagename
    msg.data.JsonMessage.Service = "asdoicsrv"
    msg.data.JsonMessage.Userinfo.LATITUDE = arg.latitude
    msg.data.JsonMessage.Userinfo.LONGITUDE = arg.longitude
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

  //20210622 
  Object2XmlStr(arg) {
    let ob = arg.ob
    let rtnstr = ''
    for (let key in ob) {


      switch (typeof (ob[key])) {
        case 'string':
          {
            let xmlel = '<' + key + '>' + ob[key] + '</' + key + '>'
            rtnstr += xmlel
            break
          }
        case 'boolean':
          {
            let xmlel = '<' + key + '>' + ob[key].toString() + '</' + key + '>'
            rtnstr += xmlel
            break
          }
        case 'undefined':
          {

          }
        case 'object':
          {
            let ob1 = ob[key]
            if (ob1 == null) {
              rtnstr += '<' + key + '/>'
              break
            }

            if (ob1.length == undefined || ob1 == null) {
              rtnstr += '<' + key + '>' + this.Object2XmlStr(ob1) + '</' + key + '>'
              break
            } else {
              let liststr = ''
              ob1.forEach(element => {
                liststr += this.Object2XmlStr(element)
              });
              rtnstr += '<' + key + '>' + liststr + '</' + key + '>'
              break
            }

          }
        case 'number':
          {
            let xmlel = '<' + key + '>' + ob[key] + '</' + key + '>'
            rtnstr += xmlel
            break
          }
      }


    }
    return rtnstr

  },// end function

  parseArrayToXml(ary, elname) {
   
    if (ary.length < 1) {
      return '<' + elname + '/>'
    }
    let arystr = ''
    ary.forEach(el => {
       if(typeof(el)=='object')
       {
         if(Array.isArray(el))
         {

         }else
         {
           let substr=''
           for(let key in el)
           {
             substr+=this.parseObjectToXml(el[key],key)
           }
           arystr+=substr

         }
       }

    });
    if(elname==null||elname.length<1)
    {
      return arystr
    }
    else{
      return '<'+elname+'>'+arystr+'</'+elname+'>'
    }

  },//end function

  parseObjectToXml(ob, en) {
    let elname=''
    let starttag=(en == null || en.length < 1) ?'':'<' + en + '>'
    let endtag=(en == null || en.length < 1) ?'':'</' + en + '>'
    elname=  (en == null || en.length < 1) ?'value':en
   
    switch (typeof (ob)) {
      case 'string':
        {
          return starttag + ob + endtag
        }
      case 'object':
        {
          if (Array.isArray(ob)) {
            console.log('object is array')
             return this.parseArrayToXml(ob,en)

          } else {
            let ob1str = ''
            for (let k1 in ob) {
              ob1str += this.parseObjectToXml(ob[k1], k1)
            }
            return starttag + ob1str + endtag
          }
        }
      default:
        {
          return starttag + ob.toString() + endtag
        }
    }

  },//end function

  //20210625

  getPrivilageInfo(arg) {
    //let cdn = " AND SUPERMENUNAME LIKE 'Material_Operation%' OR SUPERMENUNAME LIKE 'Material_Hold%' "
    let cdn=arg.cdn
    let userinfo = arg.userinfo
    let success=arg.success
    let fail=arg.fail
    this.sendQueryMsg({
      env: userinfo.env,
      userid: userinfo.userid,
      queryid: 'GetMenuListByCondition',
      map: { USERID: userinfo.userid, CONDITION: cdn },

      success: (res) => {

        console.log('getPrivilageInfo:', res)
        let datalist = res.result.Message.Body.DATALIST
        let list = (datalist.DATA == undefined || datalist.DATA == null) ? datalist : [{ DATA: datalist.DATA }]
        let menulist = {}
        if (list.length > 0) {
          list.forEach(el => {
            menulist[el.DATA.MENUNAME] = true
          });
        }
        console.log('menulist:', menulist)
        
        if(success!=undefined&&success!=null)
        {
          success(menulist)
        }

      },
      fail: (err) => {
       if(fail!=undefined&&fail!=null)
       {
         fail(err)
       }
      }

    })
  },//end function

}