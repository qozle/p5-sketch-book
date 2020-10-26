import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Matter from "matter-js"
import P5 from "p5"
import mw from "./maxWrappers.js"


Vue.config.productionTip = false;
//  This insures that Matter, p5, and mw are imported once and then
//  set as global values.  They can then be accessed from all sketches
//  so they don't have to be reloaded / imported for every sketch.
//  It's just important that every sketch has a way to clear the 
//  matter-js engine / world, and clear the canvas (or at least stop the
//  draw loop)
Vue.prototype.$Matter = Matter
Vue.prototype.$P5 = P5
Vue.prototype.$mw = mw

Vue.prototype.a = "123"

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
