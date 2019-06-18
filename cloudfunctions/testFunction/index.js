// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let eqid = (event.eqid==undefined||event.eqid==null)? "A1CVD01" :event.eqid
  db= cloud.database()

  let fab = eqid.substring(0, 2)
  let eqtype = eqid.substring(2, 5)
  let eqnum = eqid.substring(5, 7)
  let str2 = "(^" + fab + "$)|(^" + fab + eqtype + "$)|(^" + fab + eqtype + eqnum + ")"
  console.log(str2)
  let str = "(^A1)|(^A1CVD)|(^A1CVD01)"
  let reg = new RegExp(str2)

  let rs = reg.test("A1CDV")
  console.log(rs)

  
  console.log(str2)
  let call = async function(){

   return await db.collection("pageprivilege").where(
    {
      userid: "99052728",
      eqid: new db.RegExp(
        {
          regexp: str2,
          options: 'i'
        }
      ),
      page: "dailyCheck"
    }
  ).get()}

  call()
  .then((res)=>
  {
     console.log(res)
  })



  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}