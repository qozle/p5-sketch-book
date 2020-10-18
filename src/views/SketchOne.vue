<template>
  <div class="sketchOne">
    <p>
      This is just a simple sketch of some rain.
    </p>
    <div id="p5canvas">
    </div>
  </div>
</template>

<script>
  export default {
    name: "SketchOne",
    mounted() {
      const script = function(p5) {


        class Drop {
          constructor(posX, posY, width, height) {
            this.posX = posX || Math.floor(Math.random() * p5.width);
            this.posY = posY || Math.floor(Math.random() * p5.height);
            this.width = width || Math.floor(Math.random() * 4) + 1;
            this.height = height || Math.floor(Math.random() * 5) + 5;
            this.speed = Math.floor(Math.random() * 10);
            this.accel = .2
            this.curve = .01
          }
        }

        var dropList = [];

        p5.windowResized = () => {
          p5.resizeCanvas(document.getElementById("p5canvas").getBoundingClientRect().width, document.getElementById("p5canvas").getBoundingClientRect().height);
        }
        p5.setup = () => {

          //  Add bodies to the world here


          var canvas = p5.createCanvas(document.getElementById("p5canvas").getBoundingClientRect().width, document.getElementById("p5canvas").getBoundingClientRect().height);
          canvas.parent("p5canvas");
          for (var i = 0; i < 100; i++) {
            dropList.push(new Drop())
          }



          //  Draw
          dropList.forEach((drop) => {
            p5.ellipse(drop.posX, drop.posY, drop.width, drop.height);
          });
        };

        p5.draw = () => {




          //  Draw
          p5.background(0);
          //          const degree = p5.frameCount * 3;
          //          const y = p5.sin(p5.radians(degree)) * 50;
          //          p5.push();
          //          p5.translate(0, p5.height / 2);
          //          p5.ellipse(posX, y, 10, 50);
          //          p5.pop();
          dropList.forEach((drop) => {
            p5.ellipse(drop.posX, drop.posY, drop.width, drop.height);
            drop.posY += drop.speed
            drop.speed += drop.accel
            drop.accel += drop.curve
            if (drop.posY > p5.height) {
              drop.posY = 0;
              drop.speed = Math.floor(Math.random() * 10);
              drop.accel = .2;
              drop.curve = .01;
              drop.posX = Math.floor(Math.random() * p5.width);

            }
          });
        };
      };

      const P5 = require("p5");
      new P5(script);
    }
  };

</script>

<style scoped>
  #p5canvas {
    height: 80vh;
    max-height: 80vh
  }

</style>
