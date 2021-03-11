module.exports = {
  DataList2List: function (arg) {
    let complete = arg.complete
    let datalist = arg.datalist
    let valuename = arg.valuename
    let rtnlist = []
    let list = (datalist.DATA == undefined && datalist.length > 1) ? datalist : [{ 'DATA': datalist.DATA }]
    for (let i = 0; i < list.length; i++) {
      rtnlist.push(list[i].DATA[valuename])
    }
    if (complete != undefined && complete != null) {
      complete(rtnlist)
    } else {
      return new Promise(function (resolve, reject) {
        resolve(rtnlist)
      })
    }
  }, //end function

  MakeTableData: function (arg) {
    let headers = arg.headers
    let datalist = arg.datalist
    let success = arg.success
    let fail = arg.fail
    let tablename = arg.tablename
    let list = datalist.DATA == undefined ? datalist : [datalist.DATA]
    let rawlist = []
    let rows = []
    let header = []
    let attachseq = arg.attachseq
    let sumrqs = (arg.sumrequest == undefined || arg.sumrequest == null) ? null : arg.sumrequest
    let sumflag = (arg.sumrequest == undefined || arg.sumrequest == null) ? false : true
    let warning = arg.warning
    let attachcolor=arg.attachcolor
    console.log("Start makeTableData")
    console.log(headers)
    console.log(headers.length)

    // console.log(list)
    if (attachseq) {
      header.push({ header: "序号", show: 'Y', headerindex: 'header0' })
    }
    for (let k = 0; k < headers.length; k++) {

      header.push({ header: headers[k].header.name, show: headers[k].header.show, headerindex: k, unique: 'header' + (k + 1) })
    }
    for (let i = 0; i < list.length; i++) {
      let DATA = {}
      let row = []
      if (attachseq) {
        row.push({ name: 'Sequence', value: i + 1, oth1: null, oth2: null, oth3: null, unique: tablename + 'cell-' + i + '-' + 0, index: [i, 0], show: 'Y' })
      }
      for (let k = 0; k < headers.length; k++) {

        let show = headers[k].header.show
        let data = list[i].DATA == undefined ? list[i] : list[i].DATA

        let key = headers[k].header.valuename.length > 0 ? headers[k].header.valuename : headers[k].header.id
        let value = data[key] == undefined ? headers[k].header.defaulvalue : data[key]
        DATA[key] = value
        row.push({ name: key, value: value, oth1: null, oth2: null, oth3: null, unique: tablename + 'cell-' + i + '-' + (k + 1), index: [i, k + 1], show: show, warning: false })
        if (sumflag) {
          for (let j = 0; j < sumrqs.length; j++) {
            if (sumrqs[j].valuekey == key) {
              sumrqs[j].value = sumrqs[j].value + parseFloat(value);
            }
          }
        }

      }
      rawlist.push(DATA)
      // console.log('warning:',warning)
       
      let rw={ row: row, oth1: null, oth2: null, oth3: null, unique: tablename + 'row' + i.toString(), index: i, warningflag: false,firebrickflag:false,slateblueflag:false,purpleflag:false }
      if(attachcolor==undefined||attachcolor==null)
      {
        rows.push(rw)
      }
      else
      {
      let tr = (list[i].DATA != undefined && list[i] != null) ? list[i].DATA : list[i]
       rw.warningflag= (attachcolor==undefined||attachcolor==null||attachcolor.warning==undefined||attachcolor.warning==null)? false: this.CompareTo({target:tr[attachcolor.warning.valuekey],op:attachcolor.warning.op,value:attachcolor.warning.value})
       let tc= attachcolor
       rw.firebrickflag=(tc.firebrick==undefined||tc.firebrick==null)?false:this.CompareTo({target:tr[tc.firebrick.valuekey],op:tc.firebrick.op,value:tc.firebrick.value})

       rw.slateblueflag=(tc.slateblue==undefined||tc.slateblue==null)?false:this.CompareTo({target:tr[tc.slateblue.valuekey],op:tc.slateblue.op,value:tc.slateblue.value})

       rw.purpleflag=(tc.purple==undefined||tc.purple==null)?false:this.CompareTo({target:tr[tc.purple.valuekey],op:tc.purple.op,value:tc.purple.value})
       
       
       rows.push(rw)
      }
      /*
      if (warning != undefined && warning != null) {
        let warningflag = false
        let tr = (list[i].DATA != undefined && list[i] != null) ? list[i].DATA : list[i]
        console.log('rawdata holdstate:', tr[warning.valuekey])
        switch (warning.op) {
          case 'gt':
            {
              break
            }

          default:
            {
              if (tr[warning.valuekey] == warning.value) {
                warningflag = true

              }
              break
            }
        }
        rows.push({ row: row, oth1: null, oth2: null, oth3: null, unique: tablename + 'row' + i.toString(), index: i, warningflag: warningflag })

      } else {
        rows.push({ row: row, oth1: null, oth2: null, oth3: null, unique: tablename + 'row' + i.toString(), index: i, warningflag: false })
      }*/

    }
    console.log(rawlist)
    console.log(rows)
    console.log(header)

    if (success != undefined && success != null) {
      success({ rawdata: rawlist, header: header, rows: rows, sums: sumflag ? sumrqs : null })
    }


  },

  MesDatalist2RawData: function (arg) {

  },//end function

  getDistinctList: function (list, fn) {
    let rtn = []
    list.forEach(el => {
      let v = fn(el)
      if (rtn.indexOf(v) < 0) {
        rtn.push(v)
      }
    })
    return rtn


  },//end function

  FilterListData: function (list, fn) {
    let rtn = []
    list.forEach(el => {
      if (fn(el)) {
        rtn.push(el)
      }

    })
    return rtn
  },//end function

  CompareTo: function (arg) {
    let rtn = false
    let target = arg.target
    let op = arg.ope
    let valuekey = arg.valuekey
    let value = arg.value
    let type = arg.type

    if (target == undefined || target == null || value == undefined || value == undefined) {
      return false
    }
    else {

      switch (op) {
        case 'lt':
          {
            let t= (typeof(target)=='number')? target:parseFloat(target)
            let v= (typeof(value)=='number')? value:parseFloat(value)
            if(t<v)
            {
              rtn=true
            }
            break
          }
        case 'lte':
          {
            let t= (typeof(target)=='number')? target:parseFloat(target)
            let v= (typeof(value)=='number')? value:parseFloat(value)
            if(t<=v)
            {
              rtn=true
            }
            break
          }
        case 'gt':
          {
            let t= (typeof(target)=='number')? target:parseFloat(target)
            let v= (typeof(value)=='number')? value:parseFloat(value)
            if(t>v)
            {
              rtn=true
            }
            break
          }
        case 'gte':
          {
            let t= (typeof(target)=='number')? target:parseFloat(target)
            let v= (typeof(value)=='number')? value:parseFloat(value)
            if(t>=v)
            {
              rtn=true
            }
            break
          }
        case 'in':
          {
            if(value.length!=undefined&&value.length!=null)
            {
              if(value.indexOf(target)>=0)
              {
                rtn=true
              }
            }
            break
          }
        case 'nin':
          {
            if(value.length!=undefined&&value.length!=null)
            {
              if(value.indexOf(target)<0)
              {
                rtn=true
              }
            }
            break
          }
        case 'neq':
          {
            if (target != value) {
              rtn = true
            }
            break
          }
          //数字区间比较
        case 'innum':
          {
            if(value.length!=undefined&&value.length!=null&&value.length>=2)
            {
              if(target>=value[0]&&target<=value[1])
              {
                rtn=true
              }
            }

            break
          }


        default:
          {
            if (target == value) {
              rtn = true
            }
            break
          }
      }//end switch 
    }
    return rtn;

  },//end function

}