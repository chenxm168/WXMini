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

   MakeTableData:function(arg)
   {
    let headers = arg.headers
    let datalist = arg.datalist
    let success = arg.success
    let fail = arg.fail
    let tablename = arg.tablename
    let list = datalist.DATA == undefined ? datalist : [datalist.DATA ]
    let rawlist = []
    let rows = []
    let header = []
    let attachseq=arg.attachseq
    let sumrqs = (arg.sumrequest==undefined||arg.sumrequest==null)? null:arg.sumrequest
    let sumflag=(arg.sumrequest==undefined||arg.sumrequest==null)? false:true
    console.log("Start makeTableData")
    console.log(headers)
    console.log(headers.length)
    
    // console.log(list)
    if(attachseq)
    {
      header.push({header:"序号",show:'Y',headerindex:'header0'})
    }
    for (let k = 0; k < headers.length; k++) {

      header.push({ header: headers[k].header.name, show: headers[k].header.show ,headerindex:k,unique:'header'+(k+1)})
    }
    for (let i = 0; i < list.length; i++) {
      let DATA = {}
      let row = []
      if(attachseq)
      {
        row.push({ name: 'Sequence', value: i+1, oth1: null, oth2: null, oth3: null, unique: tablename + 'cell-' + i + '-' + 0, index: [i, 0], show: 'Y' })
      }
      for (let k = 0; k < headers.length; k++) {

        let show = headers[k].header.show
        let data = list[i].DATA==undefined? list[i]:list[i].DATA

        let key = headers[k].header.valuename.length > 0 ? headers[k].header.valuename : headers[k].header.id
        let value = data[key] == undefined ? headers[k].header.defaulvalue : data[key]
        DATA[key] = value
        row.push({ name: key, value: value, oth1: null, oth2: null, oth3: null, unique: tablename + 'cell-' + i + '-' + (k+1), index: [i, k+1], show: show })
        if(sumflag)
        {
          for(let j=0;j<sumrqs.length;j++)
          {
            if(sumrqs[j].valuekey==key)
            {
              sumrqs[j].value=sumrqs[j].value+parseFloat(value);
            }
          }
        }

      }
      rawlist.push(DATA)
      rows.push({ row: row, oth1: null, oth2: null, oth3: null, unique: tablename + 'row' + i.toString(), index: i })
    }
    console.log(rawlist)
    console.log(rows)
    console.log(header)

    if (success != undefined && success != null) {
      success({ rawdata: rawlist, header: header, rows: rows,sums:sumflag?sumrqs:null })
    }
     

   },

   MesDatalist2RawData:function(arg)
   {

   },//end function
   
   getDistinctList:function(list,fn)
   {
     let rtn=[]
     list.forEach(el=>
      {
         let v=  fn(el)
         if(rtn.indexOf(v)<0)
         {
           rtn.push(v)
         }
      })
      return rtn
     

   },//end function

   FileerListData:function(list,fn)
   {
     let rtn=[]
     list.forEach(el=>
      {
        if(fn(el))
        {
          rtn.push(el)
        }

      })
      return rtn
   }
   
}