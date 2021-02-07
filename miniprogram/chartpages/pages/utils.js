module.exports = {
  msg: { data: { JsonMessage: { Url: "", Service: "asdquerysrv", Userinfo: { ENV: "prod", USERID: "", MOBILEMODE: "", SYSTEMMODULE: "", USERGROUP: "", LATITUDE: 0, LONGITUDE: 0, PRIVILEGEKEY: null, OPENID: null }, Message: { MODULE: "qry", MESSAGENAME: "GetQueryResult", QUERYID: "GetInspectionRecordList", VERSION: "", PARAMMAP: {}, PARAMLIST: [], Body: {} } } } },
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

  },
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

  MesDATALIST2List:function(datalist)
  {
     let list=[]
     datalist.forEach(item => {
     //  console.log(item)
       list.push(item.DATA)
     });
     return list
  },
  SumaryBy:function(grouplist,sumkeys)
  {
    let groups=[]

    //console.log(Object.keys(grouplist))
    Object.keys(grouplist).forEach(key=>
      {
        let gp=grouplist[key]
        let group={groupname:key}
        gp.forEach(item=>
          {
            sumkeys.forEach(sumkey=>
              {
                Object.keys(item).forEach(colname=>
                  {
                    if(colname==sumkey)
                    {
                      group[sumkey]= groups[sumkey] || 0
                      let v=parseFloat(item[colname])
                      group[sumkey] +=v
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

}