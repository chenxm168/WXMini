// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()


  var roleinfo = [{

    roleid: 0,
    roledesc: '操作员',
    _id: "roleid"
  }, {

    roleid: 1,
    roledesc: '领班',
    _id: "roleid"
  },
  {
    _id: "roleid",
    roleid: 2,
    roledesc: '组长'
  },
  {

    roleid: 6,
    roledesc: '工程师',
    _id: "roleid"
  },
  {

    roleid: 8,
    roledesc: '科长',
    _id: "roleid",
  },
  {

    roleid: 10,
    roledesc: '经理',
    _id: "roleid"
  },
  {

    roleid: 12,
    roledesc: '高级经理',
    _id: "roleid"
  },
  {

    roleid: 14,
    roledesc: '副部长',
    _id: "roleid",
  },
  {

    roleid: 16,
    roledesc: '部长',
    _id: "roleid",
  }


  ]

  const db = cloud.database({
    env: 'asd-smart-cloud-dev-kwtq8'
  });
  db.collection("roleinfo").add({

    data: roleinfo,
    success: function(res) {
      console.log(res);
    }
  })


}