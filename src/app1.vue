<template>
  <div id="app">
    <section id="signInAndSignUp" v-if="!currentUser">
      <div>
        <label><input type="radio" name="type" v-model="actionType" value="signUp">注册</label>
        <label><input type="radio" name="type" v-model="actionType" value="login">登入</label>
      </div>
      <div class="signUp" v-if="actionType=='signUp'">
        <form @submit.prevent="signUp">
          <div class="formRow">
            用户名 <input type="text" v-model="formData.username">
          </div>
          <div class="formRow">
            密码 <input type="password" v-model="formData.password">
          </div>
          <div class="formActions">
            <input type="submit" value="注册">
          </div>
        </form>
      </div>
      <div class="login" v-if="actionType=='login'">
        <form @submit.prevent="login">
          <div class="formRow">
            用户名 <input type="text" v-model="formData.username">
          </div>
          <div class="formRow">
            密码<input type="password" v-model="formData.password">
          </div>
          <div class="formActions">
            <input type="submit" value="登入">
          </div>
        </form>
      </div>
    </section>

    <section id="todo" v-if="currentUser">
      <button @click="logout">登出</button>
      <div class="newTask">
        <input type="text" v-model="newTodo" @keyup.enter="addTodo" >
      </div>
      <ol class="todos">
        <li v-for="todo in todoList">
          <input type="checkbox" v-model="todo.done" @click="updateTodos"> {{todo.title}}

          <span v-if="todo.done">已完成</span>
          <span v-else>未完成</span>

          <button @click="removeTodo(todo)">x</button>
        </li>
      </ol>
    </section>
  </div>
</template>


<script>
  import AV from 'leancloud-storage'
  var APP_ID = 'TQIbVYJrxO8HrP3NN0bxEitb-gzGzoHsz';
  var APP_KEY = 'hHF0SNycVLLQ8UnPSJo32r1d';
  AV.init({
    appId: APP_ID,
    appKey: APP_KEY
  });

  export default {
    data () {
      return {
        newTodo:'',
        todoList:[],
        actionType:'signUp',
        formData:{
            username:'',
            password:''
        },
        currentUser:null
      }
    },
    created:function(){

      this.currentUser = this.getCurrentUser();
      this.fetchTodos()//读取todos
    },
    methods:{
      fetchTodos:function(){
        if(this.currentUser){
          var query = new AV.Query('AllTodos')
          query.find()
            .then((todos) => {
                  let avAllTodos = todos[0]
                  let id = avAllTodos.id
                  this.todoList = JSON.parse(avAllTodos.attributes.content) //解析内容
                  this.todoList.id = id  //给数组设置id

            },function(error){
              console.log(error)
            })
        }
      },
      updateTodos:function(){
        let dataString = JSON.stringify(this.todoList)
        let avTodos = AV.Object.createWithoutData('AllTodos',this.todoList.id)//更新对象

        avTodos.set('content',dataString)
        avTodos.save().then(() => {
            console.log('更新成功')
        })
      },
      saveTodos:function(){
        var dataString = JSON.stringify(this.todoList)

        var AVTodos = AV.Object.extend('AllTodos')
        var avTodos = new AVTodos()

        var acl = new AV.ACL()
        acl.setReadAccess(AV.User.current(),true)//只有这个用户能读
        acl.setWriteAccess(AV.User.current(),true)//只有这个用户能写

        avTodos.set('content',dataString)
        avTodos.setACL(acl) //设置访问控制 访问服务器？
        avTodos.save().then((todo) =>{
            this.todoList.id = todo.id
            console.log('保存成功')
        },function(error){
            alert('保存失败')
        })
      },
      saveOrUpdateTodos:function(){
        if(this.todoList.id){
            this.updateTodos()
        }else{
            this.saveTodos()
        }
      },
      addTodo:function(){
        this.todoList.push({
          title:this.newTodo,
          done:false
        })
        this.newTodo = ''
        this.saveOrUpdateTodos()
      },
      removeTodo:function(todo){
        var index = this.todoList.indexOf(todo)
        this.todoList.splice(index,1)
        this.saveOrUpdateTodos()//不能调用saveTodos 了
      },
      signUp:function(){
          let user = new AV.User();
          user.setUsername(this.formData.username);
          user.setPassword(this.formData.password);
          user.signUp().then(loginedUser => {
              this.currentUser = this.getCurrentUser()
          },function(error){
              console.log('注册失败')
          });
      },
      login:function(){
        AV.User.logIn(this.formData.username,this.formData.password).then(loginedUser => {
          this.currentUser = this.getCurrentUser()
          this.fetchTodos()
        },function(error){
          alert('登录失败')
        })
      },
      getCurrentUser:function(){//获取当前用户
        let current = AV.User.current()
        if(current){
          let {id,createdAt,attributes:{username}} = current
          return {id,createdAt,attributes:{username}}
        }else{
            return null
        }

      },
      logout:function(){
          AV.User.logOut()//登出
          this.currentUser = null
          window.location.reload() //刷新当前页面
      }
    }

  }
</script>

<style>
  .login{
    margin-top:20px;
  }
  #todo{
    margin-top:20px;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
