<template>
  <div v-if="params || status" style="margin-top: 0.5px">
    <icon-clean :size="iconSize" v-if="cellValue === 'VC'"></icon-clean>
    <icon-ready :size="iconSize" v-else-if="cellValue === 'VR'"></icon-ready>
    <icon-dirty :size="iconSize" v-else-if="cellValue === 'VD'"></icon-dirty>
    <icon-oc :size="iconSize" v-else-if="cellValue === 'OC'"></icon-oc>
    <icon-od :size="iconSize" v-else-if="cellValue === 'OD'"></icon-od>
    <icon-oo :size="iconSize" v-else-if="cellValue === 'OO'"></icon-oo>
    <icon-uc :size="iconSize" v-else-if="cellValue === 'UC'"></icon-uc>
    <icon-pc :size="iconSize" v-else-if="cellValue === 'PC'"></icon-pc>
    <icon-of :size="iconSize" v-else-if="cellValue === 'OF'"></icon-of>
    <icon-hu :size="iconSize" v-else-if="cellValue === 'H'"></icon-hu>
    <icon-comp :size="iconSize" v-else-if="cellValue === 'P'"></icon-comp>
    <icon-gc :size="iconSize" v-else-if="cellValue === 'G'"></icon-gc>
    <icon-sr :size="iconSize" v-else-if="cellValue === 'S'"></icon-sr>
    <icon-occupied
      :size="iconSize"
      v-else-if="cellValue === 'O'"
    ></icon-occupied>
    <img
      v-else-if="cellValue === 'Yes'"
      src="/images/icons/smoking_icon32.png"
      :height="iconSize"
      :width="iconSize"
    />
    <img
      title="Don't Disturb"
      v-else-if="cellValue === 'DD'"
      src="/images/icons/dont_disturb_icon32.png"
      :height="iconSize"
      :width="iconSize"
    />
    <img
      title="Double Lock"
      v-else-if="cellValue === 'DL'"
      src="/images/icons/double_lock_icon32.png"
      :height="iconSize"
      :width="iconSize"
    />
    <img
      title="Sleep Out"
      v-else-if="cellValue === 'SO'"
      src="/images/icons/sleep_out_icon32.png"
      :height="iconSize"
      :width="iconSize"
    />
    <!-- <img
      v-else-if="cellValue === 'PC'"
      src="/images/icons/smoking_icon32.png"
      :height="iconSize"
      :width="iconSize"
    /> -->
  </div>
</template>

<script lang="ts">
import IconClean from "@/assets/icon/IconClean.vue";
import IconReady from "@/assets/icon/IconReady.vue";
import IconDirty from "@/assets/icon/IconDirty.vue";
import IconOC from "@/assets/icon/IconOC.vue";
import IconOD from "@/assets/icon/IconOD.vue";
import IconOO from "@/assets/icon/IconOO.vue";
import IconUC from "@/assets/icon/IconUC.vue";
import IconPC from "@/assets/icon/IconPC.vue";
import IconOF from "@/assets/icon/IconOF.vue";
import IconHU from "@/assets/icon/IconHU.vue";
import IconGC from "@/assets/icon/IconGC.vue";
import IconSR from "@/assets/icon/IconSR.vue";
import IconComp from "@/assets/icon/IconComp.vue";
import IconOccupied from "@/assets/icon/IconOccupied.vue";
import { computed, defineComponent, ref, shallowRef } from "vue";

export default defineComponent({
  name: "hk_status_icon",
  props: ["params", "status"],
  components: {
    "icon-clean": IconClean,
    "icon-ready": IconReady,
    "icon-dirty": IconDirty,
    "icon-hu": IconHU,
    "icon-comp": IconComp,
    "icon-oc": IconOC,
    "icon-od": IconOD,
    "icon-oo": IconOO,
    "icon-uc": IconUC,
    "icon-pc": IconPC,
    "icon-of": IconOF,
    "icon-gc": IconGC,
    "icon-sr": IconSR,
    "icon-occupied": IconOccupied,
  },
  setup(props) {
    let iconSize = shallowRef(20);
    const cellValue = computed(() => {
      if (props.status) {
        iconSize.value = 23;
        return props.status;
      } else if (props.params) {
        return props.params ? props.params.value : "";
      }
    });

    return {
      cellValue,
      iconSize,
    };
  },
});
</script>
