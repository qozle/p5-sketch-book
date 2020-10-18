<template>
  <div id="sketchDiv" class="sketchThree">
    <div id="p5canvas">
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    components: {},
    mounted() {
      const script = (p5)=>{
        
        p5.setup = ()=>{
          
        }
        
        p5.draw = ()=> {
          
        }
      }
      
      const P5 = require("p5");
      new P5(script);
    }
  }

</script>

<style>

</style>
