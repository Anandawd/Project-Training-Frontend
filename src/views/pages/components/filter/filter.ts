import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import { reactive } from "vue";
import {
  formatDate3,
  formatDateTimeZeroUTC,
  formatDateDatabase,
} from "@/utils/format";
import { getError } from "@/utils/general";
import configStore from "@/stores/config";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
const configurationResource = new ConfigurationResource([
  "Company",
  "CompanyType",
]);

interface ISearchData {
  index: number;
  text: string;
  limit?: number;
  start_date?: string;
  end_date?: string;
  filter?: any[];
  group?: string;
}
@Options({
  components: {
    CCheckbox,
    CSelect,
    CDatepicker,
    CInput,
  },
  props: {
    //penulisan type data disini digunakan untuk memberi warning jika ada type data yang salah
    options: Array,
    searchDefault: {
      type: Object as () => ISearchData,
      require: true,
    },
    searchBy: {
      type: Boolean,
      default: true,
    },
    period: Array,
    limitPageSize: Number,
    formType: String,
    isGroupCheckIn: Boolean,
    dateRange: Boolean,
    isAuditDate: Boolean,
    dateRangeInline: Boolean,
    dateInLine: Boolean,
    date: Boolean,
    isEmptyDate: Boolean,
    dateRight: Boolean,
  },
  emits: ["search"],
})
export default class Filter extends Vue {
  public journalTypeOptions: any[];
  public options: any[];
  public period: any[];
  public formType: any;
  public groups: any[] = [];
  public searchDefault: any;
  public limitPageSize: number;
  public statusCode: string | number = "N";
  // public apRefundStatusCode: number = 0;
  public data: any = {
    index: 0,
    text: "",
    filter: [],
  };
  public listDropdown = [{}];
  vFolioType: any;
  vCancelCheckIn: any;
  totalPayment: number;
  config = configStore();
  dateRange: any;
  date: boolean;
  dateInline: boolean;
  dateRangeInline: any;
  isRefresh: boolean;
  isAuditDate: any;
  isEmptyDate: boolean;
  limit: any;

  public reset() {
    this.data = this.searchDefault;
    if (!this.data.filter) this.data.filter = [""];

    const pageSizeOptions = this.$global.pageSizeOptions;
    for (const i in this.$global.pageSizeOptions) {
      if (this.limitGrid >= pageSizeOptions[i]) {
        this.limit = pageSizeOptions[i];
      }
    }
    this.limit = this.limitGrid > 2500 ? 2500 : this.limit;
  }

  async initialize(activated?: boolean) {
    this.isRefresh = true;
    this.journalTypeOptions = [
      { text: this.$t("commons.filter.all"), value: 0 },
      { text: this.$t("commons.filter.general"), value: 1 },
      { text: this.$t("commons.filter.disbursement"), value: 2 },
      { text: this.$t("commons.filter.receive"), value: 3 },
      { text: this.$t("commons.filter.sales"), value: 4 },
      { text: this.$t("commons.filter.inventory"), value: 5 },
      { text: this.$t("commons.filter.fixedAsset"), value: 6 },
      { text: this.$t("commons.filter.adjustment"), value: 7 },
    ];

    if (!activated) this.reset();
    await this.rangeDate();
    if (
      this.formType === $global.formType.arCityLedger ||
      this.formType === $global.formType.arCityLedgerInvoice
    )
      this.loadCompany();
    if (this.formType === $global.formType.reservation) this.getGuestGroup();
    this.onRefresh();

    this.isRefresh = false;
  }

  public async rangeDate() {
    if (this.isEmptyDate) return;
    await this.config.getAuditDate();
    if (
      (!this.dateRange && this.date) ||
      (!this.dateRangeInline && this.dateInline)
    )
      return (this.data.start_date = formatDateDatabase(this.auditDate));
    if (
      !this.dateRange &&
      !this.date &&
      !this.dateRangeInline &&
      !this.dateInline
    )
      return;
    let date = new Date();
    if (this.isAuditDate) {
      date = new Date(this.auditDate);
    }
    const y = date.getFullYear(),
      m = date.getMonth();
    const from = new Date(y, m, 1);
    // m + 1 = bulan sekarang di tambah 1, sedangkan maksud 0 trsbt = sebelum tanggal 1 brrti tanggal sebelum tgl 1 (tgl 30/31)
    const to = new Date(y, m + 1, 0);
    this.data.start_date = formatDateDatabase(from);
    this.data.end_date = formatDateDatabase(to);
  }

  public dateCheck() {
    this.data.start_date = formatDateTimeZeroUTC(this.data.start_date);
    this.data.end_date = formatDateTimeZeroUTC(this.data.end_date);
    let from = this.data.start_date;
    let to = this.data.end_date;
    if (from >= to) {
      this.data.end_date = this.dateEndDate;
    }
  }

  public checkDate() {
    let from = formatDateTimeZeroUTC(this.data.start_date);
    let to = formatDateTimeZeroUTC(this.data.end_date);
    let startDate = new Date(from);
    let endDate = new Date(to);
    if (endDate < startDate) {
      this.data.end_date = this.data.start_date;
    }
  }

  public onChangeEndDate() {
    let from = formatDateTimeZeroUTC(this.data.start_date);
    let to = formatDateTimeZeroUTC(this.data.end_date);
    let startDate = new Date(from);
    let endDate = new Date(to);
    if (endDate < startDate) {
      this.data.start_date = this.data.end_date;
    }
    this.onRefresh();
  }

  public onChangeStartDate() {
    let from = formatDateTimeZeroUTC(this.data.start_date);
    let to = formatDateTimeZeroUTC(this.data.end_date);
    let startDate = new Date(from);
    let endDate = new Date(to);
    if (startDate > endDate) {
      this.data.end_date = this.data.start_date;
    }
    this.onRefresh();
  }

  public async onRefresh(limit?: number) {
    await this.$nextTick(() => {
      // this.checkDate();
    });
    const search = {
      index: this.data.index ?? undefined,
      text: this.data.text ?? undefined,
      limit: limit >= 0 ? limit : this.limit,
      start_date: this.data.start_date
        ? formatDateTimeZeroUTC(this.data.start_date)
        : undefined,
      end_date: this.data.end_date
        ? formatDateTimeZeroUTC(this.data.end_date)
        : undefined,
      filter: this.data.filter,
    };
    console.log("as");

    setTimeout(() => {
      this.$emit("search", search);
    }, 200);
  }

  public onDateChanges(limit?: number) {
    if (this.formType == $global.formType.bankTransaction) {
      const search = {
        index: this.data.index,
        text: this.data.text,
        limit: limit >= 0 ? limit : $global.agGrid.limitDefaultPageSize,
        start_date: this.data.start_date,
        end_date: this.data.end_date,
        filter: this.data.filter,
      };
      setTimeout(() => {
        this.$emit("search", search);
      }, 200);
    }
  }

  public toDateDisabled(date: any) {
    if (!this.data.from) return;
    const fromDate = new Date(this.data.start_date);
    fromDate.setDate(fromDate.getDate() - 1);
    return date < fromDate;
  }

  public onEnter() {
    this.onRefresh();
  }

  async getGuestGroup() {
    try {
      const { data } = await configurationResource.codeNameList("GuestGroup");
      this.groups = data;
    } catch (error) {
      getError(error);
    }
  }

  async loadCompany() {
    try {
      let params = ["Company", "CompanyType"];
      const { data } = await configurationResource.codeNameListArray(params);
      this.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  activated() {
    if (this.isRefresh) return;
    this.onRefresh();
  }

  mounted() {
    this.initialize();
  }

  get dateEndDate() {
    // const startDate = formatDateTimeZeroUTC(this.data.start_date);
    // const endDate = new Date(`${startDate}`);
    const endDate = new Date(this.data.start_date);
    endDate.setDate(endDate.getDate() + 1);
    return formatDate3(endDate);
  }

  get auditDate() {
    return this.config.auditDate;
  }

  get limitGrid() {
    return this.config.limitGrid;
  }
}
