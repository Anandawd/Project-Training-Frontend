import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import PurchaseOrderAPI from "@/services/api/assets/purchase-order/purchase-order";
const purchaseOrderAPI = new PurchaseOrderAPI();

@Options({
  name: "SupplierShippingForm",
  components: {
    Form,
    CRadio,
    CSelect,
    CInput,
    Checkbox,
    CDatepicker,
    AgGridVue,
  },
  props: {
    formType: {
      type: String,
      default: "",
      require: true,
    },
    modeData: {
      type: Number,
      require: true,
    },
  },
  watch: {
    "form.supply_shipping"(val) {
      this.$emit("getFormHeader", this.form);
    },
    "form.contact_person"(val) {
      this.$emit("getFormHeader", this.form);
    },
    "form.address"(val) {
      this.$emit("getFormHeader", this.form);
    },
    "form.city"(val) {
      this.$emit("getFormHeader", this.form);
    },
    "form.country_code"(val) {
      this.$emit("getFormHeader", this.form);
    },
    "form.state_code"(val) {
      this.$emit("getFormHeader", this.form);
    },
    "form.postal_code"(val) {
      this.$emit("getFormHeader", this.form);
    },
    "form.phone1"(val) {
      this.$emit("getFormHeader", this.form);
    },
    "form.fax"(val) {
      this.$emit("getFormHeader", this.form);
    },
    "form.phone2"(val) {
      this.$emit("getFormHeader", this.form);
    },
    "form.email"(val) {
      this.$emit("getFormHeader", this.form);
    },
  },
  emits: ["save", "close"],
})
export default class SupplierShippingForm extends Vue {
  formElement: any = ref();
  modeData: any;
  public rowData: any = [];
  public stateDropdown: any = [];
  public sendData: any = reactive({});
  public defaultForm: any = {};
  public formType: any;
  public form: any = reactive({});
  listDropdown: any = {};
  public adjustment: boolean = false;

  async resetForm() {
    this.formElement.resetForm();
    await this.$nextTick();
    this.form = {
      date: formatDateTimeUTC(new Date()),
    };
  }

  onChangeSupplyShipping() {
    this.loadMasterData(this.form.supply_shipping);
  }

  async loadMasterData(params: any) {
    try {
      const type: any =
        this.formType === $global.formType.supplier
          ? "Company"
          : "ShippingAddress";
      // console.log(type);
      const { data } = await purchaseOrderAPI.GetMasterData(type, params);
      this.form.contact_person = data.contact_person;
      this.form.address = data.street;
      this.form.city = data.city;
      this.form.country_code = data.country_code;
      this.form.state_code = data.state_code;
      this.form.postal_code = data.postal_code;
      this.form.phone1 = data.phone1;
      this.form.fax = data.fax;
      this.form.phone2 = data.phone2;
      this.form.email = data.email;
    } catch (error: any) {
      getError(error);
    }
  }

  async loadDropdownState(params: any) {
    try {
      const { data } = await purchaseOrderAPI.GetStateByCountry(params);
      this.stateDropdown = data;
    } catch (error: any) {
      getError(error);
    }
  }

  onChangeCountry() {
    this.loadDropdownState(this.form.country_code);
  }

  onSave() {
    this.$emit("save", this.form);
  }

  async initialize(listDropdown: any) {
    this.listDropdown = listDropdown;
    await this.resetForm();
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }
  // Validation
  get schemaForm() {
    return Yup.object().shape({
      supply_shipping: Yup.string().required(),
      // request_by: Yup.string().required(),
      // remark: Yup.string().required(),
    });
  }
}
