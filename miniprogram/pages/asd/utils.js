module.exports={
   DataList2List:function(arg)
   {
     let complete=arg.complete
     let datalist= arg.datalist
     let valuename=arg.valuename
     let rtnlist=[]
     let list= (datalist.DATA==undefined&&datalist.length>1) ? datalist: [{'DATA':datalist.DATA}]
     for(let i=0;i<list.length;i++)
     {
       rtnlist.push(list[i].DATA[valuename])  
     }
     if(complete!=undefined&&complete!=null)
     {
       complete(rtnlist)
     }else
     {
       return new Promise(function(resolve,reject)
       {
         resolve(rtnlist)
       })
     }
   }, //end function
   
   getDistinctList:function(arg)
   {
     

   },//end function
   
}