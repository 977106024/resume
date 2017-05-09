<template>
  <div id="resumeEditor">
    <nav>
      <ol>
        <li v-for="(item,index) in resumeConfig" @click="selected = item.field" :class="{active: item.field === selected}">
          <svg class="icon">
            <use :xlink:href="`#icon-${item.icon}`"></use>
          </svg>
        </li>
      </ol>
    </nav>
    <ol class="panels">
      <li v-for="item in resumeConfig" v-show="item.field === selected">
        <div v-if="item.type === 'array'">
          <div class="subItem" v-for="(subitem,i) in resume[item.field]">

            <div class="removeItem" @click="removeItem(item.field,i)"></div>
            <div class="resume-field" v-for="(value,key) in subitem">
              <label> {{key}} </label>
              <!--<input type="text" :value="value" v-model="subitem[key]">-->
              <input type="text" :value="value" @input="changeResumeField(`${item.field}.${i}.${key}`,$event.target.value)">
            </div>
            <hr>
          </div>
          <div class="addItem" @click="addItem(item.field)"></div>
        </div>
        <div v-else class="resume-field" v-for="(value,key) in resume[item.field]">
          <label> {{key}} </label>
          <!--<input type="text" v-model="resume[item.field][key]">-->
          <input type="text" :value="value" @input="changeResumeField(`${item.field}.${key}`,$event.target.value)">
        </div>
      </li>
    </ol>
  </div>
</template>
<script type="text/ecmascript-6">

  export default{
    name:'ResumeEditor',

    computed: {

      selected: {
        get(){
          return this.$store.state.selected
        },
        set(value){
          return this.$store.commit('switchTab', value)//提交
        }
      },
      resume(){
        return this.$store.state.resume
      },
      resumeConfig(){
          return this.$store.state.resumeConfig
      }
    },
    methods:{
//       changeResumeField(field,subfield,value){
       changeResumeField(path,value){
           this.$store.commit('updateResume',{
//               field,
//               subfield,
               path,
               value
           })
       },
       addItem(field){
          this.$store.commit('addItem',field)
       },
       removeItem(field,index){
          this.$store.commit('removeItem',{field,index})
       }
    },
  }
</script>

<style lang="scss" scoped>
  #resumeEditor{
    background:#ffffff;
    box-shadow:0 1px 3px 0 rgba(0,0,0,0.25);
    display: flex;
    flex-direction: row;
    overflow: auto;
    > nav{
        width: 80px;
        background: black;
        color: white;
        > ol {
          > li{
            height: 48px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 16px;
            margin-bottom: 16px;
            &.active{
              background: white;
              color: black;
            }
          }
        }
    }
    > .panels{
      flex-grow: 1;
      > li {
        padding: 24px;
        .subItem{
          position:relative;
        }
      }
    }
    svg.icon{
      width: 24px; // 原设计稿 32px 不好看，改成 24px
      height: 24px;
    }

  }
  ol{
    list-style: none;
  }
  .resume-field{
    > label{
      display: block;
    }
    > input[type=text]{
      margin: 16px 0;
      border: 1px solid #ddd;
      box-shadow:inset 0 1px 3px 0 rgba(0,0,0,0.25);
      width: 100%;
      height: 40px;
      padding: 0 8px;
    }

  }
  hr{
    border: none;
    border-top: 1px solid #ddd;
    margin: 24px 0;
  }
  .addItem{
    width:30px;
    height:30px;
    border-radius:50%;
    border:2px solid #333;
    position: relative;
    margin:0 auto;
    &:before{
      content:'';
      width:20px;
      height:4px;
      background: #333;
      display:block;
      position:absolute;
      top:11px;
      left:3px;
      border-radius:3px;
    }
    &:after{
      content:'';
      width:4px;
      height:20px;
      background:#333;
      display:block;
      position:absolute;
      top:3px;
      left:11px;
      border-radius:3px;
    }
  }
  .subItem .removeItem {
    width: 20px;
    height: 20px;
    border: 2px solid red;
    border-radius: 50%;
    position: absolute;
    top: 0;
    right: 0;
    &:after {
       content: '';
       display: block;
       width: 10px;
       height: 2px;
       position: absolute;
       background: red;
       top: 7px;
       left: 3px;
    }

  }
</style>
