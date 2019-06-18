// 云函数入口文件
const cloud = require('wx-server-sdk')
/* 
//dev env
cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
}) */

//prod env
cloud.init({
  env: "asd-smart-cloud-k2u5e"
}) 


const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async(event, context) => {
  /*
  const envstring =await cloud.callFunction(
    {
      name:'getenvstring',
      data:{}
    }
  )
  const db = cloud.database(
    {
      env: envstring
    }
  )
  */
  console.log(event)
  const db = cloud.database()
  const countResult = await db.collection('users').count()

  const total = countResult.total

  if (total < 1) {
    return {
      data: null
    }
  } else {

    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('users').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })

  }


}