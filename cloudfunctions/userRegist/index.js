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

var rtn = {

  ok: {
    returnCode: 0,
    returnText: "Successs"
  },
  duplication: {
    returnCode: -1,
    returnText: "微信用户已注册"

  },
  argsErr:

  {
    returnCode: -100,
    returnText: "输入参数错误"
  },
  other: {
    returnCode: -200,
    returnText: "未知错误"
  },
  cloundFunction: {
    returnCode: -300,
    returnText: "云函数出错"
  }


}

//cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  var wxContext = null


  return new Promise(function(resolve, reject) {

      var message = {
        data: null,
        env: null,
        returnCode: null,
        returnText: null

      }

      var isProd = false


      let callInitEnv = async function() {
        if (event.env != undefined && event.env != null) {

          cloud.init(envSet[event.env])
          //message.env = envSet[event.env]
          isProd = (event.env == "prod") ? true : false
          wxContext = cloud.getWXContext()
          return Promise.resolve(null)
        } else {
          cloud.init(envSet["prod"])
          // message.env = envSet["dev"]
          wxContext = cloud.getWXContext()
          return Promise.resolve(null)
        }



      }

      let callVerifyInputArgs = async function() {
        if (event.userinfo == undefined || event.userinfo == null) {

          message.returnCode = rtn.argsErr
          return Promise.reject(new Error(rtn.argsErr.returnText))
        } else {
          return Promise.resolve(0)
        }
      }

      let callTryGetUserInfoFormDb = async function() {
        let db = cloud.database()
        let openid = wxContext.OPENID
        return await db.collection("users").where({
          openid: openid
        }).get()

      }

      let callAddNewUserToDb = async function(user) {
        return new Promise(function(resolve2, reject2) {
          let db = cloud.database()
          let openid = wxContext.OPENID


          let toDB = async function(user) {
            return await db.collection("users").add({
              data: user

            })
          }

          toDB(user)
            .then((res) => {
              var data = {
                userinfo: user,
                ressult: res._id
              }

             resolve2(data)

            })
            .catch(
              (e) => {
                message.returnCode = rtn.other.returnCode,
                  message.returnText = e

                return Promise.reject2(new Error(e))
              }
            )

        })

      }

      callInitEnv()
        .then((res) => {
          return callVerifyInputArgs()
        })
        .then((res) => {
          return callTryGetUserInfoFormDb()
        })
        .then((res) => {
          if (res.data.length > 0) {



            reject(new Error(rtn.duplication.returnText))


          } else {

            let user = {


              userid: event.userinfo.userid,
              openid: wxContext.OPENID,
              mobile: event.userinfo.mobile,
              username: event.userinfo.username,
              disivion: 'ASD Division',
              deptid: event.userinfo.deptid,

              fab: event.userinfo.fab,
              roleid: event.userinfo.roleid,
              pmsid: event.userinfo.pmsid,

              password: event.userinfo.password,
              groupid: event.userinfo.groupid,
              permissiongroup: event.userinfo.permissiongroup,
              isonline: event.userinfo.isonline,
              logintime: null,
              //creattime: event.userinfo.creattime,
              creattime: new Date(),
              appadmin: false,
              wxusrinfo: event.userinfo.wxusrinfo,
              deptmanager: false,
              auth: false,
              blacklist: false,
              env: "dev"






            } //end user define

            if (!isProd) {

               user.deptmanager = true,
                
                user.auth = true,
                //user.appadmin = true,
                 user.appadmin = false,
                user.env = "dev"
              return callAddNewUserToDb(user)

            } else {
              user.env = "prod"
              return callAddNewUserToDb(user)
            }



          }

        })
        .then(

          (res) => {
            message.data = res

            message.returnCode = rtn.ok.returnCode,
              message.returnText = rtn.ok.returnText,
              resolve(message)

          }

        )
        .catch((e) => {
          reject(e)
        })




    } //end return new promise
  )


  /*
    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    } */
}