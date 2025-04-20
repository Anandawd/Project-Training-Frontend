<template>
    <checkbox disabled class="justify-content-center h-100" id="doNotRevenueJournal" v-model="value" type="checkbox">
</checkbox>
</template>
<script>
import { computed, defineComponent } from "vue";
import Checkbox from "../checkbox/checkbox.vue";

export default defineComponent({
    name: "CheckboxCell",
    components: {
        Checkbox
    },
    props: ["params"],
    computed: {
        value(){
            return this.params.value
        }
    }
})
</script>