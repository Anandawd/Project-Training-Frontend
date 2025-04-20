<template>
  <div v-if="params.value" class="drag availability-status">
    <div class="drag" :style="style">
      <span class="pl-4">{{ params.value }}</span>
      <!-- <div :style="arrowStyle" class="arrow"></div> -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "availability_status_color",
  props: ["params"],
  setup() {
    const data = ref();
    const dataArray: any = [];
    const typeX = "";
    const statusCode2 = "";
    const style = reactive({
      padding: "1px",
      paddingRight: "1px",
      marginTop: "-1.6px",
      position: "absolute",
      zIndex: "2",
      width: "150px",
      backgroundColor: "",
    });
    const arrowStyle = reactive({
      backgroundColor: "white",
    });

    function dec2hexString(dec: any) {
      return `0x${(dec + 0x10000).toString(16).substr(-4).toUpperCase()}`;
    }
    return {
      statusCode2,
      dataArray,
      data,
      typeX,
      style,
      arrowStyle,
    };
  },
  mounted() {
    if (this.params.value != "") {
      let data = this.params.value;
      this.dataArray = data.split("|");
      console.log(this.dataArray);
      console.log(this.data);
      this.typeX = this.dataArray[2];
      if (this.typeX == "U") {
        this.statusCode2 = this.dataArray[3];
        if (this.statusCode2 == "OO") {
          // this.style.backgroundColor = "#"+ ('000000' + ((this.$store.state.configurations.roomStatusColorOutOfOrder)>>>0).toString(16)).slice(-6);
          this.style.backgroundColor = "Red";
          this.arrowStyle.backgroundColor = "Red";
        } else if (this.statusCode2 == "OF") {
          // this.style.backgroundColor = "#"+ ('000000' + ((this.$store.state.configurations.roomStatusColorOfficeUse)>>>0).toString(16)).slice(-6);
          this.style.backgroundColor = "Purple";
          this.arrowStyle.backgroundColor = "Purple";
        } else if (this.statusCode2 == "UC") {
          // this.style.backgroundColor = "#"+ ('000000' + ((this.$store.state.configurations.roomStatusColorUnderConstruction)>>>0).toString(16)).slice(-6);
          this.style.backgroundColor = "Sienna";
          this.arrowStyle.backgroundColor = "Sienna";
        }
      } else if (this.typeX == "R") {
        this.style.backgroundColor = "DodgerBlue";
        this.arrowStyle.backgroundColor = "DodgerBlue";
        // this.style.backgroundColor = "#"+ ('000000' + ((this.$store.state.configurations.roomStatusColorReserved)>>>0).toString(16)).slice(-6);
      } else if (this.typeX == "O") {
        this.style.backgroundColor = "DarkGoldenRod";
        this.arrowStyle.backgroundColor = "DarkGoldenRod";
        // this.style.backgroundColor =  "#"+ ('000000' + ((this.$store.state.configurations.roomStatusColorOccupied)>>>0).toString(16)).slice(-6);
      } else if (this.typeX == "ED") {
        //                this.style.backgroundColor =  "#"+ ('000000' + ((this.$store.state.configurations.roomStatusColorOccupied)>>>0).toString(16)).slice(-6);
        this.style.backgroundColor = "yellow";
        this.arrowStyle.backgroundColor = "yellow";
      }
    }
  },
});
</script>
<style lang="scss">
.ag-cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
  overflow: visible;
}
.availability-status {
  &::after {
    content: "";
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
    position: absolute;
    overflow: visible !important;
    top: 0;
    left: 100%;
    border-left: 17px solid #004686;
  }
  &::before {
    content: "";
    position: absolute;
    border-left: 13px solid transparent;
    overflow: visible !important;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    border-top: 13px solid #004686;
    border-bottom: 13px solid #004686;
  }
}
</style>
