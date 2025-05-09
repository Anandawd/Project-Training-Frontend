import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import $global from "@/utils/global";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { nextTick, reactive, ref, watch } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

@Options({
  name: "InputForm",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  public isSave: boolean = false;
  public activeTab: string = "earnings";

  public form: any = reactive({});

  // form settings
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];

  selectEmployeeOptions: any = [
    {
      SubGroupName: "Employee",
      code: "EMP001",
      name: "John Doe",
    },
    {
      SubGroupName: "Employee",
      code: "EMP001",
      name: "Sam Smith",
    },
  ];

  earningCategoryOptions: any = [
    {
      SubGroupName: "Earning Category",
      code: "EC01",
      name: "Fix Allowance",
    },
    {
      SubGroupName: "Earning Category",
      code: "EC02",
      name: "Variable Allowance",
    },
    {
      SubGroupName: "Earning Category",
      code: "EC03",
      name: "Incentive",
    },
  ];

  deductionsCategoryOptions: any = [
    {
      SubGroupName: "Deduction Category",
      code: "DC01",
      name: "Fix Deduction",
    },
    {
      SubGroupName: "Deduction Category",
      code: "DC02",
      name: "Variable Deduction",
    },
    {
      SubGroupName: "Deduction Category",
      code: "DC03",
      name: "Kasbon",
    },
  ];

  typeOptions: any = [
    {
      SubGroupName: "Type",
      code: "T01",
      name: "Earnings",
    },
    {
      SubGroupName: "Type",
      code: "T02",
      name: "Deductions",
    },
  ];

  booleanOptions: any = [
    {
      SubGroupName: "Options",
      code: "YES",
      name: "Yes",
    },
    {
      SubGroupName: "Options",
      code: "NO",
      name: "No",
    },
  ];

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      field: "code",
      label: "code",
      align: "right",
      width: "100",
    },
  ];

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      // Earnings tab
      earningsCode: "",
      earningsName: "",
      earningsDescription: "",
      earningCategory: "",
      earningDefaultAmount: 0,
      earningQty: 1,
      earningUnit: "",
      earningTaxable: "NO",
      earningIncludedBpjsEmplyoee: "NO",
      earningIncludedBpjsHealth: "NO",
      earningIncludedProrate: "NO",
      earningsShowInPayslip: "YES",
      earningsStatus: "A",

      // Deductions tab
      deductionsCode: "",
      deductionsName: "",
      deductionsDescription: "",
      deductionsCategory: "",
      deductionsDefaultAmount: 0,
      deductionsQty: 1,
      deductionsUnit: "",
      deductionsTaxable: "NO",
      deductionsIncludedBpjsEmplyoee: "NO",
      deductionsIncludedBpjsHealth: "NO",
      deductionsIncludedProrate: "NO",
      deductionsShowInPayslip: "YES",
      deductionsStatus: "A",

      // Statutory tab
      statutoryCode: "",
      statutoryName: "",
      statutoryDescription: "",
      statutoryType: "",
      statutoryDefaultAmount: 0,
      statutoryQty: 1,
      statutoryUnit: "",
      statutoryTaxable: "NO",
      statutoryShowInPayslip: "YES",
      statutoryStatus: "A",

      // Category tab
      categoryCode: "",
      categoryName: "",
      categoryDescription: "",
      categoryType: "",
      categoryStatus: "A",
    };
  }

  initialize() {
    this.resetForm();
    this.$nextTick(() => {
      this.detectActiveTab();
      this.setupTabChangeListeners();
    });
  }

  detectActiveTab() {
    const tabElements = {
      earnings: document.getElementById("form-earnings-tab"),
      deductions: document.getElementById("form-deductions-tab"),
      statutory: document.getElementById("form-statutory-tab"),
      category: document.getElementById("form-category-tab"),
    };

    for (const [tab, element] of Object.entries(tabElements)) {
      if (element && element.classList.contains("active")) {
        this.activeTab = tab;
        break;
      }
    }

    this.$nextTick(() => {
      if (this.inputFormValidation) {
        this.inputFormValidation.validateForm();
      }
    });
  }

  setupTabChangeListeners() {
    const tabElements = {
      earnings: document.getElementById("form-earnings-tab"),
      deductions: document.getElementById("form-deductions-tab"),
      statutory: document.getElementById("form-statutory-tab"),
      category: document.getElementById("form-category-tab"),
    };

    for (const [tab, element] of Object.entries(tabElements)) {
      if (element) {
        element.addEventListener("click", () => {
          this.activeTab = tab;
        });
      }
    }
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
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

  handleTabChange(tabName: string) {
    this.activeTab = tabName;
    this.$nextTick(() => {
      if (this.inputFormValidation) {
        this.inputFormValidation.validateForm();
      }
    });
  }

  private setEndDateForActiveStatus() {
    if (this.form.employeeStatus === 1 || this.form.employeeStatus === "1") {
      const today = new Date().toISOString().split("T")[0];
      this.form.endDate = today;
    }
  }

  // validation
  get schema() {
    return Yup.object().shape({
      earningsCode: Yup.string().when([], {
        is: () => this.activeTab === "earnings",
        then: Yup.string().required("Code is required"),
      }),
      earningsName: Yup.string().when([], {
        is: () => this.activeTab === "earnings",
        then: Yup.string().required("Name is required"),
      }),
      earningCategory: Yup.string().when([], {
        is: () => this.activeTab === "earnings",
        then: Yup.string().required("Category is required"),
      }),

      // Deductions tab validations
      deductionsCode: Yup.string().when([], {
        is: () => this.activeTab === "deductions",
        then: Yup.string().required("Code is required"),
      }),
      deductionsName: Yup.string().when([], {
        is: () => this.activeTab === "deductions",
        then: Yup.string().required("Name is required"),
      }),
      deductionsCategory: Yup.string().when([], {
        is: () => this.activeTab === "deductions",
        then: Yup.string().required("Category is required"),
      }),

      // Statutory tab validations
      statutoryCode: Yup.string().when([], {
        is: () => this.activeTab === "statutory",
        then: Yup.string().required("Code is required"),
      }),
      statutoryName: Yup.string().when([], {
        is: () => this.activeTab === "statutory",
        then: Yup.string().required("Name is required"),
      }),
      statutoryType: Yup.string().when([], {
        is: () => this.activeTab === "statutory",
        then: Yup.string().required("Type is required"),
      }),

      // Category tab validations
      categoryCode: Yup.string().when([], {
        is: () => this.activeTab === "category",
        then: Yup.string().required("Code is required"),
      }),
      categoryName: Yup.string().when([], {
        is: () => this.activeTab === "category",
        then: Yup.string().required("Name is required"),
      }),
      categoryType: Yup.string().when([], {
        is: () => this.activeTab === "category",
        then: Yup.string().required("Type is required"),
      }),
    });
  }

  get title() {
    let componentType = "";
    switch (this.activeTab) {
      case "earnings":
        componentType = "Earnings";
        break;
      case "deductions":
        componentType = "Deductions";
        break;
      case "statutory":
        componentType = "Statutory";
        break;
      case "category":
        componentType = "Category";
        break;
      default:
        componentType = "Component";
    }

    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }

  get isEndDateDisabled() {
    return this.form.employeeStatus === 1 || this.form.employeeStatus === "1";
  }

  created(): void {
    watch(
      () => this.form.employeeStatus,
      async (newStatus) => {
        const status =
          typeof newStatus === "string" ? parseInt(newStatus) : newStatus;

        await nextTick();

        if (status === 1) {
          this.setEndDateForActiveStatus();
        } else {
          this.form.endDate = "";
        }
      },
      { immediate: true }
    );
  }

  mounted(): void {
    this.setEndDateForActiveStatus();
  }
}
