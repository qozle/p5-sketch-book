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
  //  This is set because we're going to need to access the Vue global
  //  properties from within the p5 script.  Feels wrong though?
  var vm;
  var hostname
  switch (process.env.NODE_ENV) {
    case ('development'):
      hostname = "http://localhost:8080"
      break;
    case ("production"):
      hostname = "https://01014.org/"
      break;
  }
  export default {
    name: "SketchTwo",
    data() {
      return {
        //  These are set as global values because they need to be 
        //  cleared in the beforeDestroy function
        engine: '',
        world: '',
        allSounds: [],
        p5: ''
      }
    },
    beforeCreate() {
      vm = this
    },

    methods: {
      script: function(p5) {
        const Matter = vm.$Matter
        var Bodies = Matter.Bodies,
          Engine = Matter.Engine,
          World = Matter.World,
          Body = Matter.Body,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          Constraint = Matter.Constraint,
          Vector = Matter.Vector,
          Composite = Matter.Composite,
          Composites = Matter.Composites,
          Events = Matter.Events,
          Common = Matter.Common
        const mw = new vm.$mw(Matter, p5)
        //  Here, have some global variables
        var ground,
          goat,
          cliff,
          wallL,
          wallR,
          kicker,
          kickerRod,
          kickerBoot,
          kickerCon,
          kickerPin,
          showBox = true,
          splodeArray = [],
          goatImg,
          gibbs,
          hit1,
          hit2,
          splat,
          kickerGo,
          goatSounds = [],
          goatJson = '',
          goatParts = [],
          goatPartsImgs = [],
          blissHill = ''



        ///////////////////////////////////////
        //  These are some utility functions.//
        ///////////////////////////////////////
        const randomWidth = () => p5.random(0, p5.width - 50);
        const randomHeight = () => p5.random(0, p5.height - 50);
        const randomDiameter = () => p5.random(0, 50);
        const ranNum = (num) => Math.floor(p5.random(0, num));
        const scaledWidth = () => document.getElementById("p5canvasHolder").getBoundingClientRect().width
        const scaledHeight = () => document.getElementById("p5canvasHolder").getBoundingClientRect().height

        function ranVec(forceMag) {
          return (Math.random() * forceMag) * Common.choose([1, -1])
        }


        ///////////////////
        // Show function///
        ///////////////////
        const show = () => {
          //  Kicker pin (debug only)
          // p5.circle(kickerPin.position.x, kickerPin.position.y, kickerPin.circleRadius)
          //  Gibbs
          if (splodeArray.length) {
            p5.push()
            p5.fill("red")
            p5.stroke("red")
            splodeArray.forEach((gibb) => {
              gibb.show()
            })
            p5.pop()
          }
          //  Goat Parts
          if (goatParts.length) {
            goatParts.forEach((goatPart) => {
              var options = {
                scale: {
                  x: .2
                }
              }
              switch (goatPart.shape) {
                case ("rectangle"):
                  goatPart.body.show(goatPart.img, options)
                  break;
                case ("circle"):
                  goatPart.body.show(goatPart.img, options)
                  break;
              }
            })
          }
          //  Goat
          if (showBox) {
            goat.show(goatImg, {
              width: goat.width(),
              height: goat.height()
            })
          }
          //  Walls (for debug)
//          p5.push()
//          p5.noStroke()
//          var wallOptions = {
//            colors: {
//              fill: "red"
//            }
//          }
//          ground.show()
//          wallL.show()
//          wallR.show()
//          p5.pop()
          //  Kicker / cliff
          kicker.show()
          cliff.show()
        }

        ////////////////////
        //  P R E L O A D // 
        ////////////////////
        p5.preload = async () => {
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
          goatImg = p5.loadImage(`${hostname}/transparent-goat.png`)
          blissHill = p5.loadImage(`${hostname}/background/bliss-hill.jpg`)
          for (var i = 0; i < 16; i++) {
            var newSound = mw.sound(`${hostname}/sounds/goat${i + 1}.mp3`)
            goatSounds.push(newSound)
            vm.allSounds.push(newSound)
          }
          hit1 = mw.sound(`${hostname}/sounds/hit1.wav`)
          hit2 = mw.sound(`${hostname}/sounds/hit2.wav`)
          kickerGo = mw.sound(`${hostname}/sounds/kickerGo.wav`)
          splat = mw.sound(`${hostname}/sounds/splat.wav`)
          vm.allSounds.push(hit1, hit2, kickerGo, splat)

          const res = await fetch(`${hostname}/goat-part-dimensions.json`)
          goatJson = await res.json()
          //  This is literally just because I'm too lazy to type this in
          //  ...and also because hostname changes, I guess...
          Object.keys(goatJson).forEach((key) => {
            goatJson[key].img = p5.loadImage(`${hostname}/goat-parts/${key}.png`)
          })
        }

        ///////////////
        // S E T U P //
        ///////////////
        p5.setup = () => {
          console.log("p5.setup has been called")
          //  Setup the canvas
          var canvas = p5.createCanvas(scaledWidth(), scaledHeight());
          canvas.parent("p5canvasHolder");
          canvas.id("p5canvas")
          p5.pixelDensity(p5.displayDensity())
          p5.rectMode(p5.CENTER);
          p5.ellipseMode(p5.RADIUS)
          p5.imageMode(p5.CENTER)
          //  Make the engine
          vm.engine = Engine.create({
            positionIterations: 8,
            velocityIterations: 4,
            constraintIterations: 2
          });
          //  Make the world
          vm.world = vm.engine.world
          //  Create all the bodies
          wallL = mw.rectangle(-10, p5.canvas.height / 2, 20, p5.canvas.height, {
            isStatic: true
          });
          wallR = mw.rectangle(p5.canvas.width + 10, p5.canvas.height / 2, 20, p5.canvas.height, {
            isStatic: true
          })
          ground = mw.rectangle(p5.canvas.width / 2, p5.canvas.height + 10, p5.canvas.width, 20, {
            isStatic: true,
            friction: 1
          })
          cliff = mw.rectangle(250, 350, 500, 25, {
            isStatic: true
          })
          goat = new mw.rectangle(400, 300, 50, 50, {
            density: Math.random() * .0006
          })
          kickerRod = mw.rectangle(350, 100, 30, 220, {
            label: 'kickerRod'
          });
          kickerBoot = mw.rectangle(360, 225, 50, 30, {
            label: 'kickerBoot'
          });
          kicker = mw.compositeBody({
            parts: [kickerRod, kickerBoot]
          })
          kickerCon = Constraint.create({
            pointA: {
              x: kicker.body.position.x,
              y: kicker.body.position.y - 20
            },
            bodyB: kicker.body,
            pointB: {
              x: 0,
              y: -90
            },
            stiffness: .2,
            length: 0
          })
          kickerPin = Bodies.circle(190, 55, 8, {
            isStatic: true
          })
          var mouse = Mouse.create(canvas.elt)
          var mConstraint = MouseConstraint.create(vm.engine, {
            mouse: mouse,
            constraint: {
              stiffness: 1
            }
          })
          mouse.pixelRatio = p5.displayDensity()
          //  Position the kicker
          Body.setAngle(kicker.body, 2)
          Body.setPosition(kicker.body, {
            x: 277,
            y: 57
          })
          Body.setVelocity(kicker.body, {
            x: 0,
            y: 0
          })
          Body.setAngularVelocity(kicker.body, 0)
          //  Add everything to the world
          wallL.add(vm.world)
          wallR.add(vm.world)
          ground.add(vm.world)
          cliff.add(vm.world)
          goat.add(vm.world)
          kicker.add(vm.world)
          World.add(vm.world, [mConstraint, kickerPin, kickerCon]);

          /*  Make sure everything is scaled according to the device scale.  
              Pretty sure that the DISTANCES between objects should be scaled 
              as well.  So.  That'll be fun to add in.                   */
          Composite.scale(vm.world, 1 / p5.displayDensity(), 1 / p5.displayDensity(), {
            x: 0,
            y: 0
          }, true)


          //  On Resize
          p5.windowResized = () => {
            p5.resizeCanvas(scaledWidth(), scaledHeight())
            //  Update ground in case of resize
            Body.setPosition(ground.body, {
              x: p5.width / 2,
              y: (p5.height + ground.height() / 2)
            })
            Body.scale(ground.body, (p5.width / ground.width()), 1)
            //  Update left wall in case of resize
            Body.setPosition(wallL.body, {
              x: (wallL.width() / 2) - 10,
              y: p5.height / 2
            })
            Body.scale(wallL.body, 1, (p5.height / wallL.height()))
            //  Update right wall in case of resize
            Body.setPosition(wallR.body, {
              x: (p5.width + wallR.width() / 2),
              y: p5.height / 2
            })
            Body.scale(wallR.body, 1, p5.height / wallR.height())
          }


          //  On MousePress
          p5.mousePressed = (e) => {
            e.preventDefault();
          }


          //  Collision events
          Events.on(vm.engine, "collisionStart", function(event) {
            event.pairs.forEach((pair) => {
              var pairs = [pair.bodyA, pair.bodyB]

              //  On collision between the kicker and the goat
              if (pairs.includes(goat.body) && pairs.includes(kicker.body.parts[2])) {
                //  Pick a hit sound to play
                Common.choose([hit1, hit2]).play()
                try {
                  //  pick a random goat sound
                  goatSounds[Math.floor(Math.random() * goatSounds.length)].play()
                } catch (e) {
                  console.log(e)
                }
              }

              //  On collision with goat and wallR or ground
              if (pairs.includes(goat.body) && pairs.includes(wallR.body) || pairs.includes(goat.body) && pairs.includes(ground.body)) {
                var goatPosX = goat.body.position.x
                var goatPosY = goat.body.position.y
                //  Remove goat from world
                World.remove(vm.world, goat.body, true)
                //  Stop rendering goat
                showBox = false
                //  Play the splat sound
                splat.play()
                // Particle options
                var partOptions = {
                  friction: 1,
                  restitution: .01,
                  render: {
                    visible: false
                  }
                }
                //  Constraint options
                var constOptions = {
                  stiffness: 1
                }
                //  Make gibbs
                for (var i = 0; i < 5; i++) {
                  splodeArray.push(mw.softBody(goatPosX + ranVec(5), goatPosY + ranVec(5), ranNum(3) + 1, ranNum(3) + 1, 0, 0, false, 2, partOptions, constOptions))
                  splodeArray[i].add(vm.world)
                  var splodeBody = splodeArray[i].body.bodies[0]
                  var forceMag = splodeBody.mass * .4
                  Body.applyForce(splodeBody, splodeBody.position, {
                    x: ranVec(forceMag),
                    y: ranVec(forceMag)
                  })
                }
                //  Make goat parts
                for (let i = 0; i < 7; i++) {
                  var ranGoatPart = goatJson[Common.choose(Object.keys(goatJson))]
                  switch (ranGoatPart.shape) {
                    case ("rectangle"):
                      ranGoatPart.body = mw.rectangle(goatPosX + ranVec(5), goatPosY + ranVec(5), ranGoatPart.w, ranGoatPart.h)
                      Body.scale(ranGoatPart.body.body, .2, .2)
                      ranGoatPart.body.add(vm.world, ranGoatPart.body.body)
                      goatParts.push(ranGoatPart)
                      break;
                    case ("circle"):
                      ranGoatPart.body = mw.circle(goatPosX + ranVec(5), goatPosY + ranVec(5), ranGoatPart.radius)
                      Body.scale(ranGoatPart.body.body, .2, .2)
                      ranGoatPart.body.add(vm.world, ranGoatPart.body.body)
                      goatParts.push(ranGoatPart)
                      break;
                  }
                  //  Apply a random force to the body parts so they explode outwards
                  var forceMag = ranGoatPart.body.body.mass * .1
                  Body.applyForce(ranGoatPart.body.body, ranGoatPart.body.body.position, {
                    x: ranVec(forceMag),
                    y: ranVec(forceMag)
                  })
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
              World.remove(vm.world, kickerPin, true);
              //  Apply a force to the kicker so it actually kicks decently
              Body.applyForce(kicker.body, Vector.sub(kicker.body.position, {
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
                World.add(vm.world, kickerPin)
              }
              //  Reset the kickerRod
              Body.setPosition(kicker.body, {
                x: 277,
                y: 57
              })
              Body.setAngle(kicker.body, 2)
              Body.setAngle(kicker.body, 2)
              Body.setVelocity(kicker.body, {
                x: 0,
                y: 0
              })
              Body.setAngularVelocity(kicker.body, 0)
              //  Reset the goat
              if (!Composite.get(vm.world, goat.body.id, goat.body.type)) {
                World.add(vm.world, goat.body)
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
              //  Remove gibbs
              splodeArray.forEach((gibb) => {
                World.remove(vm.world, Composite.allBodies(gibb.body), true)
                World.remove(vm.world, gibb.body, true)
              })
              splodeArray = []
              //  Remove goat parts
              goatParts.forEach((part) => {
                World.remove(vm.world, part.body.body, true)
              })
              goatParts = []
            }
          }
        };


        function update() {
          try {
            Engine.update(vm.engine)
          } catch (e) {
            console.log(e)
          }
        }
        /////////////
        // D R A W //
        /////////////
        p5.draw = () => {
          p5.background(0)
          p5.image(blissHill, p5.canvas.width/2, p5.canvas.height/2, p5.canvas.width, p5.canvas.height)
          p5.fill("white");
          p5.stroke("black");
          update()
          show();
        };
      }
    },

    mounted() {
      console.log("Mounted has been called")
      //  Start the show
      vm.p5 = new vm.$P5(vm.script);
    },

    // clean house
    beforeDestroy() {
      console.log("beforeDestroy has been called")
      for (var i = 0; i < vm.allSounds.length; i++) {
        vm.allSounds = vm.allSounds.splice(i, 0);
      }
      vm.engine.events = {}
      vm.$Matter.World.clear(vm.world, false)
      vm.$Matter.Engine.clear(vm.engine)
      vm.world = null;
      vm.engine = null;
      vm.p5.remove()
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
