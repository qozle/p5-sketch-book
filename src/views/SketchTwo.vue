<template>
  <div id="sketchDiv" class="sketchTwo">
    <p>
      This is a prototype for something I'm making called "Goat-kicker", which is an inside joke between my girlfriend and I. Note that you can use the mouse to interact with the objects. WIP.
      <br>
      <br>
      Controls: "E" will launch the kicker, "F" will reset.
    </p>
    <div id="p5canvas">
    </div>
  </div>
</template>

<script>
  export default {
    name: "SketchTwo",
    date() {

    },
    mounted() {

      const script = function(p5) {

        //  P R E  S E T U P 
        //  These are some utility functions for getting random attributes
        const randomWidth = () => p5.random(0, p5.width - 50);
        const randomHeight = () => p5.random(0, p5.height - 50);
        const randomDiameter = () => p5.random(0, 50);
        const ranNum = () => Math.floor(p5.random(0, 4));


        //  Utility function for finding the width of a matter.js rect
        function rectW(matterRect) {
          return p5.dist(matterRect.vertices[0].x, matterRect.vertices[0].y, matterRect.vertices[1].x, matterRect.vertices[1].y)
        }


        //  Utility function for finding the height of a matter.js rect
        function rectH(matterRect) {
          return p5.dist(matterRect.vertices[0].x, matterRect.vertices[0].y, matterRect.vertices[3].x, matterRect.vertices[3].y)
        }


        class Sound {
          constructor(src) {
            this.sound = document.createElement('audio')
            this.sound.src = src
            this.sound.setAttribute("preload", "auto")
            this.sound.setAttribute("controls", "none")
            this.sound.style.display = "none";
            document.body.appendChild(this.sound)
            this.play = () => {
              this.sound.play()
            }
            this.stop = () => {
              this.sound.pause()
            }

          }
        }


        const Matter = require("matter-js");
        var Engine = Matter.Engine,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Body = Matter.Body,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          Constraint = Matter.Constraint,
          Vector = Matter.Vector,
          Composite = Matter.Composite,
          Composites = Matter.Composites,
          Events = Matter.Events,
          Common = Matter.Common

        var engine;
        var world;
        var ground;
        var box1;
        var cliff;
        var wallL;
        var wallR;
        var kicker;
        var kickerRod;
        var kickerBoot;
        var kickerBootCon;
        var kickerCon;
        var kickerPin;
        var mouse;
        var mConstraint;
        var showBox = true;
        var initialPosition;
        var splodeArray = [];
        var goatImg;
        var gibbs;
        var sample;
        var goatSounds = [];
        var hit1, hit2, splat, kickerGo;



        const show = () => {
          p5.rectMode(p5.CENTER);
          p5.ellipseMode(p5.RADIUS)
          p5.imageMode(p5.CENTER)
          //  Gibbs

          //  Box 1
          if (showBox) {
            p5.push();
            p5.translate(box1.position.x, box1.position.y)
            p5.rotate(box1.angle)
            p5.image(goatImg, 0, 0, rectW(box1), rectH(box1));
            p5.pop();
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
//          p5.circle(kickerPin.position.x, kickerPin.position.y, kickerPin.circleRadius)
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


        const update = () => {
          Engine.update(engine)
        }



        //  P R E L O A D 
        p5.preload = () => {
          //  This has to be changed to whatever the local is
          goatImg = p5.loadImage('https://01014.org/sketchbook/transparent-goat.png')
          for (var i = 0; i < 16; i++) {
            goatSounds.push(new Sound('https://01014.org/sketchbook/goat' +(i + 1) + '.mp3'))
          }
          hit1 = new Sound('https://01014.org/sketchbook/hit1.wav')
          hit2 = new Sound('https://01014.org/sketchbook/hit2.wav')
          kickerGo = new Sound('https://01014.org/sketchbook/kickerGo.wav')
          splat = new Sound('https://01014.org/sketchbook/splat.wav')
        }


        // S E T U P 
        p5.setup = () => {

          //  Setup the canvas
          var canvas = p5.createCanvas(document.getElementById("p5canvas").getBoundingClientRect().width, document.getElementById("p5canvas").getBoundingClientRect().height);
          canvas.parent("p5canvas");

          engine = Engine.create({
            positionIterations: 10,
            velocityIterations: 6,
            constraintIterations: 3
          });
          world = engine.world

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
          //  Box
          box1 = Bodies.rectangle(400, 300, 50, 50, {
            density: Math.random() * .0006
          });
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
              x: 345,
              y: 100
            },
            bodyB: kicker,
            pointB: {
              x: 0,
              y: -90
            },
            stiffness: 1,
            length: 0
          })
          Body.setAngle(kicker, 2)
          Body.setPosition(kicker, {
            x: 277,
            y: 57
          })
          Body.setVelocity(kicker, {
            x: 0,
            y: 0
          })
          Body.setAngularVelocity(kicker, 0)
          //  Kicker pin
          kickerPin = Bodies.circle(190, 55, 8, {
            isStatic: true
          })
          //  Mouse
          mouse = Mouse.create(canvas.elt)
          mConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
              stiffness: 0.2
            }
          })

          //  Add everything to the world
          World.add(world, [mConstraint, box1, ground, cliff, wallL, wallR, kickerPin, kicker, kickerCon]);





          //  On Resize
          p5.windowResized = () => {
            p5.resizeCanvas(document.getElementById("p5canvas").getBoundingClientRect().width, document.getElementById("p5canvas").getBoundingClientRect().height);

            //  Update ground in case of resize
            Body.setPosition(ground, {
              x: p5.canvas.width / 2,
              y: p5.canvas.height - 5
            })
            Body.scale(ground, (p5.canvas.width / rectW(ground)), 1)
            //  Update left wall in case of resize
            Body.setPosition(wallL, {
              x: 10,
              y: p5.canvas.height / 2
            })
            Body.scale(wallL, 1, (p5.canvas.height / rectH(wallL)))
            //  Update right wall in case of resize
            //          p5.canvas.width - 10, p5.canvas.height / 2, 20, p5.canvas.height
            Body.setPosition(wallR, {
              x: p5.canvas.width - 10,
              y: p5.canvas.height / 2
            })
            Body.scale(wallR, 1, p5.canvas.height / rectH(wallR))
          }

          //  On MousePress
          p5.mousePressed = (e) => {
            e.preventDefault();

          }

          Events.on(engine, "collisionStart", function(event) {
            event.pairs.forEach((pair) => {

              if ((pair.bodyA == box1 && pair.bodyB == wallR) || (pair.bodyA == wallR && pair.bodyB == box1) || (pair.bodyA == box1 && pair.bodyB == ground) || (pair.bodyA == ground && pair.bodyB == box1)) {

                World.remove(world, box1, true)
                showBox = false
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
                for (var i = 0; i < 5; i++) {
                  splodeArray.push(Composites.softBody(box1.position.x, box1.position.y, Math.floor((Math.random() * 3) + 1), Math.floor((Math.random() * 3) + 1), 0, 0, false, 4, partOptions, constOptions))
                  World.add(world, splodeArray[i])
                }
                splodeArray.forEach((gibb) => {
                  var forceMag = gibb.bodies[0].mass * .4
                  Body.applyForce(gibb.bodies[0], gibb.bodies[0].position, {
                    x: (Math.random() * forceMag) * Common.choose([1, -1]),
                    y: (Math.random() * forceMag) * Common.choose([1, -1])
                  })
                })
              }
              
              if ((pair.bodyA == box1 && pair.bodyB == kicker.parts[2]) || (pair.bodyA == kicker.parts[2] && pair.bodyB == box1)){
                Common.choose([hit1, hit2]).play()
                goatSounds[Math.floor(Math.random()*goatSounds.length)-1].play()
              }
            })
          })

          p5.keyPressed = () => {
            if (p5.keyCode == "69") {
              kickerGo.play()
              World.remove(world, kickerPin, true);
              Engine.update(engine)
              Body.applyForce(kicker, Vector.sub(kicker.position, {
                x: 0,
                y: -25
              }), {
                x: 0,
                y: 1
              })
            }

            if (p5.keyCode == "70") {
              if (!Composite.get(world, kickerPin.id, kickerPin.type)) {
                World.add(world, kickerPin)
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
              if (!Composite.get(world, box1.id, box1.type)) {
                World.add(world, box1)
                showBox = true
              }
              Body.setPosition(box1, {
                x: 400,
                y: 300
              })
              Body.setAngle(box1, 0);
              Body.setVelocity(box1, {
                x: 0,
                y: 0
              })
              Body.setAngularVelocity(box1, 0)
              splodeArray.forEach((gibb) => {
                World.remove(world, Composite.allBodies(gibb), true)
                World.remove(world, gibb, true)
              })
              splodeArray = []
            }
          }
        };


        // D R A W 
        p5.draw = () => {
          p5.background(0);
          p5.fill("white");
          p5.stroke("black");

          //  Update physics
          update()
          show();
        };
      };

      //  Start the show
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
