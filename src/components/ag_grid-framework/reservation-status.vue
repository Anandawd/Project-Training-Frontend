<template>
    <div v-if="params.data" class="reservation-status-grid">
        <span v-if="cellValue == 'W'" color="#004481">
            Wait List
        </span>
        <span v-else-if="cellValue == 'I'" color="#2494C6">
            Checked In
        </span>
        <span v-else-if="cellValue == 'O'" color="#FF83A5">
            Checked Out
        </span>
        <span v-else-if="cellValue == 'N'" color="#00C1B0">
            Reserved
        </span>
        <span v-else-if="cellValue == 'C'" color="#FF002A">
            Cancelled
        </span>
        <span v-else-if="cellValue == 'S'" color="#FF8A00">
            No Show
        </span>
        <span v-else-if="cellValue == 'V'" color="#C62583">
            Void
        </span>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({ 
    name: 'reservation_status',
    props: ['params'],
    setup(props) {
        const cellValue = props.params.valueFormatted ? props.params.valueFormatted : props.params.value;
        return {
            cellValue
        }
    }
})
</script> 