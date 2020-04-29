// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const querystring = require('querystring')

// dev env
/*
cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
})
*/
//prod env

const envSet = {
  dev: {
    env: "asd-smart-cloud-dev-kwtq8"
  },

  prod: {
    env: "asd-smart-cloud-k2u5e"
  }

}


// 云函数入口函数
exports.main = async (event, context) => {


  var wxContext = null

  return new Promise(function (resovle, reject) {

    var message = {
      data: null,
      env: null,
      returnCode: 0,
      returnText: "success"

    }
    message.env = (event.env != undefined && event.env != null) ? event.env : "dev"

    var httpUrl = ""

    var isProd = false

    let callInitEnv = async function () {
      if (event.env != undefined && event.env != null) {

        cloud.init(envSet[event.env])
        //message.env = envSet[event.env]
        isProd = (event.env == "prod") ? true : false
        wxContext = cloud.getWXContext()
        return Promise.resolve(null)
      } else {
        cloud.init(envSet["prod"])
        // message.env = envSet["dev"]
        wxContext = cloud.getWXContext()
        return Promise.resolve(null)
      }



    } //end callIniEnv


    let callGetHttpUrl = async function () {
      return new Promise(function (s2, r2) {

        let callDB = async function () {
          let db = cloud.database()
          return await db.collection("globalconfig").doc("asd1").get()
        }

        callDB()
          .then((res) => {
            if (res.data != null) {
              if (isProd) {
                httpUrl = res.data.prodhttpurl
                s2(httpUrl)
              } else {
                httpUrl = res.data.devhttpurl
                s2(httpUrl)
              }

            } else {
              r2("未找到http url配置")

            }

          })
          .catch((e) => {
            r2(e)
          })



      }


      )//end return promise s2



    }// end function callGetHttpUrl


    let sendRequest = async function (httpurl) {
      return new Promise(function (s3, r3) {

        console.log(event);

        var url = "http://localhost:8080/hello2.do"
        var tr = setTimeout(() => {
          r3(new Error("wx server request timeout"))
        }, 18000)


        request({
          url: url,
          //method: "POST",
          method:"POST",
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


    callInitEnv()
      .then((res) => {
        return sendRequest(res)
      })
      .then((res) => {
        if (res != undefined && res != null) {
          message.data = res
          resovle(message)
        } else {
          message.returnCode = -2
          message.returnText = "未能请求到数据"
          resovle(message)
        }


      })
      .catch((e) => {
        reject(e)
      })



  })//end main return promise







}