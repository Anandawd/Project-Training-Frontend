import { Options, Vue, prop } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import { BDropdown, BDropdownItem } from "bootstrap-vue-3";
import CCheckbox from "@/components/checkbox/checkbox.vue";
//component ag-grid
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { formatNumber } from "@/utils/format";
import { focusOnInvalid } from "@/utils/validation";
import ExtraChargeAPI from "@/services/api/hotel/reservation/extra-charge";
import { getToastSuccess } from "@/utils/toast";
import { reactive, ref } from "vue";
import * as Yup from "yup";
const extraChargeAPI = new ExtraChargeAPI();

@Options({
  components: {
    CSelect,
    CDatepicker,
    CCheckbox,
    CInput,
    BDropdown,
    BDropdownItem,
  },
  props: {
    isReservation: Boolean,
  },
})

export default class Breakdown extends Vue {
  public showForm: boolean = false;
  public options: any = {};
  public formElement: any = ref();
  public modeData: any = 0;
  titleNumber: any = 0
  rowData: any = []
  form: any = reactive({})
  isReservation: boolean = false
  isSaving: boolean = false
  columnOptionsAccount = [
    {
      label: "code",
      field: "code",
      align: "left",
      width: "100",
    },
    {
      label: "name",
      field: "name",
      align: "left",
      width: "120",
    },
  ];

  async initialize(params: any) {
    await this.$nextTick(()=>{
      this.resetForm();
    })
  }

  async handleInsert(params: any, mode: any) {
    this.form.extra_charge_id = params.id
    this.modeData = mode;
    this.showForm = true;
  }

  async handleEdit(params: any, mode: any) {
    this.modeData = $global.modeData.edit;
    await this.editData(params.id)
    this.form.extra_charge_id = this.isReservation ? this.form.reservation_extra_charge_id : this.form.guest_extra_charge_id
    this.showForm = true;
  }

 async handleDuplicate(params: any, mode: any){
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.id)
    this.form.extra_charge_id = this.isReservation ? this.form.reservation_extra_charge_id : this.form.guest_extra_charge_id
    this.showForm = true;
  }

  handleTracking() {
    //
  }

  onChangePerPax(){
    if(this.form.per_pax == 1){
      this.form.quantity = 1
    }
  }

  repeatLoadDropdownList(){
    this.$emit("repeatLoadDropdown")
  }

  repeatLoadDropdownProductList(){
    this.$emit("repeatLoadDropdownProduct", this.form.outlet_code)
  }

  onChangeOutlet(ev: any) {
    const data = this.options.Outlet
    const selectedDepartment = data.find((val: any) => {return val.code == ev.target.value})
    this.form.sub_department_code = selectedDepartment.sub_department_code
  }

  onChangeProduct(ev: any) {
    const data = this.options.Product
    const selectedProduct = data.find((val: any) => {return val.code == ev.target.value})
    this.form.account_code = selectedProduct.account_code
  }

  resetForm() {
    this.form = {
    };
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onClose() {
    this.showForm = false
    this.$emit("onClose")
  }

  handleSave() {
    this.isSaving = true;
    this.form.quantity = parseFloat(this.form.quantity)
    this.form.amount = parseFloat(this.form.amount)
    this.form.include_child = parseFloat(this.form.include_child)
    this.form.is_amount_percent = parseFloat(this.form.is_amount_percent)
    this.form.max_pax = parseFloat(this.form.max_pax)
    this.form.per_pax = parseFloat(this.form.per_pax)
    this.form.per_pax_extra = parseFloat(this.form.per_pax_extra)
    this.form.extra_pax = parseFloat(this.form.extra_pax)
    if (this.modeData == $global.modeData.insert || this.modeData == $global.modeData.duplicate) {
      this.insertData(this.form)
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(this.form)
    }
    this.isSaving = false;
  }

  async insertData(formData: any) {
    try {
      const { status2 } = this.isReservation ? await extraChargeAPI.InsertExtraChargeBreakdownReservation(formData) : await extraChargeAPI.InsertExtraChargeBreakdownInHouse(formData)
      if (status2.status == 0) {
        this.$emit("save")
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async editData(id: any) {
    try {
      const { data } = this.isReservation ? await extraChargeAPI.GetExtraChargeBreakdownReservation(id) : await extraChargeAPI.GetExtraChargeBreakdownInHouse(id)
      this.form = data
      this.showForm = true
    } catch (error) {
      throw getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const { status2 } = this.isReservation ? await extraChargeAPI.UpdateExtraChargeBreakdownReservation(formData) : await extraChargeAPI.UpdateExtraChargeBreakdownInHouse(formData)
      if (status2.status == 0) {
        this.$emit("save")
        this.showForm = false
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      throw getError(error);
    }
  }

  beforeMount() {

  }

  mounted(): void {
    this.resetForm();
  }

    // Validation
    get schemaBreakdown() {
      return Yup.object().shape({
        "Sub Department": Yup.string().required(),
        Account: Yup.string().required(),
        Quantity: Yup.number().required(),
        "Charge Frequency": Yup.string().required(),
        Amount: Yup.number().required().test((val) => {
          return val > 0
        })
      });
    }
    
  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t("title.extraChargeBreakdown")} ${this.$t(":#")} ${this.titleNumber}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t("title.extraChargeBreakdown")} ${this.$t(":#")} ${this.titleNumber}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t("title.extraChargeBreakdown")} ${this.$t(":#")} ${this.titleNumber}`;
    }
  }

}
