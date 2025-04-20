import { Options, Vue } from "vue-class-component";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CModal from "@/components/modal/modal.vue";
import configModule from "@/stores/config";
import ReportAPI from "@/services/api/report";
import $global from "@/utils/global";
import { ref } from "vue";
import { formatDateDatabase } from "@/utils/format";
import { IColumnOptions } from "@/interfaces/general";
import { printPreview, sleep } from "@/utils/general";
const reportAPI = new ReportAPI();

@Options({
  components: {
    CInput,
    CRadio,
    CSelect,
    CDatepicker,
    CCheckbox,
    CModal,
  },
  props: {
    folioNumber: {
      type: Number,
      require: true,
    },
  },
  emits: ["close", "save"],
})
export default class PrintFolioOption extends Vue {
  public config = configModule();
  public reason: string = "";
  public show: any = false;
  public title: any = ref();
  public form: any = {};
  private folioNumber: number;
  public options: any = [{}];
  public splitBillOption: any = {};
  public folioCount = 0;
  public folioPreviewed = 0;
  columnOption: IColumnOptions[] = [
    {
      label: "belongsTo",
      field: "BelongTo",
      width: "100",
    },
    {
      label: "roomNumber",
      field: "RoomNumber",
      width: "100",
    },
    {
      label: "fullName",
      field: "FullName",
      width: "150",
    },
  ];
  showPrintCountDialog: boolean = false;
  guestCount: any = [];

  reset() {
    this.form = {
      breakdown: "1",
      sub_folio_group_code: "A",
      show_void: false,
      show_rate: this.showRate,
      currency_code: this.defaultCurrencyCode,
      possession_only: false,
      show_transferred: false,
    };
  }

  handleClose() {
    this.$emit("close");
  }

  print(guestNameCount: number) {
    const newTabReport = this.$router.resolve(
      `/report/preview?reportId=${$global.reportID.folio}&param=${
        this.folioNumber
      }${
        this.form.belongs_to ? "&param2=" + this.form.belongs_to : ""
      }&param3=${this.form.sub_folio_group_code}&param4=${
        this.form.show_void
      }&param5=${this.form.breakdown}&param6=${
        this.form.currency_code
      }&param7=${this.form.possession_only}&param8=${
        this.form.show_transferred
      }&param9=${this.form.start_date}&param10=${this.form.end_date}${
        this.form.contact_person1 ? "&param11=" + this.form.contact_person2 : ""
      }${
        this.form.contact_person2 ? "&param12=" + this.form.contact_person2 : ""
      }${
        this.form.contact_person3 ? "&param13=" + this.form.contact_person3 : ""
      }${
        this.form.contact_person4 ? "&param14=" + this.form.contact_person4 : ""
      }&guestNameCount=${guestNameCount}&template=${
        $global.stimulsoftReportFileDirectory.folio
      }`
    );

    printPreview(newTabReport.href);
  }

  async handlePrint() {
    let isSplit = false;
    if (this.form.contact_person1) {
      this.guestCount.push(1);
      isSplit = true;
      this.folioCount++;
    }
    if (this.form.contact_person2) {
      this.guestCount.push(2);
      isSplit = true;
      this.folioCount++;
    }
    if (this.form.contact_person3) {
      this.guestCount.push(3);
      isSplit = true;
      this.folioCount++;
    }
    if (this.form.contact_person4) {
      this.guestCount.push(4);
      isSplit = true;
      this.folioCount++;
    }

    if (!isSplit) {
      this.print(0);
    } else {
      this.handlePrintSplitBill();
    }
  }

  handlePrintSplitBill() {
    const folioCount = this.guestCount[this.folioPreviewed];
    this.folioPreviewed++;
    this.print(folioCount);
    if (this.folioPreviewed < this.folioCount) {
      this.showPrintCountDialog = true;
    } else {
      setTimeout(() => {
        this.showPrintCountDialog = false;
      }, 1000);
    }
  }

  async getPrintFolioOption() {
    try {
      const { data } = await reportAPI.getPrintFolioOption(this.folioNumber);
      this.form.start_date = formatDateDatabase(data.start_date);
      this.form.end_date = formatDateDatabase(data.end_date);

      this.splitBillOption.contact_person1 = data.profile.contact_person1;
      this.splitBillOption.contact_person2 = data.profile.contact_person2;
      this.splitBillOption.contact_person3 = data.profile.contact_person3;
      this.splitBillOption.contact_person4 = data.profile.contact_person4;
      this.form.show_rate = data.show_rate;
      this.options.belongsTo = data.belongs_to;
      this.options.subFolioGroup = data.sub_folio_group;
      this.options.currencies = data.currencies;
    } catch (err) {}
  }

  mounted() {
    this.reset();
    this.getPrintFolioOption();
  }

  get defaultCurrencyCode() {
    return this.config.defaultCurrency;
  }

  get showRate() {
    return this.config.showRate;
  }
}
