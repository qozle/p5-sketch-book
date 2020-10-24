<template>
  <div id="sketchDiv" class="sketchTwo">
    <div id="p5canvasHolder">
    </div>
    <p>
      This is a prototype for something I'm making called "Goat-kicker", which is an inside joke between my girlfriend and I. Note that you can use the mouse to interact with the objects. WIP.
      <br>
      <br>
      Controls: "E" will launch the kicker, "F" will reset.
    </p>
  </div>
</template>

<script>
  const Matter = require("matter-js")
  var Bodies = Matter.Bodies,
    Body = Matter.Body,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Constraint = Matter.Constraint,
    Vector = Matter.Vector,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Events = Matter.Events,
    Common = Matter.Common
  const P5 = require("p5");
  var vm;


  export default {
    name: "SketchTwo",
    data() {
      return {
        Engine: Matter.Engine,
        World: Matter.World,
        engine: '',
        world: '',
        allSounds: [],
        P5: ''

      }
    },
    methods: {
      script: function(p5) {
        console.log("script has been run")
        var mw = require('../maxWrappers.js')(Matter, p5)

        //  P R E  S E T U P 
        var ground,
          goat,
          cliff,
          wallL,
          wallR,
          kicker,
          kickerRod,
          kickerBoot,
          kickerBootCon,
          kickerCon,
          kickerPin,
          mouse,
          mConstraint,
          showBox = true,
          initialPosition,
          splodeArray = [],
          goatImg,
          gibbs,
          hit1,
          hit2,
          splat,
          kickerGo,
          goatSounds = []



        //  These are some utility functions for getting random attributes
        const randomWidth = () => p5.random(0, p5.width - 50);
        const randomHeight = () => p5.random(0, p5.height - 50);
        const randomDiameter = () => p5.random(0, 50);
        const ranNum = () => Math.floor(p5.random(0, 4));
        const scaledWidth = () => document.getElementById("p5canvasHolder").getBoundingClientRect().width
        const scaledHeight = () => document.getElementById("p5canvasHolder").getBoundingClientRect().height


        //  Utility function for finding the width of a matter.js rect
        function rectW(matterRect) {
          return p5.dist(matterRect.vertices[0].x, matterRect.vertices[0].y, matterRect.vertices[1].x, matterRect.vertices[1].y)
        }


        //  Utility function for finding the height of a matter.js rect
        function rectH(matterRect) {
          return p5.dist(matterRect.vertices[0].x, matterRect.vertices[0].y, matterRect.vertices[3].x, matterRect.vertices[3].y)
        }

        //  Sound object
        class Sound {
          constructor(src) {
            this.el = document.createElement('audio')
            this.el.src = src
            this.el.setAttribute("preload", "auto")
            this.el.setAttribute("controls", "none")
            this.el.style.display = "none";
            vm.allSounds.push(this);
          }

          play() {
            this.el.play()
          }

          stop() {
            this.el.pause()
          }

          destroy() {
            this.el.parentNode.removeChild(this.el)
          }
        }




        // Show function
        const show = () => {
          p5.rectMode(p5.CENTER);
          p5.ellipseMode(p5.RADIUS)
          p5.imageMode(p5.CENTER)

          //  Box 1
          if (showBox) {

            goat.show(goatImg)
          }
          //  Kicker rod
          p5.push();
          p5.translate(kicker.parts[1].position.x, kicker.parts[1].position.y);
          p5.rotate(kicker.angle)
          p5.rect(0, 0, rectW(kicker.parts[1]), rectH(kicker.parts[1]))
          p5.pop();
          //  Kicker boot
          p5.push()
          p5.translate(kicker.parts[2].position.x, kicker.parts[2].position.y)
          p5.rotate(kicker.angle)
          p5.rect(0, 0, rectW(kicker.parts[2]), rectH(kicker.parts[2]))
          p5.pop()
          //  Kicker pin (debug only)
          p5.circle(kickerPin.position.x, kickerPin.position.y, kickerPin.circleRadius)
          //  Gibbs
          p5.push()
          p5.fill("red")
          p5.stroke("red")
          if (splodeArray.length) {
            splodeArray.forEach((gibbs) => {
              gibbs.bodies.forEach((gibb) => {
                p5.circle(gibb.position.x, gibb.position.y, gibb.circleRadius)
              });
              gibbs.constraints.forEach((gibbCon) => {
                p5.line(gibbCon.bodyA.position.x, gibbCon.bodyA.position.y, gibbCon.bodyB.position.x, gibbCon.bodyB.position.y)
              })
            })
          }
          p5.pop()
          //  Walls
          p5.rect(ground.position.x, ground.position.y, rectW(ground), rectH(ground));
          p5.rect(cliff.position.x, cliff.position.y, rectW(cliff), rectH(cliff));
          p5.rect(wallL.position.x, wallL.position.y, rectW(wallL), rectH(wallR));
          p5.rect(wallR.position.x, wallR.position.y, rectW(wallR), rectH(wallR));
        }





        //  P R E L O A D 
        p5.preload = () => {
          console.log("p5.preload() ran")
          //  This has to be changed to whatever the public directory is
          //          goatImg = p5.loadImage('https://01014.org/sketchbook/transparent-goat.png')
          //          for (var i = 0; i < 16; i++) {
          //            goatSounds.push(new Sound('https://01014.org/sketchbook/goat' +(i + 1) + '.mp3'))
          //          }
          //          hit1 = new Sound('https://01014.org/sketchbook/hit1.wav')
          //          hit2 = new Sound('https://01014.org/sketchbook/hit2.wav')
          //          kickerGo = new Sound('https://01014.org/sketchbook/kickerGo.wav')
          //          splat = new Sound('https://01014.org/sketchbook/splat.wav')

          //  This is for dev.  For production use the above commented code
          goatImg = p5.loadImage('http://localhost:8080/transparent-goat.png')
          for (var i = 0; i < 16; i++) {
            goatSounds.push(new Sound('http://localhost:8080/goat' + (i + 1) + '.mp3'))
          }
          hit1 = new Sound('http://localhost:8080/hit1.wav')
          hit2 = new Sound('http://localhost:8080/hit2.wav')
          kickerGo = new Sound('http://localhost:8080/kickerGo.wav')
          splat = new Sound('http://localhost:8080/splat.wav')


        }


        // S E T U P 
        p5.setup = () => {
          console.log("p5.setup has been called")
          //  Setup the canvas
          var canvas = p5.createCanvas(document.getElementById("p5canvasHolder").getBoundingClientRect().width, document.getElementById("p5canvasHolder").getBoundingClientRect().height);
          canvas.parent("p5canvasHolder");
          canvas.id("p5canvas")
          p5.pixelDensity(p5.displayDensity())


          vm.engine = vm.Engine.create({
            positionIterations: 10,
            velocityIterations: 6,
            constraintIterations: 3
          });
          vm.world = vm.engine.world


          //          console.log("vm.world")
          //          console.log(vm.world)
          //          console.log("vm.engine")
          //          console.log(vm.engine)
          //          console.log("vm.world.bodies")
          //          console.table(vm.world.bodies)


          //  Left Wall
          wallL = Bodies.rectangle(10, p5.canvas.height / 2, 20, p5.canvas.height, {
            isStatic: true
          });
          //  Right wall
          wallR = Bodies.rectangle(p5.canvas.width - 10, p5.canvas.height / 2, 20, p5.canvas.height, {
            isStatic: true
          });
          //  Ground
          ground = Bodies.rectangle(p5.canvas.width / 2, p5.canvas.height - 5, p5.canvas.width, 20, {
            isStatic: true,
            friction: .9
          })
          //  Cliff
          cliff = Bodies.rectangle(250, 350, 500, 25, {
            isStatic: true
          });



          //  Goat, with the new wrapper class
          goat = new mw.Rectangle(400, 300, 50, 50, {
            density: Math.random() * .0006
          })

          goat.add(vm.world)



          //  Kicker rod
          kickerRod = Bodies.rectangle(350, 100, 30, 220, {
            label: 'kickerRod'
          });
          //  Kicker boot
          kickerBoot = Bodies.rectangle(360, 225, 50, 30, {
            label: 'kickerBoot'
          });
          //  Kicker composite body
          kicker = Body.create({
            parts: [kickerRod, kickerBoot]
          })
          //  Kicker constraint
          kickerCon = Constraint.create({
            pointA: {
              x: kicker.position.x,
              y: kicker.position.y - 20
            },
            bodyB: kicker,
            pointB: {
              x: 0,
              y: -90
            },
            stiffness: .2,
            length: 0
          })
          //  Kicker pin
          kickerPin = Bodies.circle(190, 55, 8, {
            isStatic: true
          })
          Body.setAngularVelocity(kicker, 0)
          //  Mouse
          mouse = Mouse.create(canvas.elt)
          mConstraint = MouseConstraint.create(vm.engine, {
            mouse: mouse,
            constraint: {
              stiffness: 1
            }
          })
          mouse.pixelRatio = p5.displayDensity()
          //  Position the kicker
          Body.setAngle(kicker, 2)
          Body.setPosition(kicker, {
            x: 277,
            y: 57
          })
          Body.setVelocity(kicker, {
            x: 0,
            y: 0
          })
          //  Add everything to the world
          vm.World.add(vm.world, [mConstraint, ground, cliff, wallL, wallR, kickerPin, kicker, kickerCon]);
          //  Make sure everything is scaled according to the device scale
          Composite.scale(vm.world, 1 / p5.displayDensity(), 1 / p5.displayDensity(), {
            x: 0,
            y: 0
          }, true)




          //  On Resize
          p5.windowResized = () => {
            p5.resizeCanvas(document.getElementById("p5canvasHolder").getBoundingClientRect().width, document.getElementById("p5canvasHolder").getBoundingClientRect().height);

            //  Update ground in case of resize
            Body.setPosition(ground, {
              x: p5.width / 2,
              y: p5.height - rectH(ground) / 2
            })
            Body.scale(ground, (p5.width / rectW(ground)), 1)
            //  Update left wall in case of resize
            Body.setPosition(wallL, {
              x: rectW(wallL) / 2,
              y: p5.height / 2
            })
            Body.scale(wallL, 1, (p5.height / rectH(wallL)))
            //  Update right wall in case of resize
            //          p5.canvas.width - 10, p5.canvas.height / 2, 20, p5.canvas.height
            Body.setPosition(wallR, {
              x: p5.width - rectW(wallR) / 2,
              y: p5.height / 2
            })
            Body.scale(wallR, 1, p5.height / rectH(wallR))
          }


          //  On MousePress
          p5.mousePressed = (e) => {
            e.preventDefault();
          }


          //  Collision events
          Events.on(vm.engine, "collisionStart", function(event) {
            event.pairs.forEach((pair) => {
              //  On collision with goat and wallR or ground
              if ((pair.bodyA == goat.body && pair.bodyB == wallR) || (pair.bodyA == wallR && pair.bodyB == goat.body) || (pair.bodyA == goat.body && pair.bodyB == ground) || (pair.bodyA == ground && pair.bodyB == goat.body)) {
                //  Remove goat
                vm.World.remove(vm.world, goat.body, true)
                //  Stop rendering goat
                showBox = false
                //  Play the splat sound
                splat.play()
                // Particle options
                var partOptions = {
                  friction: 0.9,
                  restitution: .01,
                  render: {
                    visible: false
                  }
                }
                //  Constraint options
                var constOptions = {
                  stiffness: 0.2
                }
                //  Make gibbs
                for (var i = 0; i < 5; i++) {
                  splodeArray.push(Composites.softBody(goat.body.position.x, goat.body.position.y, Math.floor((Math.random() * 3) + 1), Math.floor((Math.random() * 3) + 1), 0, 0, false, 4, partOptions, constOptions))
                  vm.World.add(vm.world, splodeArray[i])
                }
                //  Apply random force to gibbs so they "explode" outwards
                splodeArray.forEach((gibb) => {
                  var forceMag = gibb.bodies[0].mass * .4
                  Body.applyForce(gibb.bodies[0], gibb.bodies[0].position, {
                    x: (Math.random() * forceMag) * Common.choose([1, -1]),
                    y: (Math.random() * forceMag) * Common.choose([1, -1])
                  })
                })
              }
              //  On collision between the kicker and the goat
              if ((pair.bodyA == goat.body && pair.bodyB == kicker.parts[2]) || (pair.bodyA == kicker.parts[2] && pair.bodyB == goat.body)) {
                //  Pick a hit sound to play
                Common.choose([hit1, hit2]).play()
                try {
                  //  pick a random goat sound
                  goatSounds[Math.floor(Math.random() * goatSounds.length)].play()
                } catch (e) {
                  console.log(e)
                }
              }
            })
          })


          //  Key press events
          p5.keyPressed = () => {
            //  On pressing "e", kick the goat
            //  Nice....Nice...
            if (p5.keyCode == "69") {
              kickerGo.play()
              //  Take out the kicker pin
              vm.World.remove(vm.world, kickerPin, true);
              //  Apply a force to the kicker so it actually kicks decently
              Body.applyForce(kicker, Vector.sub(kicker.position, {
                x: 0,
                y: -25
              }), {
                x: 0,
                y: 1
              })
            }
            //  On pressing "f", reset everything
            if (p5.keyCode == "70") {
              if (!Composite.get(vm.world, kickerPin.id, kickerPin.type)) {
                vm.World.add(vm.world, kickerPin)
              }
              //  Reset the kickerRod
              Body.setPosition(kicker, {
                x: 277,
                y: 57
              })
              Body.setAngle(kicker, 2)
              Body.setAngle(kicker, 2)
              Body.setVelocity(kicker, {
                x: 0,
                y: 0
              })
              Body.setAngularVelocity(kicker, 0)

              //  Reset the box
              if (!Composite.get(vm.world, goat.body.id, goat.body.type)) {
                vm.World.add(vm.world, goat.body)
                showBox = true
              }
              Body.setPosition(goat.body, {
                x: 400,
                y: 300
              })
              Body.setAngle(goat.body, 0);
              Body.setVelocity(goat.body, {
                x: 0,
                y: 0
              })
              Body.setAngularVelocity(goat.body, 0)
              splodeArray.forEach((gibb) => {
                vm.World.remove(vm.world, Composite.allBodies(gibb), true)
                vm.World.remove(vm.world, gibb, true)
              })
              splodeArray = []
            }
          }

        };


        function update() {
          try {
            vm.Engine.update(vm.engine)
          } catch (e) {
            console.log(e)
            //  I think because of the timing, the first p5.draw() call doesn't seem to catch the newly created Engine?  It only happens after "cleaning house" and then reloading.  p5.setup DOES run, but it seems to finish running after the first p5.draw run is called(???)  So this is here just to catch the error and do nothing with it, for now (??)
          }
        }

        // D R A W 
        p5.draw = () => {

          p5.background(0);
          p5.fill("white");
          p5.stroke("black");

          //  Update physics with matter.js, render everything with p5.js01014.
          update()
          show();
        };
      }
    },
    mounted() {
      console.log("Mounted has been called")
      vm = this //  Can this be called anywhere else?
      //  Start the show
      this.P5 = new P5(this.script);
    },


    // clean house
    beforeDestroy() {
      console.log("beforeDestroy has been called")
      for (var i = 0; i < vm.allSounds.length; i++) {
        vm.allSounds = vm.allSounds.splice(i, 0);
      }
      vm.engine.events = {}
      vm.World.clear(vm.world, false)
      vm.Engine.clear(vm.engine)
      vm.World = null;
      vm.Engine = null;
      vm.world = null;
      vm.engine = null;
      this.P5.remove()
      //      console.log("vm.world.bodies after beforeDestroy")
      //      console.table(vm.world.bodies)
      //      console.log("vm.engine after beforeDestroy")
      //      console.log(vm.engine)

    }
  };

</script>

<style scoped>
  #p5canvasHolder {
    height: 80vh;
    max-height: 70vh
  }

  #p5canvas {
    width: 100%;
    max-height: 100%;
  }

</style>
