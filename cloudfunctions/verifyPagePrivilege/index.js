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

//cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {

  var wxContext = null
  return new Promise(function(resovle, reject) {

    var message = {
      data: null,
      env: null,
      returnCode: null,
      returnText: null

    }

    var isProd = false
    message.env=((event.env!=null&&event.env!=null)? event.env:"dev")

    let callInitEnv = async function() {
      if (event.env != undefined && event.env != null) {
        console.log(envSet[event.env])
        cloud.init(envSet[event.env])
        //message.env = envSet[event.env]
        isProd = (event.env == "prod") ? true : false
        wxContext = cloud.getWXContext()
        return Promise.resolve(null)
      } else {
        cloud.init(envSet["dev"])
        // message.env = envSet["dev"]
        wxContext = cloud.getWXContext()
        return Promise.resolve(null)
      }
    } //end callInitEnv 

    var callChcekBingdingCodePrivilege = async function(user) {
      if (user.appadmin || (!isProd)) {
        message.returnCode = 0,
          message.returnText = "Success",
          message.data = {
            userinfo: user
          }
        return Promise.resolve(message)
      } else {
        message.returnCode = -10,
          message.returnText = "Success",
          message.data = {
            userinfo: user
          }
        return Promise.resolve(message)
      }
    } //end callChcekBingdingCodePrivilege




    var callCheckdailyCheckPrivilege = async function(user) {

      // TODO

      return new Promise(function(resolve1, reject1) {

        let call = async function(user) {

        
          let db = cloud.database()
          let page = event.page
          let eqid = event.eqid
          // if (eqid.length>7)
          if(eqid.length>=7)
          {
            /*
            let fab= eqid.substring(0,2)
            let eqtype = eqid.substring(2,5)
            let eqnum = eqid.substring(5, 7)
            let str2 = "(^" + fab + ")|(^" +fab+ eqtype + ")|(^" +fab+eqtype+ eqnum + ")"   */  

            let fab = eqid.substring(0, 2)
            let eqtype = eqid.substring(2, 5)
            let eqnum = eqid.substring(5, 7)
            let str2 = "(^" + fab + "$)|(^" + fab + eqtype + "$)|(^" + fab + eqtype + eqnum + ")" 
            
            /*
            let cmd = db.command
            let peqid= eqid.substring(0,8)
            return await db.collection("pageprivilege").where({
              page: page,
              eqid: cmd.eq(eqid).or(cmd.eq(peqid)),
              userid: user.userid,
            }).get()   */
            
            return await db.collection("pageprivilege").where({
              page: page,
              eqid:  db.RegExp({
                regexp: str2,
                options: 'i',
              }),
              userid: user.userid,
            }).get() 

          }else
          {
            return await db.collection("pageprivilege").where({
              page: page,
              eqid: eqid,
              userid: user.userid,
            }).get() 
          }
          
          

        } //end call function

        let checkPrivilegeFromDb = async function(user) {
          return new Promise(function(resolve2, reject2) {

           // if (user.appadmin || (!isProd)) {
              if (user.appadmin ) {
              message.returnCode = 0,
                message.returnText = "Success",
                message.data = {
                  userinfo: user
                }
              resolve2(message)
            } else {

              call(user)
                .then((res) => {

                  if (res.data.length > 0) {
                    message.returnCode = 0,
                      message.returnText = "Success",
                      message.data = {
                        userinfo: user
                      }
                    resolve2(message)

                  } else {
                    message.returnCode = -10,
                      message.returnText = "未被授权",
                      message.data = {
                        userinfo: user
                      }

                    resolve2(message)
                  }



                })
                .catch((e) => {
                  reject2(e)
                })
            }




          }) //end return promise

        } //end checkPrivilegeFromDb 
       
        checkPrivilegeFromDb(user)
        .then((res)=>
        {
           resolve1(res)
        }
        )
        .catch((e)=>
        {
          reject1(e)
        })


      })
    } //end callCheckdailyCheckPrivilege

    callInitEnv()
      .then((res) => {
        switch (event.page) {
          case "bindingCode":
            {
              return callChcekBingdingCodePrivilege(event.userinfo)
              break
            }

          case "dailyCheck":
            {
              return callCheckdailyCheckPrivilege(event.userinfo)
              break
            }



        }

      })
      .then((res) => {
        resovle(res)

      })
      .catch((e) => {
        reject(e)
      })





  }) //end return new promise


}