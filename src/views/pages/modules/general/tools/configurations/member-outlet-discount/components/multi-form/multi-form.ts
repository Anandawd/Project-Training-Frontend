import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";
import Product from "@/views/pages/modules/general/tools/configurations/components/product-discount-grid/product/product.vue";
import ProductDiscount from "@/views/pages/modules/general/tools/configurations/components/product-discount-grid/product-discount/product-discount.vue";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import { formatDateTimeZeroUTC } from "@/utils/format";
import {
  cloneObject,
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
const resourceAPI = new ConfigurationResource("MemberOutletDiscount");

@Options({
  name: "MultiForm",
  components: {
    CDatepicker,
    Product,
    ProductDiscount,
    BCardText,
    BCard,
    BTabs,
    BTab,
    Form,
    CRadio,
    CSelect,
    CInput,
    CCheckbox,
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

    schema: {
      type: Object,
      require: true,
    },
    defaultForm: {
      type: Object,
      require: false,
    },
  },
  emits: ["save", "close"],
})
export default class MultiForm extends Vue {
  multiFormElement: any = ref();
  productElement: any = ref();
  productDiscountElement: any = ref();
  modeData: any;
  public defaultForm: any = {};
  public form: any = reactive({});
  public disableFormRoom: boolean = false;
  public disableFormOutlet: boolean = false;
  public disableFormBanquet: boolean = false;
  listDropdown: any = {};

  repeatLoadDropdownList(){
    this.$emit("repeatLoadDropdown")
  }

  async resetForm() {
    this.multiFormElement.resetForm();
    this.$nextTick();
    this.form = {
      expire_date: formatDateTimeZeroUTC(new Date()),
    };
  }

  async insertDataProduct(dataProduct: any){
    await this.$nextTick(()=>{
      this.productDiscountElement.gridDrop(dataProduct,"")
    })
  }

  async onChangeOutlet(event: any) {
    if (this.modeData === $global.modeData.edit) {
      this.productElement.initialize(event.target.value);
      this.productDiscountElement.initialize(this.form.code, this.form.outlet_code);
      await this.loadDropdown();
      this.productElement.listDropdown = this.listDropdown;
    }
  }

  async loadDropdown() {
    try {
      const params = [
        "Outlet"
      ]
      const { data } = await resourceAPI.codeNameListArray(params);
      this.listDropdown = data;
      this.listDropdown.ProductCategory = await this.loadProductCategory()
    } catch (error) {
      getError(error);
    }
  }

  async loadProductCategory() {
    try {
      const { data } = await resourceAPI.GetPOSCategoryList(this.form.outlet_code)
      return data;
    } catch (error) {
      getError(error);
    }
  }

  async ifEdit() {
    this.productElement.initialize(this.form.outlet_code);
    this.productDiscountElement.initialize(this.form.code, this.form.outlet_code);
    await this.loadDropdown();
    this.productElement.listDropdown = this.listDropdown;
    await this.$nextTick(()=>{
      if(this.modeData === $global.modeData.duplicate){
        this.productElement.listDropdown = ""
        this.productElement.resetComp();
        this.productDiscountElement.resetComp();
      }
    })
  }

  initialize() {
    this.productElement.listDropdown = ""
    this.productElement.resetComp();
    this.productDiscountElement.resetComp();
    this.resetForm();
  }

  async onEdit(data: any) {
    this.form = data;
    this.productElement.listDropdown = this.listDropdown
    if(this.modeData === $global.modeData.duplicate){
      this.productElement.listDropdown = ""
      this.productElement.resetComp();
      this.productDiscountElement.resetComp();
    }
  }

  onSubmit() {
    this.multiFormElement.$el.requestSubmit();
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

  repeatLoadDropdown() {
    this.$emit("repeatLoadDropdown");
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
}
