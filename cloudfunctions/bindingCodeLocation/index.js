// 云函数入口文件
const cloud = require('wx-server-sdk')

//dev env
cloud.init({
  env: "asd-smart-cloud-dev-kwtq8"
})

const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  return new Promise(function(resolve, reject) {
     var user=null
    var callLogin = async function() {
      var arg = {}
      if (event.data != undefined & event.data != null) {
        arg = event.data
        return await cloud.callFunction({
          name: 'login',
          data: event.data
        })
      } else {
        return await cloud.callFunction({
          name: 'login',
          data: arg
        })
      }

    } //end callLoging

    var callHasCodeId= async function()
    {
      /*
        if (event.codeid == undefined || event.codeid == null) 
          {
          return Promise.reject(new Error("Not codeid"))
          }else
          {
         return await db.collection("codelocation").where({
            codeid: event.codeid

          }).count()
          }*/

      if (event.codeurl != undefined && event.codeurl != null)
      {
        return await db.collection("codelocation").where(
          {
            codeurl: event.codeurl
          }
        ).remove()
           
        
      }else{
        return await db.collection("codelocation").where(
          {
            rodeid: event.codeid
          }
        ).remove()
       
      }


      
    }//end callHasCodeId



    var callUpdateLocation = async function(res) {
     

        
        
            if (res.total > 0) {
              let cmd = db.command
              //return await db.collection('codelocation').where(
              return db.collection('codelocation').where({
                codeid: cmd.eq(event.codeid)
              }).update({
                data: {
                  codeurl: event.codeurl,
                  
                  userid: user.userid,
                  verifyaccuracy: event.verifyaccuracy,
                  codepoint: event.point,
                  lasteventtime: new Date(),
                  page: event.page,
                  category: event.category,
                  verifyflag: true,
                  eqid: event.eqid,
                  args: event.args
                }
              })
            } else {

              return db.collection('codelocation').add({
                data: {
                  codeurl:event.codeurl,
                  codeid: event.codeid,
                  userid: user.userid,
                  verifyaccuracy:event.verifyaccuracy,
                  codepoint:event.point,
                  lasteventtime: new Date(),
                  page:event.page,
                  category:event.category,
                  verifyflag:true,
                  eqid:event.eqid,
                  args:event.args
                }
              })
            }

          


    } //end callUpdateLocation

    callLogin(event.data)
      .then((res) => {
        switch (res.result.loginReturnCode) {
          case -1:
            {
              return Promise.reject(new Error("用户待审核"))
              break
            }
          case -2:
            {
              return Promise.reject(new Error("被禁止使用"))
              break
            }

          default:
            {
              user = res.result.rows[0]
              let data = {
                'user': res.result.rows[0]
              }
              return Promise.resolve(data)
              break
            }
        }

      })
      .then((res)=>
      {
         return callHasCodeId()
      })
      .then((res) => {
        return callUpdateLocation(0)
      })
      .then((res) => {
        if(res.total!=undefined&&res.total!=null)
        {
          var rtn = { bindingReturnCode:res.total} 
          resolve(rtn)
        }
        else
          {
          //var rtn = { bindingReturnCode: res.stats.updated }
          rtn = { bindingReturnCode: 1 }
          resolve(rtn)
          }
      })
      .catch(
        (err) => {
          reject(err)
        }
      )



  }) //end return new promise

  /*
    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
    */
}