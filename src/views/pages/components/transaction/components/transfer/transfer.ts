import { Options, Vue } from "vue-class-component";
import Select from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { BTab, BTabs } from "bootstrap-vue-3";
import TransferAccountForm from "./account/account.vue";
import RoutingForm from "./routing/routing.vue";
import ReturnTransferForm from "./return/return.vue";

import { AgGridVue } from "ag-grid-vue3";
import $global from "@/utils/global";

@Options({
  components: {
    TransferAccountForm,
    RoutingForm,
    ReturnTransferForm,
    BTab,
    BTabs,
    Select,
    CInput,
    AgGridVue,
  },
  props: {
    transactionType: [String, Number],
    folioNumber: {
      type: Number,
      require: true,
    },
    roomNumber: {
      type: String,
      require: true,
    },
  },
  emits: ["close", "save"],
})
export default class TransferForm extends Vue {
  public folioNumber: number = 0;
  public form: any = {};
  public options: any = {};
  // GENERAL FUNCTION ================================================================
  initialize() {}
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
}
