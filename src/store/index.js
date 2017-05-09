
import Vuex from 'vuex'
import Vue from 'vue' // 思考：在多个文件 import vue ，会怎样
import objectPath from "object-path"

Vue.use(Vuex) // 不写这句话浏览器控制台就会报错，于是我就写了


export default new Vuex.Store({
  state:{
    count:0,
    selected: 'profile',
    user:{
      id:'',
      username:''
    },
    resumeConfig: [
      {field:'profile',icon:'id',keys:['名称','职位','城市','生日','性别']},
      {field:'workHistory',icon:'work',type:'array',keys:['工作单位','详情']},
      {field:'education',icon:'book',type:'array',keys:['学校','详情']},
      {field:'projects',icon:'heart',type:'array',keys:['项目名称','详情']},
      {field:'awards',icon:'cup',type:'array',keys:['奖项','详情']},
      {field:'contacts',icon:'phone',type:'array',keys:['联系方式','qq']},
    ],
    resume: {

      // profile:{},
      // workHistory:[],
      // education:[],
      // projects:[],
      // awards:[],
      // contacts:[],
    }
  },
  mutations:{
    initState(state,payload){
      state.resumeConfig.map((item)=>{
        if(item.type === 'array'){
          Vue.set(state.resume,item.field,[])
        }else{
          Vue.set(state.resume,item.field,{})
          item.keys.map((key)=>{
            Vue.set(state.resume[item.field],key,'')
          })
        }
      })
      Object.assign(state,payload)  //拷贝到目标对象state上，相同的属性会覆盖？
    },
    switchTab(state,payload){
      state.selected = payload
      localStorage.setItem('state',JSON.stringify(state))
    },
    updateResume(state,{path,value}){//如果value发生变化 就进行赋值/更新
      objectPath.set(state.resume,path,value)
      localStorage.setItem('state',JSON.stringify(state))
    },
    setUser(state,payload){
      Object.assign(state.user,payload)
    },
    removeUser(state){
      state.user.id = ''
    },
    addItem(state,payload){
      state.resumeConfig.map(item=>{
        if(item.field === payload){
          var fieldKeys = item.keys
          var keysObj = {}
          fieldKeys.map(subItem=>{
            keysObj[subItem] = ''
          })
          state.resume[payload].push(keysObj)
        }
      })
    },
    removeItem(state,{field,index}){
      state.resume[field].splice(index,1)
    }
  }
})
