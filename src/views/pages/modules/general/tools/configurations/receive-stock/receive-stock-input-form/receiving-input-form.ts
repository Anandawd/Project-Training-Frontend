import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import ReceiveForm from "./receive-form/receive-form.vue";
import DirectlyForm from "./directly-form/directly-form.vue";
import DetailForm from "./detail-form/detail-form.vue";
import TotalForm from "./total-form/total-form.vue";
import PaymentForm from "./payment-form/payment-form.vue";
import { getToastError, getToastSuccess } from "@/utils/toast";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import * as Yup from "yup";
import configStore from "@/stores/config";

@Options({
  name: "MultiForm",
  components: {
    ReceiveForm,
    DirectlyForm,
    TotalForm,
    DetailForm,
    PaymentForm,
    Form,
    CRadio,
    CSelect,
    CInput,
    CCheckbox,
    CDatepicker,
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

    defaultForm: {
      type: Object,
      require: false,
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormElement: any = ref();
  receiveFormElement: any = ref();
  directlyFormElement: any = ref();
  totalFormElement: any = ref();
  paymentFormElement: any = ref();
  detailFormElement: any = ref();
  modeData: any;
  config: any = configStore();
  public form: any = reactive({});
  public sendDate: any = null;
  public subTotal: any = null;
  public dataFormDebit: any = null;
  public dataFormCredit: any = null;
  public dataFormHeader: any = null;
  public sendData: any = {};
  public dataGeneral: any = {};
  public disableFormDetail: boolean = false;
  public disableFormTotal: boolean = false;
  listDropdown: any = {};

  async resetForm() {
    this.inputFormElement.resetForm();
    this.$nextTick();
    // this.form = this.headerFormElement.form
  }

  async initialize() {
    this.resetForm();
    this.directlyFormElement.initialize(this.listDropdown);
    this.receiveFormElement.initialize(this.listDropdown);
    this.detailFormElement.initialize(this.listDropdown);
    this.paymentFormElement.initialize(this.listDropdown);
    //  await this.shippingFormElement.initialize(this.listDropdown)
  }

  onSubmit() {
    this.sendData.item_details = this.detailFormElement.getRowData();
    // this.supplierFormElement.onSubmit()
    // this.shippingFormElement.onSubmit()
    if (this.sendData.item_details.length > 0) {
      this.inputFormElement.$el.requestSubmit();
    } else {
      getToastError(this.$t("Please Insert Detail"));
    }
  }

  disableForm(disable: boolean) {
    // console.log('disable1');
    // console.log(disable);

    this.disableFormDetail = disable;
  }

  disableSeparate(disable: boolean) {
    console.log(disable);

    this.disableFormTotal = disable;
  }

  onEdit(data: any) {
    // this.generalFormElement.form = data.data
    // this.expeditionFormElement.form = data.data
    // this.supplierFormElement.form.supply_shipping = data.data.company_code
    // this.supplierFormElement.onChangeSupplyShipping(data.company_code)
    // this.shippingFormElement.form = data.data
    // this.shippingFormElement.form.address = data.data.street
    // this.shippingFormElement.form.supply_shipping = data.data.shipping_address_code
    // this.detailFormElement.rowData = data.detail
  }

  onGetDetailList(rowData: any) {
    this.subTotal = rowData.reduce(
      (a: any, b: { total_price: any }) =>
        parseFloat(a) + parseFloat(b.total_price),
      0
    );
  }

  onSave() {
    this.$emit("save", this.sendData);
  }

  onClose() {
    this.$emit("close");
  }

  // onGetFormListGeneral(val: any){
  //   this.sendData.date = val.date
  //   this.sendData.request_by = val.request_by
  //   this.sendData.remark = val.remark
  // }
  // onGetFormListExpedition(val: any){
  //   this.sendData.expedition_code = val.expedition_code
  // }
  // onGetFormListSupplier(val: any){
  //   this.sendData.company_code = val.supply_shipping
  // }
  // onGetFormListShipping(val: any){
  //   this.sendData.shipping_address_code = val.supply_shipping
  //   this.sendData.contact_person = val.contact_person
  //   this.sendData.street = val.address
  //   this.sendData.city = val.city
  //   this.sendData.country_code = val.country_code
  //   this.sendData.state_code = val.state_code
  //   this.sendData.postal_code = val.postal_code
  //   this.sendData.phone1 = val.phone1
  //   this.sendData.fax = val.fax
  //   this.sendData.phone2 = val.phone2
  //   this.sendData.email = val.email
  // }

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

  get auditDate() {
    return this.config.auditDate;
  }

  // Validation
  // get schema() {
  //   return Yup.object().shape({
  //     date: Yup.string().required(),
  // request_by: Yup.string().required(),
  // remark: Yup.string().required(),
  // });
  // }
}
