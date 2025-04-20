<template>
  <div v-if="params.data" class="reservation-status-grid">
    <span class="due" v-if="date.departure <= auditDate">
      {{ dateFormatted }}
    </span>
    <span v-else>{{ dateFormatted }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDate3, formatDateDatabase } from "@/utils/format";
import configStore from "../../stores/config";

export default defineComponent({
  name: "expected_arrival_renderer",
  props: ["params"],
  setup(props) {
    const config = configStore();
    const cellValue = props.params.data
      ? props.params.data.DateDeparture
      : props.params.value;
    let status = "";
    let date: any = {};
    return {
      cellValue,
      status,
      config,
      date,
      formatDate3,
    };
  },
  beforeCreate() {
    if (this.params.data) {
      (this.status = this.params.data.status_code),
        (this.date = {
          arrival: formatDateDatabase(this.params.data.DateArrival),
          departure: formatDateDatabase(this.params.data.DateDeparture),
        });
    }
  },
  computed: {
    dateFormatted() {
      return formatDate3(this.cellValue);
    },
    auditDate() {
      return formatDateDatabase(this.config.auditDate);
    },
  },
});
</script>
