<template>
  <div id="app">
    <input type="text" v-model="newTodo" @keyup.enter="addTodo" >
    <ul>
      <li v-for="todo in todoList">
        <input type="checkbox" v-model="todo.done"> {{todo.title}}

        <span v-if="todo.done">已完成</span>
        <span v-else>未完成</span>

        <button @click="removeTodo(todo)">x</button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        message:'',
        newTodo:'',
        todoList:[]
      }
    },
    created:function(){
      window.onbeforeunload = () =>{
        var dataString = JSON.stringify(this.todoList)
        window.localStorage.setItem('myTodo',dataString)
      }

      let oldDataString = window.localStorage.getItem('myTodo')
      let oldData = JSON.parse(oldDataString)
      this.todoList = oldData || []
    },
    methods:{
        addTodo:function(){
            this.todoList.push({
                title:this.newTodo,
                done:false
            })
          this.newTodo = ''
        },
        removeTodo:function(todo){
            var index = this.todoList.indexOf(todo)
            this.todoList.splice(index,1)
        }
    }
  }
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
