// 云函数入口文件
const cloud = require('wx-server-sdk')

//dev env
//cloud.init()

//prod env

cloud.init({
  env: "asd-smart-cloud-k2u5e"
}) 



// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  
  var resdata=null;
  var deptbaseinfo = [{
    deptinfo: null,
    roleinfo: null
  }]
/*
  new Promise(function(resolve, reject) {

  }).then((data) => {
     envstring = cloud.callFunction({
      name: 'getenvstring',
      data: {},
      success: function(res) {
        resolve(res)
      },

      fail: function(err) {
        reject(err)
      }


    })
  }, (err) => {
    return Promise.reject(err)
  })

*/

   
  //开发环境
  const db = cloud.database(
    {
      env: "asd-smart-cloud-dev-kwtq8"
    }
  )
  try{
  var roles =await db.collection('roleinfo').get()
  var depts = await db.collection('deptinfo').get()
  }catch(err)
  {
    return Promise.reject(err);
  }
  /*
  db.collection('roleinfo').where({roleid:1}).get({
    success: function (res) {
      deptbaseinfo.roleinfo = res.data
      resdata = res.data;
      result=res;
      console.log(res);
    },
    fail: function (res) {
     return Promise.reject(err)
    }
  })*/
/*
  new Promise((resolve, reject) => {
    db.collection("roleinfo").get({
      success: function(res) {
        resovle(res)
      },
      fail: function(res) {
        reject(err)
      }
    })
  }).then((res) => {
    deptbaseinfo.roleinfo=res.data
    resdata= res.data;
  }, (err) => {
     return Promise.reject(err)
  })
/*

  /*
    db.collection("deptinfo").get({
      success: function (res) {
        deptbaseinfo.deptinfo= res.data;
      },
      fail: function (res) {
        console.log(err);
        return Promise.reject( err);
      }
    })
  */

  return {
    deptinfo:depts,
    roleinfo:roles
  }
}