// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    env: "asd-smart-cloud-dev-kwtq8"  //develop
   // env: "asd-smart - cloud - k2u5e"//prod
  }
}