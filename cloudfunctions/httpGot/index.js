// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const querystring = require('querystring')

// dev env
cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
})



// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  /*
  var callback = function (error,response,body) {
    // 不断更新数据
    var msg = '';
    response.on('data', function (data) {
      msg += data;
    });

    response.on('end', function (){
      // 数据接收完成
      //console.log(body);
      console.log("\n+++++++++++++body++++++++++++++++++++++++++++\n");
     // msg = body;
     // clearTimeout(timeout);
      console.log(msg);

      
    }) 

  }//end callback */
  //var url = 'http://172.28.64.53:8080/webBrowser/webservice?username=admin&password=myttest'
  console.log(event)
  //var url = "http://localhost:8080/MiniServer/wxservice"
  var url = "http://172.28.64.75:8080/webBrowser/webservice"

  let result = await request({
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

  }, function (error, response, rspBody) {

    if (!error && response.statusCode == 200) {
      //console.log(body) // 打印google首页
      console.log("\n %%%%%%%%%%%%%%%%%%%%%%%%\n")
      //console.log(rspBody)
      console.log(JSON.stringify(rspBody))
      clearTimeout(tr)
      var rsp = null;
      try {
        // rsp = JSON.parse(rspBody)
        rps = rspBody
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

  return result

}