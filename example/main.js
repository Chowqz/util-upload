import Vue from 'vue'
import App from './App.vue'

var VConsole = require('vconsole');
var vConsole = new VConsole();

new Vue({
  el: '#app',
  render: h => h(App)
})
