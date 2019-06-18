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

  const env = ((event.env != undefined && event.env != null) ? event.env : "dev")

  return new Promise(function(resolve, reject) {

    var message = {
      data: null,
      env: null,
      returnCode: 0,
      returnText: "success"

    }
    message.env = (event.env != undefined && event.env != null) ? event.env : "dev"

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

    callGetCodeInfoFromDB = async function(data) {
      let db = cloud.database()
      return await db.collection("codelocation").where(data).get()
      
    }//end function
     
     callInitEnv()
     .then((res)=>
     {
       let num = ((event.codeid == undefined || event.codeid == null) ? 0 : 1) + ((event.codeurl == undefined || event.codeurl == null) ? 0 : 2)
       let data = null
       switch (num)
       {
         case 1:
         {
             data = {
               codeid: event.codeid
             }
             return callGetCodeInfoFromDB(data)
           break
         }

         case 2:
         {
             data = {
               codeurl: event.codeurl
             }
             return callGetCodeInfoFromDB(data)
           break
         }

         case 3:
         {
             data = {
               codeurl: event.codeurl
             }
             return callGetCodeInfoFromDB(data)
           break
         }

         default:
         {
             reject(new Error("传入参数错误"))
         }



       }

       
     })
     .then((res)=>
     {
       if(res.data.length>0){
         message.data= res.data[0]
          resolve(message)
       }else
       {
         message.returnCode=-1
         message.returnText="没有找到记录"
         resolve(message)
       }

     })
     .catch((e)=>{
       reject(e)

     })




  }) //end return promise


}