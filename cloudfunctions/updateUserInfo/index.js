// 云函数入口文件
const cloud = require('wx-server-sdk')

//cloud.init()
/*
cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
}) //develop
*/
//prod env

cloud.init({
  env: "asd-smart-cloud-k2u5e"
}) 

// 云函数入口函数
exports.main = async (event, context) => {
   const db= cloud.database();
   return new Promise(function(resolve,reject)
   {
     let call = async function () {
       let rs = await db.collection('users').where(
         {
           userid: event.userinfo.userid
         }

       ).update(
         {
           data: event.userinfo
         }
       )
       return rs
     }

     call().then((res)=>{
       resolve(res)

     }).catch((err)=>
     {
       reject(err)
     })

   })
  
  
  
}