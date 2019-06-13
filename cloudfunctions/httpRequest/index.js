// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const querystring = require('querystring')

// dev env
cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
})



// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  return new Promise(function(resovle, reject) {

    console.log(event);
    // var url = "http://localhost:8080/MiniServer/wxservice"
    // var url = "http://172.28.64.75:8080/webBrowser/webservice"
    var url = "http://250m0992i5.zicp.vip:44565/webBrowser/webservice"
    var tr = setTimeout(() => {
      reject(new Error("wx server request timeout"))
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
      //test data
      /*
      body: {
        "MESSAGENAME": GetInspectionRecordList
        "MACHINENAME": "A1CVD01"
      }*/
      body: event.body

    }, function(error, response, rspBody) {

      if (!error && response.statusCode == 200) {
        //console.log(body) // 打印google首页
        console.log("\n %%%%%%%%%%%%%%%%%%%%%%%%\n")
        //console.log(rspBody)
        console.log(JSON.stringify(rspBody))
        clearTimeout(tr)
        resovle(rspBody)
        /*
        var rsp = null;
        try {
          // rsp = JSON.parse(rspBody)
          rps = rspBody
          console.log(rsp)
          return Promise.resolve(rsp)
        } catch (err) {
          return Promise.reject(err)
        } */

      }


    })



  })





  //var url = 'http://172.28.64.53:8080/webBrowser/webservice?username=admin&password=myttest'
  //console.log(event)
  //var url = "http://localhost:8080/MiniServer/wxservice"
  //var url = "http://172.28.64.75:8080/webBrowser/webservice"
  /*
  let result= await request({
        url: url,
        method: "POST",
        // proxy: 'http://localhost:8888',
        json: true,
        // "content-type": "application/json"
        headers: {

          "Content-Type": "application/json"
        },
        //test data
        body: {
          "MESSAGENAME": "GetInspectionRecordList",
          "MACHINENAME": "A1CVD01"
        }

      }, function(error, response, rspBody) {

        if (!error && response.statusCode == 200) {
          //console.log(body) // 打印google首页
          console.log("\n %%%%%%%%%%%%%%%%%%%%%%%%\n")
          //console.log(rspBody)
          console.log(JSON.stringify(rspBody))
          clearTimeout(tr)
          var rsp = null;
          try {
            // rsp = JSON.parse(rspBody)
            rps=rspBody
            console.log(rsp)
            return Promise.resolve(rsp)
          } catch (err) {
            return Promise.reject(err)
          }

        }

      })
      


    //设置TIMEOUT时间

    var tr = setTimeout(() => {
      return Promise.reject(new Error("wx server request timeout"))
    }, 18000)

    return result */

}