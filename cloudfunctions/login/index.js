// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

//dev env
/*
cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
}) */

//prod env

cloud.init({
  env: "asd-smart-cloud-k2u5e"
}) 


/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = (event, context) => {
  console.log(event)
  console.log(context)

  

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const db = cloud.database()


  const wxContext = cloud.getWXContext()

  return new Promise(function(resolve, reject) {
    
    


    let args = {};

    var callMakeArgs = async function() {
      return new Promise(function(resolve, reject) {
        if (event.data != undefined && event.data != null && event.data.userId != undefined && event.data.userId != null & event.data.password != undefined && event.data.password != null) {
          args = {
            userid: event.data.userId,
            password: event.data.password
          }
          resolve(args)
        } else {
          arr = {
             //openid: wxContext.OPENID
            openid: "oeWJp5EI1EtpjSKjzuHYYVgaxED8"
          }
          resolve(arr)
        }

      }) //end return new Promise


    } //callMakeArgs

    var callReturnMessage = async function(res) {
      if (res.data == null || res.data.length < 1) {
        message = {
          loginReturnCode: -3,
         loginReturnMessage: "Not Found User",
          dataCount: 0,
        }
        return Promise.resolve(message)
      } else {
         let user = res.data[0]
        if (user.blacklist)  //
        {
          message = {
            loginReturnCode: -2,
            dataCount: res.data.length,
            rows: res.data
          }
          return Promise.resolve(message)
        }else
        {
          if (!user.auth)
          {
            message = {
              loginReturnCode: -1,
              dataCount: res.data.length,
              rows: res.data
            }
          return Promise.resolve(message)
          }
          else{
            message = {
              loginReturnCode: res.data.length,
              dataCount: res.data.length,
              rows: res.data
            }
           
          
          callUpdateUserInfo(res)
          return Promise.resolve(message)
          }
        }
        
        
        // resolve(message)
        
      }
    } // callReturnMessage

    var callGetUserInfo = async function(arr) {
      return await db.collection("users").where(
        arr
      ).get()
    } //end callGetUserInfo

    var callUpdateUserInfo = async function(res) {
      if (res.data != null || res.data.length > 0) {

        user = res.data[0];
        user.isonline = true;
        user.logintime = new Date();
        const cmd = db.command
        db.collection("users").where({
          userid: cmd.eq(user.userid)
        }).update({
          data: {
            isonline: true,
            logintime: new Date(),
          }
        })


      }
    } //end callUpdateUserInfo




     callMakeArgs()
     .then(
       (res)=>
       {
        return callGetUserInfo(res)
       })
       .then((res)=>
       {
         return callReturnMessage(res)
       })
       .then(
         (res)=>
         {
           resolve(res)
         }
       )

       .catch((err)=>
       {
          reject(new Error(err))
       })

  

  }) //end return Promise


  




}