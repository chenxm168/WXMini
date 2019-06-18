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
  var wxContext = null
  return new Promise(function(resolve, reject) {
    var message = {
      data: null,
      env: null,
      returnCode: null,
      returnText: null

    }
    var openid=null
    var isProd = false
    message.env = ((event.env != null && event.env != null) ? event.env : "dev")

    let callInitEnv = async function() {
      if (event.env != undefined && event.env != null) {
        console.log(envSet[event.env])
        cloud.init(envSet[event.env])
        //message.env = envSet[event.env]
        isProd = (event.env == "prod") ? true : false
        wxContext = cloud.getWXContext()
        openid= wxContext.openid
        return Promise.resolve(null)
      } else {
        cloud.init(envSet["dev"])
        // message.env = envSet["dev"]
        wxContext = cloud.getWXContext()
        openid = wxContext.openid
        return Promise.resolve(null)
      }
    } //end callInitEnv 



    var codeid = null
    var codeurl = null

    var callGetCodePiontLocationFormDb = async function() {
      let db = cloud.database()
      if (event.codeid != undefined && event.codeid != null) {
        codeid = event.codeid;
        return await db.collection("codelocation").where({
          'codeid': codeid
        }).get()
      } else {
        var codeurl = event.codeurl
        return await db.collection("codelocation").where({
          'codeurl': codeurl
        }).get()

      }



    }

    var callCalculateLocation = async function(bindLocation) {
      try {
        var crrLat = event.codepoint.latitude
        var crrLng = event.codepoint.longitude
        var bindLat = bindLocation.codepoint.latitude
        var bingLng = bindLocation.codepoint.longitude
        var accuracy = bindLocation.codepoint.accuracy
        var verifyaccuracy = bindLocation.verifyaccuracy // + bindLocation.verifyaccuracy 
        var radLat1 = crrLat * Math.PI / 180.0;
        var radLat2 = bindLat * Math.PI / 180.0
        var a = radLat1 - radLat2;
        var b = crrLng * Math.PI / 180.0 - bingLng * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;
        // s = Math.round(s * 10000) / 10000; 
        s = Math.round(s * 10000 * 1000) / 10000;
        //to  
        /*
        var verifyMessage = {
          returnCode: -1,
          defValue: 0,
          'verifyaccuracy': verifyaccuracy,
          codeInfo: codeinfo
        }*/
         
         

        if (s > verifyaccuracy) {
          message.returnCode=-1,
          message.returnText="位置信息验证失败"
          message.data={
            codeInfo:codeinfo,
            defValue:s
          }
          
          return Promise.resolve(message)
        } else {
          message.returnCode = 0,
          message.data = {
            codeInfo: codeinfo,
            defValue: s
          }

          
          return Promise.resolve(message)
        }

      } catch (e) {
        return Promise.reject(new Error(e))
      }
    } //end function 

    callCheckInputArgs = async function() {
      // if (event.codeid == undefined || event.codeid == null || event.codepoint == undefined || event.codepoint == null) 
      if ((event.codeid == undefined || event.codeid == null) && (event.codeurl == undefined || event.codeurl == null)) {
        return Promise.reject(new Error('Not input codeid codeurl or codepoint'))
      } else {
        if (event.codeid != undefined && event.codeid != null) {
          codeid = event.codeid
          return Promise.resolve()
        } else {
          codeurl = event.codeurl
          return Promise.resolve()
        }
      }
    }


    callInitEnv()
      .then((res) => {
        return callCheckInputArgs()
      })
      .then((res) => {
        return callGetCodePiontLocationFormDb()
      })
      .then((rs) => {
        if (rs == undefined || rs == null || rs.data == undefined || rs.data == null) {
          return Promise.reject(new Error("Not Binding Code Location"))
        } else {
          if (rs.data.length > 0) {
              message.returnCode=0



            var location = rs.data[0]
            codeinfo = rs.data[0]
            if (!codeinfo.verifyflag) {
              /*
              var verifyMessage = {
                returnCode: 1,
                defValue: 0,
                'verifyAccuracy': 0,
                codeInfo: codeinfo
              } */
               message.data={
                 defValue: 0,
                 codeinfo:codeinfo
               }

              return Promise.resolve(message)
            } else {
              if (event.codepoint == undefined || event.codepoint == null) {
                return Promise.reject(new Error('Not input codeid or codepoint'))
              } else {
                return callCalculateLocation(location)
              }
            }
          } else {
            return Promise.reject(new Error("Not Binding Code Location"))
          }

        }

      })
      .then((rs) => {
        resolve(rs)
      })
      .catch((e) => {
        reject(e)
      })





  }) //end return Promise 

  /* 
    return { 
      event, 
      openid: wxContext.OPENID, 
      appid: wxContext.APPID, 
      unionid: wxContext.UNIONID, 
    }*/
}