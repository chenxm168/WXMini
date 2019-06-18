// 云函数入口文件
const cloud = require('wx-server-sdk')

//dev env
/*
cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
})
*/

const envSet = {
  dev: {
    env: "asd-smart-cloud-dev-kwtq8"
  },

  prod: {
    env: "asd-smart-cloud-k2u5e"
  }

}

// 云函数入口函数
exports.main = async(event, context) => {
  var wxContext = null
  var checkdetail=null;
  return new Promise(function(resolve, reject) {
    var sendBody = {
      MESSAGENAME: "EnteringInspectionV3",
      EVENTUSER: "",
      INSPECTIONLIST: []

    }

    var message = {
      data: null,
      env: null,
      returnCode: null,
      returnText: null

    }

    var openid=null

    var isProd = false

    

    var user = null

    let callInitEnv = async function () {
      if (event.env != undefined && event.env != null) {

        cloud.init(envSet[event.env])
        //message.env = envSet[event.env]
        isProd = (event.env == "prod") ? true : false
        wxContext = cloud.getWXContext()
        openid= wxContext.OPENID
        return Promise.resolve(null)
      } else {
        cloud.init(envSet["dev"])
        // message.env = envSet["dev"]
        wxContext = cloud.getWXContext()
        openid = wxContext.OPENID
        return Promise.resolve(null)
      }



    }//end callInitEnv







    var callCheckInputArgs = async function() {
      if (event.checkdetail.eqid == undefined || event.checkdetail.eqid == null || event.checkdetail.eqid.length<1)
      {
        
        
        return Promise.reject(new Error("eqid error"))
      }else
      {
        if (event.checkdetail.subeqlist == null || event.checkdetail.subeqlist.length<1)
        {
          return Promise.reject(new Error("subeqlist error"))
        }else
        {
          checkdetail = event.checkdetail;
          return Promise.resolve()
        }
      }

    }


    var callGettUserinfo = async function () {
      /*
      return await db.collection("users").where({
        openid: openid
      }).get()*/

      return await cloud.callFunction(
        {
          name: "getUserInfo",
          data: {
            env: "prod",
            openid:openid
          }
        }
      )
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
         sendBody.EVENTUSER =user.pmsid
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
          
            sendBody.INSPECTIONLIST.push(INSPECTION)

          }
        }

        return await cloud.callFunction(
          {
            name:"httpRequest",
            data:{body:sendBody}
          }
        )

    }


    callInitEnv()
    .then((res)=>
    {
     return callCheckInputArgs()
    })
    
    .then(()=>
    {
      return callGettUserinfo()

    }

    )
    .then((res)=>
    {
      if (res.result.data == null) {

        message.returnCode = -3,
          message.returnText = "微信用户还未在系统注册",
          message.data = {
            userinfo: null
          }

        resolve(message)

      } else {
         user = res.result.data
        userInfo = res.result.data
        env = userInfo.env



        if (user.blacklist) {

          message.returnCode = -2,
            message.returnText = "用户已被列入黑名单",
            message.data = {
              userinfo: user
            }

          resolve(message)


        } else {
          if (!user.auth) {

            message.returnCode = -1,
              message.returnText = "用户未经认证",
              message.data = {
                userinfo: user
              }

            resolve(message)


          } else {

            return Promise.resolve(user)
          }
        }

      }
    })
    .then((data)=>
    {
      return callSumitData()
    })
    .then((res)=>
    {
      /*
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
      }*/
      resolve(res.result)

    })
    .catch((e)=>
    {
         reject(new Error(e))
    })






  })

}