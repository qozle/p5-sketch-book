module.exports = function (Matter, p5) {
  //////////////////////////////
  //  Rectangular shape class//
  /////////////////////////////
  class Rectangle {
    constructor(posx, posy, width, height, options) {
      this.body = Matter.Bodies.rectangle(posx, posy, width, height, options)
    }

    width() {
      return p5.dist(this.body.vertices[0].x, this.body.vertices[0].y, this.body.vertices[1].x, this.body.vertices[1].y)
    }

    height() {
      return p5.dist(this.body.vertices[0].x, this.body.vertices[0].y, this.body.vertices[3].x, this.body.vertices[3].y)
    }

    show(image, options) {
      p5.push()
      if (options && options.colors) {
        if (options.colors.stroke) {
          p5.stroke(options.colors.stroke)
        }
        if (options.colors.fill) {
          p5.fill(options.colors.fill)
        }
      }
      p5.translate(this.body.position.x, this.body.position.y)
      p5.rotate(this.body.angle)
      if (options && options.scale) {
        p5.scale(options.scale.x)
      }
      if (image && (options && options.width && options.height)) {
        p5.image(image, 0, 0, options.width, options.height)
      } else if (image) {
        p5.image(image, 0, 0)
      } else {
        p5.rect(0, 0, this.width(), this.height())
      }
      p5.pop()
    }

    add(world) {
      Matter.World.add(world, this.body)
    }
  }


  //////////////////////////////
  //  Circular shape class//////
  //////////////////////////////
  class Circle {
    constructor(posx, posy, radius, options) {
      this.body = Matter.Bodies.circle(posx, posy, radius, options)
    }

    add(world) {
      Matter.World.add(world, this.body)
    }

    show(image, colors, options) {
      p5.push()
      p5.translate(this.body.posx, this.body.posy)
      p5.rotate(this.body.angle)
      //  Handle image if there is one
      if (image && options) {
        p5.image(image, this.body.posx, this.body.posy, options.width, options.height)
      } else if (image && !options) {
        p5.image(image, this.body.posx, this.body.posy, this.body.circleRadius * 2, this.body.circleRadius * 2)
      } else {
        //  Handle colors if there are any
        if (colors && colors.fill) {
          p5.fill(colors.fill)
        }
        if (colors && colors.stroke) {
          p5.stroke(colors.stroke)
        }
        p5.circle(0, 0, this.body.circleRadius)
      }
      p5.pop()
    }
  }


  ///////////////////////////
  //  Composite body class///
  ///////////////////////////
  class CompositeBody {
    constructor(bodies) {
      var options = {}
      if (bodies.parts) {
        options.parts = []
        this.parts = []
        bodies.parts.forEach((part) => {
          options.parts.push(part.body)
          this.parts.push(part)
        })
      }

      this.body = Matter.Body.create(options)
    }

    show(colors, image) {
      this.parts.forEach((part) => {
        p5.push()
        p5.translate(part.body.position.x, part.body.position.y)
        p5.rotate(this.body.angle)
        p5.rect(0, 0, part.width(), part.height())
        p5.pop()
      })
    }

    add(world) {
      Matter.World.add(world, this.body)
    }
  }


  class SoftBody {
    constructor(posx, posy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
      this.body = Matter.Composites.softBody(posx, posy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions)
    }

    show(options) {      
      this.body.bodies.forEach((gibb) => {
        p5.circle(gibb.position.x, gibb.position.y, gibb.circleRadius)
      })
      this.body.constraints.forEach((gibbCon) => {
        p5.line(gibbCon.bodyA.position.x, gibbCon.bodyA.position.y, gibbCon.bodyB.position.x, gibbCon.bodyB.position.y)
      })      
    }
    
    add(world){
      Matter.World.add(world, this.body)
    }
  }


  /////////////////////////////////////////////////////
  //  Sound class- not sure this really belongs here.//
  /////////////////////////////////////////////////////
  class Sound {
    constructor(src) {
      this.el = document.createElement('audio')
      this.el.src = src
      this.el.setAttribute("preload", "auto")
      this.el.setAttribute("controls", "none")
      this.el.style.display = "none";

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


  return {
    rectangle: function (posx, posy, w, h, options) {
      return new Rectangle(posx, posy, w, h, options)
    },
    circle: function (posx, posy, radius, options) {
      return new Circle(posx, posy, radius, options)
    },
    compositeBody: function (options) {
      return new CompositeBody(options)
    },
    softBody: function (posx, posy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
      return new SoftBody(posx, posy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions)
    },
    sound: function (src) {
      return new Sound(src)
    }
  }
}
