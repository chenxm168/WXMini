// 云函数入口文件

const cloud = require('wx-server-sdk')
cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
})

// 云函数入口函数
exports.main = async(event, context) => {
   
  let call= await  cloud.callFunction(
    {
      name:"httpRequest",
      data:{
        "MESSAGENAME": "GetInspectionRecordList",
        "MACHINENAME": "A1CVD01"
      }
    }
   
  )
  call.then(
    (res)=>
    {
        return res;
    }
  ).catch((err)=>
  {
     console.log(err)
     return Promise.reject(err)
  })
}

