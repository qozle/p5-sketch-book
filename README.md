# sketchbook

This is a sketchbook of all my p5.js sketches and projects, installed into a vue-cli environment.  

You can find the live version at https://01014.org/sketchbook.

I'm actually a little proud of this sketchbook app.  I've learned a lot while making it- I've come to understand importing packages with Vue a lot better (namely, how to import matter-js and p5.js a single time, globally).  I've also learned how to use both of these packages a lot better.  

This package uses a global matter-js instance and clears it for every sketch, and uses p5 in instance mode and clears / creates a new instance for every sketch.  

I've learned a bit about Vue as well- namely, using the event functions like beforeCreate, beforeDestroy, mounted, et c, using variables from data() and global variables from the Vue instance. 

This also taught me a bit about using custom classes and making a custom package (mw or "maxWrappers.js).  I created a series of custom wrapper classes to include data from matter-js and p5, and added some useful methods like show(), which will draw the object.  This has neatened up my code considerably and also allowed me to have a more object-oriented approach.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
