// 云函数入口文件
const cloud = require('wx-server-sdk')

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
  console.log(event)
  var wxContext = null
  var user = null

  const env = ((event.env != undefined && event.env != null) ? event.env : "dev")

  return new Promise(function(resolve, reject) {

    var message = {
      data: null,
      env: null,
      returnCode: null,
      returnText: null

    }
    message.env = ((event.env != null && event.env != null) ? event.env : "dev")
    var isProd = false
    let callInitEnv = async function() {
      if (event.env != undefined && event.env != null) {

        cloud.init(envSet[event.env])
        //message.env = envSet[event.env]
        isProd = (event.env == "prod") ? true : false
        wxContext = cloud.getWXContext()
        return Promise.resolve(null)
      } else {
        cloud.init(envSet["dev"])
        // message.env = envSet["dev"]
        wxContext = cloud.getWXContext()
        return Promise.resolve(null)
      }



    } //end callIniEnv








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


    let callGetUserInfo=async function()
    {
      return await cloud.callFunction(
        {
          name:"getUserInfo",
          data:
          {
            env:env
          }
        }
      )

    }

    var callHasCodeId = async function() {

      if (event.codeurl != undefined && event.codeurl != null) {
        let db = cloud.database()
        return await db.collection("codelocation").where({
          codeurl: event.codeurl
        }).remove()


      } else {
        return await db.collection("codelocation").where({
          rodeid: event.codeid
        }).remove()

      }



    } //end callHasCodeId



    var callUpdateLocation = async function(res) {




      if (res.total > 0) {
        let cmd = db.command
        //return await db.collection('codelocation').where(
        return db.collection('codelocation').where({
          codeid: cmd.eq(event.codeid)
        }).update({
          data: {
            codeurl: event.codeurl,

            userid: user.userid,
            verifyaccuracy: event.verifyaccuracy,
            codepoint: event.point,
            lasteventtime: new Date(),
            page: event.page,
            category: event.category,
            verifyflag: true,
            eqid: event.eqid,
            args: event.args
          }
        })
      } else {
          let db = cloud.database()
        return db.collection('codelocation').add({
          data: {
            codeurl: event.codeurl,
            codeid: event.codeid,
            userid: user.userid,
            verifyaccuracy: event.verifyaccuracy,
            codepoint: event.point,
            lasteventtime: new Date(),
            page: event.page,
            category: event.category,
            verifyflag: true,
            eqid: event.eqid,
            args: event.args
          }
        })
      }




    } //end callUpdateLocation

    callInitEnv()
    .then((res)=>
    {
      return callGetUserInfo()
    })
    
    /*
      .then((res) => {
        return callLogin(event.data)
      }) 

      .then((res) => {
        switch (res.result.returnCode) {
          case -1:
            {
              return Promise.reject(new Error("用户待审核"))
              break
            }
          case -2:
            {
              return Promise.reject(new Error("被禁止使用"))
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
        }

      }) */
      .then((res)=>
      {
        if(res.result.returnCode==0)
        {
          user = res.result.data
          return callHasCodeId()
        }else
        {
          reject(res.result.returnText)
        }
      })
      .then((res) => {
        return callUpdateLocation(0)
      })
      .then((res) => {
         

        if (res._id != undefined && res._id != null) {
          
          message.returnCode=0,
          
          
          resolve(message)
        } else {
          //var rtn = { bindingReturnCode: res.stats.updated }
          message.returnCode=-1
          message.returnText="绑定失败"
          resolve(message)
        }
      })
      .catch(
        (err) => {
          reject(err)
        }
      )



  }) //end return new promise

  /*
    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
    */
}