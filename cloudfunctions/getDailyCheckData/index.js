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

  const env=((event.env!=undefined&&event.env!=null)?event.env:"dev")

  return new Promise(
    function(resolve, reject) {
      
      var isProd = false
      let callInitEnv = async function () {
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













      let callUserLogin = async function(args) {
        return await cloud.callFunction({
          name: "login",
          data: {}
        })

      }



      let callRequestData = async function(eqid) {
        let rs = await cloud.callFunction({
          name: "httpRequest",
          data: {
            env:env,
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
      /*
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
            case -3:
            {
                return Promise.reject(new Error("用户未注册"))
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
        }) */
        callInitEnv()
        .then((res)=>
        {
         return callRequestData(event.eqid)
        }
        )
        
        .then((res) => {
         if(res.result!=undefined&&res.result!=null) 
         {
           let msg = res.result
           if(res.result.data.length<1)
           {
             msg.returnCode=-1,
             msg.returnText="未有此设备的点检项目"
             console.log(msg)
             resolve(msg)
           }else
           {
             console.log(msg)
             resolve(msg)
           }
           
         }
         
          
        })
        .catch((e) => {
          reject(new Error(e))
        })


    }
  ) //end return new Promise

}