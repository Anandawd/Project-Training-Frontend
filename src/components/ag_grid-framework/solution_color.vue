<template>
  <div v-if="params.value">
    <div :style="style">
      <span class="ml-1">{{ data }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import $global from "@/utils/global";

export default defineComponent({
  name: "solution-color",
  props: ["params"],
  setup(props: any, context: any) {
    // const style = {
    //   height: '27px',
    //   width: '65px',
    //   backgroundColor: '',
    // }
    const data = computed(() => {
      return props.params.value;
    });

    const style = computed(() => {
      const solution = data;
      let color = "";
      if (
        solution.value == $global.solutionCriticalErrorDayendClose.autoAssign
      ) {
        color = "green";
      } else if (
        solution.value === $global.solutionCriticalErrorDayendClose.checkIn
      ) {
        color = "blue";
      } else if (
        solution.value === $global.solutionCriticalErrorDayendClose.cancel
      ) {
        color = "red";
      } else if (
        solution.value ===
        $global.solutionCriticalErrorDayendClose.changeArrival
      ) {
        color = "yellow";
      } else if (
        solution.value === $global.solutionCriticalErrorDayendClose.noShow
      ) {
        color = "purple";
      } else if (
        solution.value === $global.solutionCriticalErrorDayendClose.checkOut
      ) {
        color = "red";
      } else if (
        solution.value === $global.solutionCriticalErrorDayendClose.extend
      ) {
        color = "yellow";
      } else if (
        solution.value === $global.solutionCriticalErrorDayendClose.autoPosting
      ) {
        color = "yellow";
      } else if (
        solution.value === $global.solutionCriticalErrorDayendClose.showFolio
      ) {
        color = "yellow";
      } else if (
        solution.value === $global.solutionCriticalErrorDayendClose.showDeposit
      ) {
        color = "yellow";
      } else if (
        solution.value ===
        $global.solutionCriticalErrorDayendClose.unsetWaitList
      ) {
        color = "yellow";
      } else if (
        solution.value === $global.solutionCriticalErrorDayendClose.openPOS
      ) {
        color = "yellow";
      }
      return {
        backgroundColor: color,
        cursor: "pointer",
        color:
          color == "blue" || color == "purple" || color == "green"
            ? "white"
            : "inherit",
      };
    });

    return {
      // setColor,
      style,
      data,
    };
  },
  mounted() {
    // this.setColor()
  },
});
</script>
