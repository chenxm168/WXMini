// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  return new Promise(function (resovle, reject) {

    const wxContext = cloud.getWXContext()
    var openid = wxContext.OPENID;
     var url="http://59.37.42.3:8888/trulyasdwx?service="+event.data.JsonMessage.Service
    //var url = "http://172.28.48.171/trulyasdwx"
   // var url ="http://361d23z941.wicp.vip/trulyasdwx"
    if (event.data.JsonMessage.Url != null && event.data.JsonMessage.Url != null && event.data.JsonMessage.Url != "") {
      url = event.data.JsonMessage.Url
    }
    let sendRequest = async function (httpurl) {
      return new Promise(function (s3, r3) {

        console.log(event.data);

        var url = httpurl
        var tr = setTimeout(() => {
          r3(new Error("wx server request timeout"))
        }, 28000)


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
          body: event.data

        }, function (error, response, rspBody) {
          if (!error && response.statusCode == 200) {
            //console.log(body) // 打印google首页
            console.log("\n %%%%%%%%%%%%%%%%%%%%%%%%\n")
           // console.log(rspBody)
            if(rspBody==undefined)
            {
              let data={ Message:{
                Return:{
                  RETURENCODE:"NODATA",
                  RETURNMESSAGE:"没有回复数据"
                }
              }}
               
              s3(data)
            }
            console.log(JSON.stringify(rspBody))
            clearTimeout(tr)
            s3(rspBody)
          }
        })//end request    
      })//end return promise
    }

    sendRequest(url)
      .then((res) => {
       // return
        //{
       //   data: res
        //}
        resovle(res);
      }
      )
      .catch((err) => {
        /*
        return
        {
          data: {
            Message:
            {
              Return: {
                RETURNCODE: "ERR009";
                RETURNMESSAGE: err
              }
            }
          }
        } */
        let errmsg ={Message:{Return:{RETURNCODE:"TIMEOUT",RETURNMESSAGE:err}}}
        reject(errmsg)
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