// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const envSet = {
    dev: {
      env: "asd-smart-cloud-dev-kwtq8"
    },

    prod: {
      env: "asd-smart-cloud-k2u5e"
    }

  }

  var  wxContext = null

  return new Promise(function(resolve,reject)
  {

    var message = {
      data: null,
      env: null,
      returnCode: 0,
      returnText: "success"

    }
    var isProd = true
   // message.env = ((event.env != undefined && event.env != null) ? event.env : "dev")
      message.env="prod"
     
    let callInitEnv = async function () {
     // cloud.init(envSet.prod)
      wxContext = cloud.getWXContext()
      return Promise.resolve(null)
       /*
      if (event.env != undefined && event.env != null) {
        console.log(envSet[event.env])
        cloud.init(envSet[event.env])
        //message.env = envSet[event.env]
        isProd = (event.env == "dev") ? false : true
        wxContext = cloud.getWXContext()
        return Promise.resolve(null)
      } else {
        cloud.init(envSet["prod"])
        // message.env = envSet["dev"]
        wxContext = cloud.getWXContext()
        return Promise.resolve(null)
      }*/
    } //end callInitEnv

    let callGetUserInfoFromDB =async function()
    {
      if(event.userid==null)
      {
       const openid =(event.openid!=undefined&&event.openid!=null) ? event.openid: wxContext.OPENID
       //const openid = "oeWJp5EI1EtpjSKjzuHYYVgaxED8" //for local bebug
        const db= cloud.database()
        return await  db.collection("users").where(
          {
            openid: openid
          }
        ).get()

      }else
      {
        return await db.collection("users").where(
          {
            userid: event.userid
          }
        ).get()

      }

    }

    callInitEnv()
    .then((res)=>
    {
      return callGetUserInfoFromDB()
    })
    .then((res)=>
    {
      if(res.data.length>0)
      {
        message.data=res.data[0]
        resolve(message)
      }else
      {
        message.returnCode=-1
        message.returnText="用户未注册"
        resolve(message)
      }

    })
    .catch((e)=>
    {
      reject(e)
    })
  
  
  
})//end return promise
}