import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { AgGridVue } from "ag-grid-vue3";
import { nextTick, ref } from "vue";
import { Form } from "vee-validate";
import DepositReservationAPI from "@/services/api/hotel/reservation/deposit";
import ReservationAPI from "@/services/api/hotel/reservation/reservation";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import { getError } from "@/utils/general";
import { getToastError } from "@/utils/toast";
import global from "@/utils/global";
const depositReservationAPI = new DepositReservationAPI();
const reservationAPI = new ReservationAPI();
@Options({
  components: {
    "v-form": Form,
    CSelect,
    CInput,
    AgGridVue,
  },
  props: {
    reservationNumber: {
      type: Number,
      require: true,
    },
    isSaving: {
      type: Boolean,
    },
  },
})
export default class TransferForm extends Vue {
  public reservationNumber: any;
  public transferForm: any = ref();
  public form: any = {};
  public number: any = null;
  public options: any = {
    transferTypes: [
      { code: "F", name: "Folio" },
      { code: "R", name: "Reservation" },
    ],
    numbers: [],
  };
  columnOptions = [
    {
      label: "number",
      field: "number",
      align: "left",
      width: "100",
    },
    {
      field: "room_number",
      label: "roomNumber",
      align: "left",
      width: "100",
    },
    {
      field: "full_name",
      label: "name",
      align: "left",
      width: "150",
    },
  ];
  balance: any;

  initialize() {
    this.resetForm();
    this.getComboList();
  }

  async resetForm() {
    this.form = {};
    this.transferForm.resetForm();
    await nextTick();
    this.number = null;
    this.form = {
      type: "R",
      name: "",
      sub_folio_group: "A",
      full_name: "",
      amount: "",
      remark: "",
      room_number: "",
    };
    setInputFocus();
  }

  onSubmit() {
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  async onSave() {
    this.balance = await this.getBalanceDeposit();
    this.transferForm.$el.requestSubmit();
  }

  async onInvalidSubmit() {
    if (this.form.amount > this.balance) {
      getToastError(this.$t("messages.amountOverBalance"));
    }
    focusOnInvalid();
  }

  onChangeType() {
    this.form.number = "";
    this.number = "";
    this.getComboList();
  }

  onChangeNumber() {
    this.form.name = this.number ? this.number.full_name : "";
    this.form.number = this.number ? this.number.number : "";
  }

  async getComboList() {
    try {
      let params = {
        IsFolio: this.form.type == "F",
        ReservationNumber: this.reservationNumber,
      };
      const { data } = await depositReservationAPI.getTransferComboList(params);
      this.options.numbers = data;
    } catch (err) {
      getError(err);
    }
  }

  async getBalanceDeposit() {
    try {
      const params = {
        SystemCode: global.systemCode.Hotel,
        ReservationNumber: this.reservationNumber,
      };
      const { data } = await reservationAPI.getTotalDepositReservation(params);
      if (!data) return 0;
      return parseFloat(data);
    } catch (err) {
      getError(err);
      return 0;
    }
  }

  get transferDepositReservationToFolio() {
    return "";
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      Type: Yup.string()
        .required()
        .test(() => this.options.transferTypes.length > 0),
      Number: Yup.object().required(),
      "Sub Folio": Yup.string().required(),
      Amount: Yup.number()
        .required()
        .test((value: any) => {
          return value <= this.balance;
        }),
    });
  }
}
