// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return new Promise(function (resovle, reject) {
    var httpUrl = "http://asd.truly.com.cn/trulyasdwx"
    if (event.JsonMessage.Url != undefined && event.JsonMessage.Url != null && event.JsonMessage.Url != "") {
      httpUrl = event.JsonMessage.Url
    }
    let sendRequest = async function (httpurl) {
      return new Promise(function (s3, r3) {

        console.log(event);

        var url = httpurl
        var tr = setTimeout(() => {
          r3(new Error("wx server request timeout"))
        }, 18000)

        request({
          url: url,
          method: "POST",
          // proxy: 'http://localhost:8888',
          json: true,
          // "content-type": "application/json"
          headers: {

            "Content-Type": "application/json"
          },

          body: event.JsonMessage
        }, function (error, response, rspBody) {

          if (!error && response.statusCode == 200) {
            //console.log(body) // 打印google首页
            console.log("\n %%%%%%%%%%%%%%%%%%%%%%%%\n")
            //console.log(rspBody)
            console.log(JSON.stringify(rspBody))
            clearTimeout(tr)
            s3(rspBody)
          }
        })//end request

      })//end return promise
    }
    sendRequest(httpUrl)
      .then((res) => {
          resovle(res)
      })
      .catch((err) => {
         
         reject(err)

      })




  })

  /*
    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    } */
}