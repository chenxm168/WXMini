// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var checkdetail=null;
  return new Promise(function(resolve, reject) {
    var message = {
      MESSAGENAME: "EnteringInspectionV3",
      EVENTUSER: "",
      INSPECTIONLIST: []

    }

    var user = null

    var callCheckInputArgs = async function() {
      if (event.eqid == undefined || event.eqid == null || event.eqid.length<1)
      {
        
        
        return Promise.reject(new Error("eqid error"))
      }else
      {
        if (event.subeqlist == null || event.subeqlist.length<1)
        {
          return Promise.reject(new Error("subeqlist error"))
        }else
        {
          checkdetail=event;
          return Promise.resolve()
        }
      }

    }

    var callLogin = async function() {
      var arg = {}
      if (event.data != undefined & event.data != null) {
        arg = event.data
        return await cloud.callFunction({
          name: 'login',
          data: event.data
        })
      } else {
        return await cloud.callFunction({
          name: 'login',
          data: arg
        })
      }

    } //end callLoging

    var callSumitData = async function() {

        var sub= checkdetail.subeqlist
         message.EVENTUSER =user.pmsuserid
        for(let i=0;i<sub.length;i++)
        {
          for(let j=0;j<sub[i].itemlist.length;j++)
          {
            var item = sub[i].itemlist[j]
            var INSPECTION={
              "INSPECTIONID": item.INSPECTIONID,
              "ITEMNAME": item.ITEMNAME,
              "MACHINEGROUPNAME": item.MACHINEGROUPNAME,
              "MACHINENAME": item.MACHINENAME,
              "MACHINESTATENAME": item.MACHINESTATENAME,
              "UNITNAME": item.UNITNAME,
              "SHIFT": item.SHIFT,
              "MAXIMUM": item.MAXIMUM,
              "MAXIMUMFLAG": item.MAXIMUMFLAG,
              "INSPECTIONVALUE": item.INSPECTIONVALUE,
              "MINIMUM": item.MINIMUM,
              "MINIMUMFLAG": item.MINIMUMFLAG,
              "INSPECTIONUNIT": item.INSPECTIONUNIT,
              "WORKTIME": item.WORKTIME,
              "VERIFIER": item.VERIFIER,
              "ACTIVATESTATE": item.ACTIVATESTATE,
              "DESCRIPTION": item.DESCRIPTION,
              "INSPECTIONSTATE": item.INSPECTIONSTATE,
              "INSPECTIONRESULT": item.INSPECTIONRESULT

            } //end INSPECTION
          
            message.INSPECTIONLIST.push(INSPECTION)

          }
        }

        return await cloud.callFunction(
          {
            name:"httpRequest",
            data:{body:message}
          }
        )

    }

    callCheckInputArgs()
    .then(()=>
    {
     return callLogin()

    }

    )
    .then((res)=>
    {
      switch (res.result.loginReturnCode) {
        case -1:
          {
            return Promise.reject(new Error("用户待审核"))
            break
          }
        case -2:
          {
            return Promise.reject(new Error("用户被禁止使用"))
            break
          }

        default:
          {
            user = res.result.rows[0]
            let data = {
              'user': res.result.rows[0]
            }
            return Promise.resolve(data)
            break
          }
      }//end switch
    })
    .then((data)=>
    {
      return callSumitData()
    })
    .then((res)=>
    {
      if(  res.result.RETURNCODE==0)
      {
        resolve(
          {
            "returnCode":0
          }
        )
      }else
      {
        reject(new Error("PMS RETURNCODE ERR["+res.result.RETURNCODE+"]"))
      }

    })
    .catch((e)=>
    {
         reject(new Error(e))
    })






  })

}