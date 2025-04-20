<template>
  <div v-if="params.data">
    <div id="col" :style="style"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "color",
  props: ["params"],
  setup(props: any) {
    const cellValue = props.params.value;

    const style = {
      height: "27px",
      width: "auto",
      backgroundColor: props.params.value,
    };
    const data = "";
    function setColor() {
      const div = document.getElementById("col");
      if (div !== null) {
        div.style.backgroundColor = "#01e8f9";
      }
    }
    return {
      setColor,
      style,
      cellValue,
      data,
    };
  },
  mounted() {
    if (this.params.value) {
      this.data = this.params.data.color;
      this.style.backgroundColor = this.cellValue;
    }
  },
});
</script>
