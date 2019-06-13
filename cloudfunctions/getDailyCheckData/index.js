// 云函数入口文件

const cloud = require('wx-server-sdk')
cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
})

// 云函数入口函数
exports.main = async(event, context) => {
  console.log(event)




  return new Promise(
    function(resolve, reject) {

      var callUserLogin = async function(args) {
        return await cloud.callFunction({
          name: "login",
          data: {}
        })

      }



      var callRequestData = async function(eqid) {
        let rs = await cloud.callFunction({
          name: "httpRequest",
          data: {
            body: {
              "MESSAGENAME": "GetInspectionRecordList",
              "MACHINENAME": event.eqid
            }
          }
        })

        return rs

      }

      /* cxm modify 20190611
      call(event.eqid).then((res) => {
        console.log(res)
        resolve(res.result)
        // return Promise.resolve(res)
      }, (err) => {
        reject(err)
      })  */

      callUserLogin()
        .then((res) => {
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
          } //end switch 
        })
        .then((res) => {
          return callRequestData(event.eqid)
        })
        .then((res) => {

          console.log(res)
          resolve(res.result)
        })
        .catch((e) => {
          reject(new Error(e))
        })


    }
  ) //end return new Promise

}