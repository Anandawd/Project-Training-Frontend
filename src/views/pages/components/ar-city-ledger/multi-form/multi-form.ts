import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import Folio from "../folio-form/folio-form.vue";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import { reactive, ref } from "vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { formatDateTimeUTC, formatDateTimeZone } from "@/utils/format";
import ARCityledger from "@/services/api/accounting/ar-city-ledger";
import configStore from "@/stores/config";
import { getError } from "@/utils/general";
const arCityledger = new ARCityledger();

@Options({
  name: "MultiForm",
  components: {
    Folio,
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
    schema: {
      type: Object,
      require: true,
    },
    defaultForm: {
      type: Object,
      require: false,
    },
    isSaving: {
      type: Boolean,
    },
    isFocus: {
      type: Boolean,
      default: false
    },
    // invoiceNumber: {
    //   type: String,
    //   // require: true
    // }
  },
  emits: ["save", "close"],
})
export default class MultiForm extends Vue {
  public config = configStore();
  multiFormValidation: any = ref();
  paymentElement: any = ref();
  detailElement: any = ref();
  public folioElement: any = ref();
  public folioRowData: any = [];
  public indexId: number = 0;
  modeData: any;
  invoiceNumber: any = ""
  disabledCity: boolean = true;
  public defaultForm: any = {};
  public form: any = reactive({});
  stateList: Array<any> = [];
  cityList: Array<any> = [];
  listDropdownCompany: any = [{}];
  listDropdown: any = {};
  countryCode: string;
  stateCode: any;

  async initialize() {
    await this.resetForm();
    await this.folioElement.initialize();
    this.folioElement.listDropdownFolio = []
  }

  repeatLoadDropdownList() {
    this.$emit("repeatLoadDropdown")
  }

  setRowDataId(rowData: any) {
    for (const i in rowData) {
      rowData[i].index_id = this.indexId++;
      rowData[i].amount = rowData[i].Amount;
      rowData[i].amount_charged = rowData[i].AmountCharged;
      rowData[i].curr = rowData[i].currency_code;
      rowData[i].amountChargeF = rowData[i].AmountChargedForeign;
    }
    return rowData;
  }

  async onEdit(formData: any) {
    this.invoiceNumber = formData.invoice.number
    this.form.issued_date = formatDateTimeZone(formData.invoice.issued_date);
    this.form.due_date = formatDateTimeZone(formData.invoice.due_date);
    this.form.company_code = formData.invoice.company_code;
    this.form.contact_person = formData.invoice.full_name;
    this.form.street = formData.invoice.street;
    this.form.country_code = formData.invoice.country_code;
    this.form.postal_code = formData.invoice.postal_code;
    this.form.phone = formData.invoice.phone1;
    this.form.fax = formData.invoice.fax;
    this.form.remark = formData.invoice.remark;
    this.folioElement.getDataGrid(this.setRowDataId(formData.folio_list));
    this.folioElement.id = this.indexId;
    this.form.state_code = formData.invoice.state_code;
    this.form.city_code = formData.invoice.city_code;
    this.form.city = formData.invoice.city;
    this.folioElement.InvoiceNumber = formData.invoice.number
    this.folioElement.CompanyCode = formData.invoice.company_code

    if (formData.invoice.country_code) {
      this.getStateList(formData.invoice.country_code);
    }

    if (formData.invoice.state_code) {
      this.getCityList(formData.invoice.state_code);
    }

    this.folioElement.loadFolio(formData.invoice.company_code, this.invoiceNumber);
  }

  onSubmit() {
    this.multiFormValidation.$el.requestSubmit();
  }

  onSave() {
    this.form.invoice_number = this.invoiceNumber
    this.form.folio_list = this.folioElement.setFolioList()
    this.form.issued_date = formatDateTimeUTC(this.form.issued_date);
    this.form.due_date = formatDateTimeUTC(this.form.due_date);
    this.$emit("save", this.form);
    this.folioElement.resetFormFolio();
  }

  onClose() {
    this.$emit("close");
    this.folioElement.resetFormFolio();
  }

  onChangeCompanyCode(event: any) {
    const code = event.target.value;
    this.setAddress(code);
    this.folioElement.loadFolio(code, this.invoiceNumber);
    this.folioElement.CompanyCode = code
  }

  onChangeCountryCode(event: any) {
    if (event.target.value) {
      this.getStateList(event.target.value);
    } else {
      this.stateList = []
    }
  }

  onChangeStateCode(event: any) {
    if (event.target.value) {
      this.getCityList(event.target.value);
    } else {
      this.cityList = []
    }
  }

  onChangeCity(event: any) {
    const code = event.target.value;
    this.disabledCity = code != $global.constCityOtherCode;
    this.form.city = "";
  }

  onChangeCityInput() {
    if (this.form.city_code != "OTH") {
      this.form.city_code = "";
    }
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  async resetForm() {
    this.multiFormValidation.resetForm();
    await this.$nextTick();
    let date = new Date();
    const startDate = new Date(date.setDate(date.getDate()));
    let endDate = new Date(date.setDate(date.getDate() + 7));
    this.form = {
      issued_date: formatDateTimeUTC(startDate),
      due_date: formatDateTimeUTC(endDate),
    };
    this.stateList = [];
    this.cityList = [];
    setInputFocus();
  }

  onChangeStartDate(startDate: any) {
    let date = new Date(startDate);
    let endDate = new Date(date.setDate(date.getDate() + 7));
    this.form.due_date = formatDateTimeUTC(endDate);
  }

  async setAddress(code: string) {
    const companyList = this.listDropdownCompany;
    for (const i of companyList) {
      if (i.code == code) {
        this.form.contact_person = i.contact_person;
        this.form.street = i.street;
        this.form.country_code = i.country_code;
        if (i.city) {
          this.getStateList(i.country_code);
          this.form.city = i.city;
        }

        this.form.state_code = i.state_code;
        if (i.country_code) {
          this.getCityList(i.state_code);
        }
        this.form.postal_code = i.postal_code;
        this.form.phone = i.phone1;
        this.form.fax = i.fax;
      }
    }
  }

  async getStateList(countryCode: any) {
    try {
      const { data } = await arCityledger.StateByCountry(countryCode);
      this.stateList = data;
    } catch (error) {
      getError(error);
    }
  }

  async getCityList(stateCode: any) {
    try {
      const { data } = await arCityledger.CityByState(stateCode);
      this.cityList = data;
    } catch (error) {
      getError(error);
    }
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t("title.invoice")}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t("title.invoice")}`;
    }
  }

  get auditDate() {
    return this.config.auditDate;
  }
}
