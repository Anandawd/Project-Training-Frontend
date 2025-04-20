import { Options, Vue } from "vue-class-component";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import Checkbox from "@/components/checkbox/checkbox.vue";
// import CRadio from "@/components/radio/radio.vue";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import { BTabs, BTab } from "bootstrap-vue-3";
import { cloneObject, getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";
import memberAPI from "@/services/api/hotel/member/member";
import Product from "./product/product.vue";
import ProductDiscount from "./product-discount/product-discount.vue";
import CDialog from "@/components/dialog/dialog.vue";
const MemberAPI = new memberAPI();

@Options({
  name: "InputForm",
  components: {
    BTabs,
    BTab,
    Form,
    // CRadio,
    CSelect,
    CInput,
    Checkbox,
    CDatepicker,
    Product,
    ProductDiscount,
    CDialog,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    isSaving: {
      type: Boolean,
    },
  },
  emits: ["save", "close"],
  watch: {
    modeData() {
      this.handleDisableCity();
    },
  },
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  Product: any = ref();
  ProductDiscount: any = ref();
  modeData: any;
  public defaultForm: any = {};
  public form: any = reactive({});
  public isOther: boolean = true;
  public isRPT: any = true;
  public isOPT: any = true;
  public isBPT: any = true;
  public showDialog: boolean = false;
  public modal: any = reactive({});
  public data_temp: any;
  public showDialogDelete: boolean = false;
  public deletedData: any;

  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];
  isSaving: boolean;

  // Dropdown Options
  listDropdown: any = {
    company: [],
    country: [],
    guestType: [],
    idCardType: [],
    nationality: [],
    title: [],
    state: [],
    city: [],
    roomPointType: [],
    outletPointType: [],
    banquetPointType: [],
    memberOutletDiscount: [],
    Outlet: [],
    Category: [],
  };
  // GENERAL FUNCTION ================================================================
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {};
    this.pointTypeChange(1);
    this.pointTypeChange(2);
    this.pointTypeChange(3);
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  repeatLoadDropdownList() {
    this.$emit("repeatLoadDropdown");
  }

  onSave() {
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }
  loadStatelist() {
    this.GetStateByCountry(this.form.country_code);
  }
  loadCitylist() {
    this.GetCityByState(this.form.state_code);
  }
  handleDisableCity() {
    if (this.form.city_code == "OTH") {
      this.isOther = false;
    } else {
      this.isOther = true;
    }
  }

  async handleresetAgGridProduct(mode: any) {
    this.Product.rowData = [];
    if (mode === $global.modeData.edit) {
      this.Product.isDisabled = false;
      this.Product.listDropdown.Outlet = this.listDropdown.Outlet;
      // this.Product.listDropdown.Category = this.listDropdown.Category
    } else {
      this.Product.isDisabled = true;
    }
  }
  async handleresetAgGridProductDiscount() {
    this.ProductDiscount.rowData = [];
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  pointTypeChange(type: number) {
    if (type === 1) {
      if (this.form.is_for_room) {
        this.form.roomPointType = "";
        this.isRPT = false;
      } else {
        this.form.roomPointType = "";
        this.isRPT = true;
      }
    } else if (type === 2) {
      if (this.form.is_for_outlet) {
        this.form.outletPointType = "";
        this.isOPT = false;
      } else {
        this.form.outletPointType = "";
        this.isOPT = true;
      }
    } else if (type === 3) {
      if (this.form.is_for_banquet) {
        this.form.banquetPointType = "";
        this.isBPT = false;
      } else {
        this.form.banquetPointType = "";
        this.isBPT = true;
      }
    }
  }
  async handleAddToProductDiscount(params: any) {
    this.data_temp = cloneObject(params);
    this.modal.product_name = this.data_temp.product_name;
    this.modal.discount = 0;
    this.showDialog = true;
  }
  async handleDeleteData(params: any) {
    this.showDialogDelete = true;
    this.deletedData = params;
  }
  async handleEditData(params: any) {
    await this.editToProductDiscount(params);
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async GetStateByCountry(country: any) {
    try {
      const { data } = await MemberAPI.GetStateByCountry(country);
      this.listDropdown.state = data;
    } catch (error) {
      getError(error);
    }
  }
  async GetCityByState(state: any) {
    try {
      const { data } = await MemberAPI.GetCityByState(state);
      this.listDropdown.city = data;
    } catch (error) {
      getError(error);
    }
  }
  async handleLoadProductDiscount(member_code: any) {
    try {
      const { data } = await MemberAPI.GetMemberProductDiscount(member_code);
      this.ProductDiscount.rowData = data;
    } catch (error) {
      getError(error);
    }
  }
  async addToProductDiscount() {
    try {
      let params: any = {
        product_code: this.data_temp.product_code,
        member_code: this.form.code,
        outlet_code: this.data_temp.outlet_code,
        discount: this.modal.discount ?? 0,
      };
      const { status2 } = await MemberAPI.ProcessMemberProductDiscount(params);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        await this.handleLoadProductDiscount(this.form.code);
        this.showDialog = false;
      }
    } catch (error) {
      getError(error);
    }
  }
  async editToProductDiscount(params: any) {
    try {
      const { status2 } = await MemberAPI.ProcessMemberProductDiscount(params);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        await this.handleLoadProductDiscount(this.form.code);
        this.showDialog = false;
      }
    } catch (error) {
      getError(error);
    }
  }
  async DeleteMemberProductDiscount() {
    try {
      const { status2 } = await MemberAPI.DeleteMemberProductDiscount(
        this.deletedData
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        await this.handleLoadProductDiscount(this.form.code);
        this.showDialogDelete = false;
      }
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================

  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER FUNCTION ======================================================
  get schema() {
    return Yup.object().shape({
      full_name: Yup.string().required(),
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-' symbol"
        )
        .required(),
      expired_date: Yup.string().required(),
      // room: Yup.string().required(),
      // expired_date: Yup.string().required(),
      // expired_date: Yup.string().required(),
    });
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
  // END GETTER AND SETTER FUNCTION ==================================================
}
