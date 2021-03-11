// pages/components/tableview.js
const util=require("../../utils")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    setting:Object,
    tableTitleContent:String,
    tabledata:Object,
   

  },

  /**
   * 组件的初始数据
   */
  data: {
    selectidx:null,
    rawdata:[],
    tablerows:[],
    header:[]


  },

  /**
   * 组件的方法列表
   */
  methods: {
    rowClick:function(res)
    {
      console.log(res)
      this.data.selectidx=res.currentTarget.dataset.index
      let idx=res.currentTarget.dataset.index
      this.setData(
        {
          selectidx:this.data.selectidx
        }
      )
      let detail={rowdata:this.data.rawdata[idx]}
      let option={bubbles: true}
      this.triggerEvent('rowtap',detail,option)
    }

  },
  observers:
  {
    'tabledata':function(tabledata)
    {
      this.data.selectidx=null
      if(tabledata!=undefined&&tabledata!=null)
      {
        let datalist= tabledata.datalist
        let headers=tabledata.headers
        let attachseq=tabledata.attachseq
      util.MakeTableData(
        {
          datalist:datalist,
          headers:headers,
          attachseq:attachseq,
          sumrequest:tabledata.sumrequest,
          attachcolor:tabledata.attachcolor,
          success:(res)=>
          {
            console.log(res)
            this.data.rawdata=res.rawdata,
            this.setData(
              {
                rows:res.rows,
                header:res.header,
                sums:res.sums,
                selectidx:null
              }
            )
          }
        }
      )
    } //end if
    else
    {
      this.setData(
        {
          rows:[],
          sums:null
        }
      )
    }

    }
  }
})
