import { Options, Vue } from 'vue-class-component';
import Checkbox from "../checkbox/checkbox.vue";

@Options({
    name: "CheckboxEditor",
    components: {
        Checkbox
    },
    props: ["params"]
})
export default class CheckboxEditor extends Vue {
    public params: any
    public value: boolean = false

    // GENERAL FUNCTION ================================================================
    getValue() {
        return this.value;
    }

    afterGuiAttached() {
        this.value = this.params.value
    }

    isPopup() {
        return false;
    }

    onChange() {
        this.params.api.stopEditing();
    }
    // END GENERAL FUNCTION ============================================================
    // HANDLE UI =======================================================================

    // END HANDLE UI====================================================================
    // API REQUEST======================================================================

    // END API REQUEST==================================================================
    // RECYCLE LIFE FUNCTION ===========================================================

    // END RECYCLE LIFE FUNCTION =======================================================

    // GETTER AND SETTER ===============================================================

    // VALIDATION ======================================================================

    // END GETTER AND SETTER ===========================================================
}
