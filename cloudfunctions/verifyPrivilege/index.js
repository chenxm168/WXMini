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
  var openid = null


  return new Promise(function(resolve, reject) {

      var env = null
      var userInfo = null
      var message = {
        data: null,
        env: null,
        returnCode: null,
        returnText: null

      }
      var returnMessage = {
        returnCode: 0,
        /**
         * return value:
         * 0:ok
         * -3: no resgist user
         * -1: wait of auth
         * -2: blacklist
         * -10: no privilege
         * -100: input argument error
         * 
         * 
         */
        returnText: "",
        data: null,
        userInfo: null,
      }


      var isProd = false
      message.env = ((event.env != null && event.env != null) ? event.env : "dev")

      let callInitEnv = async function() {
        if (event.env != undefined && event.env != null) {
          console.log(envSet[event.env])
          cloud.init(envSet[event.env])
          //message.env = envSet[event.env]
          isProd = (event.env == "prod") ? true : false
          wxContext = cloud.getWXContext()
          openid = wxContext.openid
          return Promise.resolve(null)
        } else {
          cloud.init(envSet["dev"])
          // message.env = envSet["dev"]
          wxContext = cloud.getWXContext()
          openid = wxContext.openid
          return Promise.resolve(null)
        }
      } //end callInitEnv 




      //const openid = "oeWJp5EI1EtpjSKjzuHYYVgaxED8" //for local bebug
      //const openid = wxContext.OPENID


      var callGettUserinfo = async function() {
        /*
        return await db.collection("users").where({
          openid: openid
        }).get()*/

        return await cloud.callFunction({
          name: "getUserInfo",
          data: {
            env: "prod",
            openid: openid

          }
        })
      }

      var callChcekBingdingCodePrivilege = async function(user) {
        return new Promise(function(resolve2, reject2) {

          var callVeriyPagePrivilege = async function(user) {
            let arg = {
              env: user.env,
              page: event.page,
              userinfo: user
            }
            console.log(JSON.stringify(arg))
            return await cloud.callFunction({
              name: "verifyPagePrivilege",
              data: arg
            })

          }

          callVeriyPagePrivilege(user)
            .then((res2) => {
              resolve2(res2)
            })
            .catch((e) => {
              reject2(e)
            })

        })
      }





      /*
        if (user.appadmin) {
          return Promise.resolve({
            returnCode: 0,
            retrunText: "Verify Success",
            userinfo: user
          })
        } else {
          return Promise.resolve({
            returnCode: -10,
            returnText: "权限不足",
            userinfo: userInfo
          })
        } */


      let callCheckdailyCheckPrivilege = async function(user) {


        return new Promise(function(resolve3, reject3) {

          let call = async function(user) {
            let arg = {
              env: user.env,
              page: event.page,
              eqid: event.eqid,
              userinfo: user
            }

            console.log(JSON.stringify(arg))

            return await cloud.callFunction({
              name: "verifyPagePrivilege",
              data: arg
            })


          } //end call

          call(user)
            .then((res2) => {
              resolve3(res2)

            })
            .catch((e) => {
              reject3(e)

            })




        }) //end return new promise



      } //end callCheckdailyCheckPrivilege




      //main function start
      if (event.page == null) {
        resolve({
          returnCode: -100,
          returnText: "input argument error",
        })
      } else {

        callInitEnv()
        .then((res)=>
        {
          return callGettUserinfo()
        })
          .then((res) => {
            if (res.result.data == null) {

              message.returnCode = -3,
                message.returnText = "微信用户还未在系统注册",
                message.data = {
                  userinfo: null
                }

              resolve(message)

            } else {
              let user = res.result.data
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
          .then((res) => {
            switch (event.page) {
              case "dailyCheck":
                {
                  return callCheckdailyCheckPrivilege(res)
                  break
                }

              case "bindingCode":
                {
                  return callChcekBingdingCodePrivilege(res)
                  break
                }
              default:
                {
                  message.returnCode = -100
                  message.returnText = "输入参数错误[" + event.page + "]"
                  resolve(message)
                  break
                }

            }

          })
          .then((res) => {
            resolve(res.result)
          })
          .catch((err) => {
            reject(new Error(err))
          })

      } //end else











    }

  ) //end return new promise
}