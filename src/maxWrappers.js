module.exports = function(Matter, p5) {
  return {
    Rectangle: class Rectangle {
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
        if(colors){
          p5.stroke(stroke)
          p5.fill(fill)
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
  }
}
