<template>
  <div class="home">
    <SketchOne />
  </div>
</template>

<script>
// @ is an alias to /src
import SketchOne from "@/components/SketchOne.vue";

export default {
  name: "Home",
  components: {
    SketchOne
  }
};
</script>
