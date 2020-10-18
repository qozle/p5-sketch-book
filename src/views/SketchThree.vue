<template>
  <div id="sketchDiv" class="sketchThree">
    <p>
      This is the prototype for a digital Rube-Goldberg machine I'm making. Note that you can use the mouse to interact with the objects.  WIP.
    </p>
    <div id="p5canvas">
    </div>
  </div>
</template>

<script>
  export default {
    name: "SketchThree",
    mounted() {
      
      const script = (p5) => {
        //  P R E  S E T U P  F U N C T I O N 
        //  Import Matter.js, 
        const Matter = require("matter-js");
        //  Def a better way to do this.
        var Engine = Matter.Engine,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Body = Matter.Body,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          Vector = Matter.Vector,
          Composites = Matter.Composites,
          Render = Matter.Render

        var engine, world, bodies, body, mouseConstraint, render;
        var ground, wallL, wallT, wallR, circle1, mouse, cloth
        var maxSpeed = .008;


        //  Utility function for finding the width of a matter.js rect
        function rectW(matterRect) {
          var x1 = matterRect.vertices[0].x
          var x2 = matterRect.vertices[1].x
          return Math.abs(x2 - x1)
        }


        //  Utility function for finding the height of a matter.js rect
        function rectH(matterRect) {
          var y1 = matterRect.vertices[0].y
          var y2 = matterRect.vertices[3].y
          return Math.abs(y2 - y1);
        }


        p5.mousePressed = (e) => {
          e.preventDefault();
        }


        //  U P D A T E
        function update() {
          Engine.update(engine)
          //          if (p5.mouseIsPressed) {
          //            var dist = Vector.sub(cloth.bodies[0].position, mouse.position)
          //            dist = Vector.normalise(dist)
          //            var force = Vector.mult(dist, maxSpeed);
          //            Body.applyForce(cloth.bodies[0], cloth.bodies[0].position, force);
          //
          //          }
        }
        
        
        //  S H O W
        function show() {
          p5.clear()
          //  Draw ground

          p5.background("#0b0e0e")
          p5.stroke("black");
          p5.strokeWeight(2);
          p5.push();
          p5.fill("black")
          //  Draw ground
          p5.rect(ground.position.x, ground.position.y, rectW(ground), rectH(ground))
          //  Draw left wall
          p5.rect(wallL.position.x, wallL.position.y, rectW(wallL), rectH(wallL))
          //  Draw top wall
          p5.rect(wallT.position.x, wallT.position.y, rectW(wallT), rectH(wallT))
          //  Draw right wall
          p5.rect(wallR.position.x, wallR.position.y, rectW(wallR), rectH(wallR))
          p5.pop();
          //  Draw the circle
          p5.circle(circle1.position.x, circle1.position.y, circle1.circleRadius)
          //  Draw the cloth
          p5.push();
          p5.stroke("silver")
          cloth.constraints.forEach((con) => {
            p5.line(con.bodyA.position.x, con.bodyA.position.y, con.bodyB.position.x, con.bodyB.position.y)
          })
          p5.pop();

        }


        //  S E T U P  F U N C T I O N 
        p5.setup = () => {
          //  Make the canvas
          var canvas = p5.createCanvas(document.getElementById("p5canvas").getBoundingClientRect().width, document.getElementById("p5canvas").getBoundingClientRect().height);
          canvas.parent("p5canvas");

          //  Have the canvas resize cleanly
          p5.windowResized = () => {
            p5.resizeCanvas(document.getElementById("p5canvas").getBoundingClientRect().width, document.getElementById("p5canvas").getBoundingClientRect().height);
          }

          p5.rectMode(p5.CENTER);
          p5.ellipseMode(p5.RADIUS);
          p5.frameRate(60);


          engine = Engine.create();
          world = engine.world
          //          world.gravity.scale = .01;
          p5.rectMode(p5.CENTER);
          p5.ellipseMode(p5.RADIUS);
          //  Left Wall
          wallL = Bodies.rectangle(25, p5.canvas.height / 2, 50, p5.canvas.height, {
            isStatic: true
          })
          //  Right Wall
          wallR = Bodies.rectangle(p5.canvas.width - 25, p5.canvas.height / 2, 50, p5.canvas.height, {
            isStatic: true
          })
          //  Ground
          ground = Bodies.rectangle(p5.canvas.width / 2, p5.canvas.height - 25, p5.canvas.width, 50, {
            isStatic: true
          })
          //  Top Wall
          wallT = Bodies.rectangle(p5.canvas.width / 2, 25, p5.canvas.width, 50, {
            isStatic: true
          })
          //  Circle
          circle1 = Bodies.circle(p5.canvas.width / 2, p5.canvas.height / 2, 25, {
            restitution: .8
          });
          //  Let's make a cloth
          var group = Body.nextGroup(true)
          var partOptions = {
            friction: 0.00001,
            collisionFilter: {
              group: group
            },
            render: {
              visible: false
            }
          }
          var constOptions = {
            stiffness: 0.06
          }
          cloth = Composites.softBody(100, 100, 10, 10, 10, 10, false, 10, partOptions, constOptions)
          for (var i = 0; i < 20; i++) {
            cloth.bodies[i].isStatic = true;
          }
          console.log(cloth)

          //  Make a mouse element
          mouse = Mouse.create(canvas.elt)
          //  Make a mouse constraint
          var mConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
              stiffness: .98
            }
          })


          //  Populate the world
          World.add(world, [mConstraint, ground, wallL, wallT, wallR, circle1, cloth])

          ////////  Uncomment this to use the native renderer for debugging
          //          render = Render.create({
          //            canvas: p5.canvas,
          //            engine: engine,
          //            width: p5.canvas.width,
          //            height: p5.canvas.height
          //          })
          //          Render.world(render)
          //          Render.run(render)

          //        p5.resizeCanvas(document.getElementById("p5canvas").getBoundingClientRect().width, document.getElementById("p5canvas").getBoundingClientRect().height);

        }


        //  D R A W  F U N C T I O N
        p5.draw = () => {
          update()
          show()
        }

      }

      const P5 = require("p5");
      new P5(script);
    }
  }

</script>

<style scoped>
  #p5canvas {
    height: 80vh;
    max-height: 80vh
  }

</style>
