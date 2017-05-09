// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App2'
import router from './router'
import AV from 'leancloud-storage'

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

var APP_ID = 'TQIbVYJrxO8HrP3NN0bxEitb-gzGzoHsz';
var APP_KEY = 'hHF0SNycVLLQ8UnPSJo32r1d';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

// var TestObject = AV.Object.extend('TestObject');
// var testObject = new TestObject();
// testObject.save({
//   words: 'Hello World!'
// }).then(function(object) {
//   alert('LeanCloud Rocks!');
// })
