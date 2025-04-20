import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import configStore from "@/stores/config";

@Options({
  name: "app-button",
  components: {
    CSelect,
  },
  props: {
    paginationData: Object,
    title: String,
  },
  watch: {
    "paginationData.Page"() {
      this.generatePagination();
    },
    "paginationData.Limit"() {
      this.generatePagination();
    },
  },
})
export default class Pagination extends Vue {
  config = configStore();
  pageSizeOptions: any[] = [];
  paginationData: any;
  currentPage: number = 1;
  totalPage: number = 1;
  totalCount: number = 34;
  paginationSize: number = 50;
  pagesArray: Array<number> = [];
  showFirstLastButtons: boolean = false;
  previousButtonDisabled: boolean = true;
  nextButtonDisabled: boolean = true;
  startIndex: number;
  endIndex: number;

  beforeMount(): void {
    this.pageSizeOptions = this.$global.pageSizeOptions;
    this.generatePagination();
  }

  onChangePageSize() {
    const data = {
      limit: this.paginationSize,
      page: 1,
    };
    this.$emit("onPaginationChange", data);
  }

  onPreviousPage() {
    if (this.previousButtonDisabled) return;
    const data = {
      limit: this.paginationSize,
      page: this.currentPage - 1,
    };
    if (data.page <= 0) data.page = 1;
    this.$emit("onPaginationChange", data);
  }

  onNextPage() {
    if (this.nextButtonDisabled) return;
    const data = {
      limit: this.paginationSize,
      page: this.currentPage + 1,
    };
    if (data.page <= 0) data.page = 1;
    this.$emit("onPaginationChange", data);
  }

  onPage(pageNumber: number) {
    const data = {
      limit: this.paginationSize,
      page: pageNumber,
    };
    if (data.page <= 0) data.page = 1;
    this.$emit("onPaginationChange", data);
  }

  generatePagination() {
    this.pagesArray = [1];
    this.currentPage = 1;
    if (this.paginationData) {
      this.totalPage = this.paginationData.TotalPages;
      this.currentPage = this.paginationData.Page;
      this.totalCount = this.paginationData.TotalCount;
      // for (const i in this.pageSizeOptions) {
      //   if (this.limitGrid >= this.pageSizeOptions[i]) {
      //     this.paginationSize = this.pageSizeOptions[i];
      //   }
      // }
      // this.paginationSize = this.limitGrid > 2500 ? 2500 : this.paginationSize;
      this.paginationSize = this.paginationData.Limit;
      if (this.paginationData.HasMore) {
        const startIndex = this.currentPage - 1;
        const endIndex = this.currentPage + 1;
        if (this.currentPage > 1) {
          this.pagesArray = [startIndex, this.currentPage, endIndex];
        } else {
          this.pagesArray = [this.currentPage, this.currentPage + 1];
        }
      } else {
        const startIndex = this.currentPage - 1;
        const endIndex = this.currentPage + 1;
        if (this.currentPage > 2) {
          this.pagesArray = [
            startIndex - 1,
            this.currentPage - 1,
            endIndex - 1,
          ];
        }
      }

      // console.log(this.paginationData);
      // console.log("pa", this.paginationData.Page);
      // console.log("cu", this.currentPage);
      // console.log("ar", this.pagesArray);
      // console.log("tt", this.totalPage);
    }

    this.previousButtonDisabled = this.currentPage <= 1;
    this.nextButtonDisabled = this.currentPage >= this.totalPage;
  }

  get screenSize() {
    return this.$store.getters["ui/screenSize"];
  }

  get limitGrid() {
    return this.config.limitGrid;
  }
}
