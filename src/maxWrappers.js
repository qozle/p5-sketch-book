module.exports = function (Matter, p5) {
  class Rectangle {
    constructor(posx, posy, width, height, options) {
      this.body = Matter.Bodies.rectangle(posx, posy, width, height, options)
      this.width = function () {
        return p5.dist(this.body.vertices[0].x, this.body.vertices[0].y, this.body.vertices[1].x, this.body.vertices[1].y)
      }
      this.height = function () {
        return p5.dist(this.body.vertices[0].x, this.body.vertices[0].y, this.body.vertices[3].x, this.body.vertices[3].y)
      }
    }

    show(image, colors) {
      p5.push()
      if (colors) {
        if (colors.stroke) {
          p5.stroke(colors.stroke)
        }
        if (colors.fill) {
          p5.fill(colors.fill)
        }
      }

      p5.translate(this.body.position.x, this.body.position.y)
      p5.rotate(this.body.angle)
      if (image) {
        p5.image(image, 0, 0, this.width(), this.height())
      } else {
        p5.rect(0, 0, this.width(), this.height())
      }

      p5.pop()
    }

    add(world) {
      Matter.World.add(world, this.body)
    }
  }
  
  
  class CompositeBody {
    constructor(options){      
      this.body = Matter.Body.create(options)
    }
    
    show(colors, image){
      this.body.parts.forEach((part)=>{
          p5.push()
          p5.translate(part.position.x, part.position.y)
          p5.rotate(this.body.angle)
          p5.rect(0, 0, this.width, this.height)
          p5.pop()
      })
    }
    
    add(world){
      Matter.World.add(world, this.body)
    }
  }
  

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
    //  Rectangle class
    rectangle: function (posx, posy, w, h, options) {
      return new Rectangle(posx, posy, w, h, options)
    },

    compositeBody: function(options){
      return new CompositeBody(options)
    },

    //  Sound class
    sound: function (src) {
      return new Sound(src)
    }
  }
}
