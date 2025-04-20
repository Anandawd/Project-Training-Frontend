<template>
    <input v-if="!params.node.rowPinned" type="checkbox" id="isCogsRender" name="isCogsRender"
        @click="checkedHandler($event)" :checked="params.value" />
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
    name: "CheckListRenderer",
    components: {},
    props: {},
    emits: ["params"],
})
export default class CheckListRenderer extends Vue {
    public params: any

    checkedHandler(event: any) {
        let checked = event.target.checked;
        let colId = this.params.column.colId;
        this.params.node.setDataValue(colId, checked);
    }
}
</script>