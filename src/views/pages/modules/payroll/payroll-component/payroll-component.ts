import CDialog from "@/components/dialog/dialog.vue";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";

import PayrollComponentsAPI from "@/services/api/payroll/payroll-components/payroll-component";
import DeductionsTableComponent from "./components/deductions/deductions-table.vue";
import EarningsTableComponent from "./components/earnings/earnings-table.vue";
import StatutoryTableComponent from "./components/statutory/statutory-table.vue";

import OrganizationAPI from "@/services/api/payroll/organization/organization";
import DeductionsInputForm from "./components/deductions/deductions-component-input-form/deductions-component-input-form.vue";
import EarningsInputForm from "./components/earnings/earnings-component-input-form/earnings-component-input-form.vue";
import StatutoryInputForm from "./components/statutory/statutory-component-input-form/statutory-component-input-form.vue";

const payrollComponentsAPI = new PayrollComponentsAPI();
const organizationAPI = new OrganizationAPI();

@Options({
  components: {
    AgGridVue,
    CDialog,
    EarningsInputForm,
    DeductionsInputForm,
    StatutoryInputForm,
    DeductionsTableComponent,
    EarningsTableComponent,
    StatutoryTableComponent,
  },
})
export default class PayrollComponents extends Vue {
  // data
  public rowEarningsData: any = [];
  public rowDeductionsData: any = [];
  public rowStatutoryData: any = [];

  // form
  public dataType: any = "";
  public showForm: boolean = false;
  public modeData: any;
  earningsFormElement: any = ref();
  deductionsFormElement: any = ref();
  statutoryFormElement: any = ref();

  // table refs
  earningsTableRef: any = ref();
  deductionsTableRef: any = ref();
  statutoryTableRef: any = ref();

  // options
  public earningsCategoryOptions: any[];
  public deductionsCategoryOptions: any[];
  public statutoryCategoryOptions: any[];
  public placementOptions: any[];
  public typeOptions: any[];
  public unitOptions: any[];

  // modal
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";
  public deleteParam: any = null;

  public isSaving: boolean = false;

  // RECYCLE LIFE FUNCTION =======================================================
  mounted(): void {
    this.loadData();
  }

  // GENERAL FUNCTION =======================================================
  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;
    if (typeof params === "string") {
      this.dataType = params;
    }

    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        switch (this.dataType) {
          case "EARNINGS":
            this.earningsFormElement.initialize();
            break;
          case "DEDUCTIONS":
            this.deductionsFormElement.initialize();
            break;
          case "STATUTORY":
            this.statutoryFormElement.initialize();
            break;
        }
      } else if (mode === $global.modeData.edit && params) {
        this.loadEditData(params);
      }
    });

    this.showForm = true;
  }

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);
    console.log("formattedData", formattedData);

    this.isSaving = true;
    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData);
    } else {
      this.updateData(formattedData);
    }
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogAction = "delete";
    switch (this.dataType) {
      case "EARNINGS":
        this.dialogMessage = this.$t("messages.payroll.confirm.deleteEarnings");
        break;
      case "DEDUCTIONS":
        this.dialogMessage = this.$t(
          "messages.payroll.confirm.deleteDeductions"
        );
        break;
      case "STATUTORY":
        this.dialogMessage = this.$t(
          "messages.payroll.confirm.deleteStatutory"
        );
        break;
    }
    this.showDialog = true;
  }

  handleTableAction(params: any) {
    switch (params.event) {
      case "EDIT":
        this.dataType = params.type;
        this.handleEdit(params.params);
        break;
      case "DELETE":
        console.log("delete params", params);
        this.dataType = params.type;
        console.log("delete dataType", this.dataType);
        this.handleDelete(params.params);
        break;
      default:
        this.dataType = "";
        this.showForm = false;
        this.handleShowForm(params.type, $global.modeData.insert);
        break;
    }
  }

  confirmAction() {
    this.showDialog = false;
    this.deleteData();

    this.dataType = "";
    this.showDialog = false;
    this.dialogAction = "";
  }

  handleToComponentCategory() {
    this.$router.push({
      name: "ComponentCategory",
    });
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      await Promise.all([
        this.loadEarningsData(),
        this.loadDeductionsData(),
        this.loadStatutoryData(),
      ]);
      this.loadDropdown();
      // this.loadMockData();
    } catch (error) {
      getError(error);
    }
  }

  async loadEarningsData() {
    try {
      const { data: earningsData } =
        await payrollComponentsAPI.GetEarningsComponentList();
      if (earningsData) {
        this.rowEarningsData = earningsData;
      } else {
        this.rowEarningsData = [];
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDeductionsData() {
    try {
      const { data: deductionsData } =
        await payrollComponentsAPI.GetDeductionsComponentList();
      if (deductionsData) {
        this.rowDeductionsData = deductionsData;
      } else {
        this.rowDeductionsData = [];
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadStatutoryData() {
    try {
      const { data: statutoryData } =
        await payrollComponentsAPI.GetStatutoryComponentList({
          Index: 0,
          Text: "",
          IndexCheckbox: 0,
        });
      if (statutoryData) {
        this.rowStatutoryData = statutoryData;
      } else {
        this.rowStatutoryData = [];
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDataGrid(type: any = this.dataType) {
    switch (type) {
      case "EARNINGS":
        if (this.earningsTableRef) {
          this.earningsTableRef.refreshGrid();
        }
        break;
      case "DEDUCTIONS":
        if (this.deductionsTableRef) {
          this.deductionsTableRef.refreshGrid();
        }
        break;
      case "STATUTORY":
        if (this.statutoryTableRef) {
          this.statutoryTableRef.refreshGrid();
        }
        break;
    }
  }

  async loadEditData(params: any) {
    try {
      console.log("loadEditData", params);
      switch (this.dataType) {
        case "EARNINGS":
          const { data: earnings } =
            await payrollComponentsAPI.GetPayrollComponent(params.id);
          this.$nextTick(() => {
            this.earningsFormElement.form = this.populateForm(earnings);
          });
          break;
        case "DEDUCTIONS":
          const { data: deductions } =
            await payrollComponentsAPI.GetPayrollComponent(params.id);
          this.$nextTick(() => {
            this.deductionsFormElement.form = this.populateForm(deductions);
          });
          break;
        case "STATUTORY":
          const { data: statutory } = await payrollComponentsAPI.GetStatutory(
            params.id
          );
          this.$nextTick(() => {
            this.statutoryFormElement.form = this.populateForm(statutory);
          });
          break;
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const promises = [
        organizationAPI.GetPlacementActiveList({}).then((response) => {
          this.placementOptions = response.data;
        }),
        payrollComponentsAPI.GetEarningsCategoryList().then((response) => {
          this.earningsCategoryOptions = response.data;
        }),
        payrollComponentsAPI.GetDeductionsCategoryList().then((response) => {
          this.deductionsCategoryOptions = response.data;
        }),
        payrollComponentsAPI.GetStatutoryCategoryList().then((response) => {
          this.statutoryCategoryOptions = response.data;
        }),
        payrollComponentsAPI.GetComponentTypeList().then((response) => {
          this.typeOptions = response.data;
        }),
        payrollComponentsAPI.GetComponentUnitList().then((response) => {
          this.unitOptions = response.data;
        }),
      ];

      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async loadMockData() {
    this.rowEarningsData = [
      {
        id: 1,
        code: "CE001",
        name: "Tunjangan Transportasi",
        description: "-",
        category: "Variable Allowance",
        default_amount: 200000,
        quantity: 1,
        unit: "",
        taxable: true,
        included_bpjs_health: true,
        included_bpjs_employee: true,
        show_in_payslip: true,
        active: true,
        entity_type: "earnings",
      },
      {
        id: 2,
        code: "CE002",
        name: "Tunjangan Rumah",
        description: "-",
        category: "Fix Allowance",
        default_amount: 200000,
        quantity: 1,
        unit: "",
        taxable: true,
        included_bpjs_health: true,
        included_bpjs_employee: true,
        show_in_payslip: true,
        active: true,
        entity_type: "earnings",
      },
      {
        id: 3,
        code: "CE003",
        name: "Tunjangan Makan",
        description: "-",
        category: "Variable Allowance",
        default_amount: 200000,
        quantity: 1,
        unit: "",
        taxable: true,
        included_bpjs_health: true,
        included_bpjs_employee: true,
        show_in_payslip: true,
        active: true,
        entity_type: "earnings",
      },
      {
        id: 4,
        code: "CE004",
        name: "Tunjangan Fasilitas",
        description: "-",
        category: "Fix Allowance",
        default_amount: 30000,
        quantity: 1,
        unit: "Day",
        taxable: true,
        included_bpjs_health: true,
        included_bpjs_employee: true,
        show_in_payslip: true,
        active: true,
        entity_type: "earnings",
      },
      {
        id: 5,
        code: "CE005",
        name: "Bonus",
        description: "-",
        category: "Incentive",
        default_amount: 200000,
        quantity: 1,
        unit: "",
        taxable: true,
        included_bpjs_health: false,
        included_bpjs_employee: false,
        show_in_payslip: true,
        active: true,
        entity_type: "earnings",
      },
      {
        id: 6,
        code: "CE006",
        name: "Uang Lembur",
        description: "-",
        category: "Incentive",
        default_amount: 50000,
        quantity: 1,
        unit: "Hour",
        taxable: true,
        included_bpjs_health: false,
        included_bpjs_employee: false,
        show_in_payslip: true,
        active: true,
        entity_type: "earnings",
      },
    ];

    this.rowDeductionsData = [
      {
        code: "DE001",
        name: "Biaya Jabatan",
        description: "Khusus Manager",
        category: "Fix Deduction",
        default_amount: 200000,
        quantity: 1,
        unit: "",
        taxable: true,
        included_bpjs_health: true,
        included_bpjs_employee: true,
        show_in_payslip: true,
        active: true,
        entity_type: "deductions",
      },
      {
        code: "DE002",
        name: "Unpaid Leave",
        description: "-",
        category: "Variable Deduction",
        default_amount: 200000,
        quantity: 1,
        unit: "",
        taxable: true,
        included_bpjs_health: true,
        included_bpjs_employee: true,
        show_in_payslip: true,
        active: true,
        entity_type: "deductions",
      },
      {
        code: "DE003",
        name: "Cicilan Kasbon",
        description: "-",
        category: "Kasbon",
        default_amount: 200000,
        quantity: 1,
        unit: "",
        taxable: false,
        included_bpjs_health: false,
        included_bpjs_employee: false,
        show_in_payslip: true,
        active: true,
        entity_type: "deductions",
      },
      {
        code: "DE004",
        name: "Late Arrival",
        description: "-",
        category: "Variable Allowance",
        default_amount: 30000,
        quantity: 1,
        unit: "Hour",
        taxable: false,
        included_bpjs_health: false,
        included_bpjs_employee: false,
        show_in_payslip: true,
        active: true,
        entity_type: "deductions",
      },
      {
        code: "dE005",
        name: "Iuran Keagamaan",
        description: "-",
        category: "Fix Deduction",
        default_amount: 200000,
        quantity: 1,
        unit: "",
        taxable: true,
        included_bpjs_health: false,
        included_bpjs_employee: false,
        show_in_payslip: true,
        active: true,
        entity_type: "deductions",
      },
    ];

    this.rowStatutoryData = [
      {
        code: "STAT_E002_JKK",
        name: "BPJS JKK Perusahaan",
        description: "Kontribusi JKK oleh perusahaan",
        type: "Earnings",
        default_amount: 0.24,
        quantity: 1,
        unit: "Percent",
        taxable: true,
        show_in_payslip: true,
        active: true,
        entity_type: "statutory",
      },
      {
        code: "STAT_E003_JKM",
        name: "BPJS JKM Perusahaan",
        description: "Kontribusi JKM oleh perusahaan",
        type: "Earnings",
        default_amount: 0.3,
        quantity: 1,
        unit: "Percent",
        taxable: true,
        show_in_payslip: true,
        active: true,
        entity_type: "statutory",
      },
      {
        code: "STAT_E001_JHT",
        name: "BPJS JHT Perusahaan",
        description: "Kontribusi 3.7% JHT oleh perusahaan",
        type: "Earnings",
        default_amount: 3.7,
        quantity: 1,
        unit: "Percent",
        taxable: false,
        show_in_payslip: true,
        active: true,
        entity_type: "statutory",
      },
      {
        code: "S004",
        name: "BPJS JHT Karyawan",
        description: "Potongan 2% JHT oleh karyawan",
        type: "Deductions",
        default_amount: 2,
        quantity: 1,
        unit: "Percent",
        taxable: false,
        show_in_payslip: true,
        active: true,
        entity_type: "statutory",
      },
      {
        code: "S005",
        name: "BPJS Kesehatan Perusahaan",
        description: "Kontribusi 4% dari gaji pokok oleh perusahaan",
        type: "Earnings",
        default_amount: 20000,
        quantity: 1,
        unit: "",
        taxable: true,
        show_in_payslip: true,
        active: true,
        entity_type: "statutory",
      },
      {
        code: "STAT_D002",
        name: "BPJS Kesehatan Karyawan",
        description: "Potongan 1% dari gaji pokok untuk BPJS Kesehatan",
        type: "Deductions",
        default_amount: 20000,
        quantity: 1,
        unit: "",
        taxable: true,
        show_in_payslip: true,
        active: true,
        entity_type: "statutory",
      },
    ];
  }

  async insertData(formData: any) {
    try {
      switch (this.dataType) {
        case "EARNINGS":
          const { status2: earnings } =
            await payrollComponentsAPI.InsertPayrollComponent(formData);
          if (earnings.status === 0) {
            getToastSuccess(this.$t("messages.payroll.success.saveEarnings"));
            this.$nextTick();
            this.loadEarningsData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
        case "DEDUCTIONS":
          const { status2: deductions } =
            await payrollComponentsAPI.InsertPayrollComponent(formData);
          if (deductions.status === 0) {
            getToastSuccess(this.$t("messages.payroll.success.saveDeductions"));
            this.$nextTick();
            this.loadDeductionsData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
        case "STATUTORY":
          const { status2: statutory } =
            await payrollComponentsAPI.InsertStatutory(formData);
          if (statutory.status === 0) {
            getToastSuccess(this.$t("messages.payroll.success.saveStatutory"));
            this.$nextTick();
            this.loadStatutoryData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateData(formData: any) {
    try {
      switch (this.dataType) {
        case "EARNINGS":
          const { status2: earnings } =
            await payrollComponentsAPI.UpdatePayrollComponent(formData);
          if (earnings.status === 0) {
            getToastSuccess(this.$t("messages.payroll.success.saveEarnings"));
            this.$nextTick();
            this.loadEarningsData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
        case "DEDUCTIONS":
          const { status2: deductions } =
            await payrollComponentsAPI.UpdatePayrollComponent(formData);
          if (deductions.status === 0) {
            getToastSuccess(this.$t("messages.payroll.success.saveDeductions"));
            this.$nextTick();
            this.loadDeductionsData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
        case "STATUTORY":
          const { status2: statutory } =
            await payrollComponentsAPI.UpdateStatutory(formData);
          if (statutory.status === 0) {
            getToastSuccess(this.$t("messages.payroll.success.saveStatutory"));
            this.$nextTick();
            this.loadStatutoryData();
            this.loadDropdown();
            this.showForm = false;
          }
          break;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async deleteData() {
    try {
      console.log("deleteData", this.deleteParam);
      switch (this.dataType) {
        case "EARNINGS":
          const { status2: earnings } =
            await payrollComponentsAPI.DeletePayrollComponent(this.deleteParam);
          if (earnings.status === 0) {
            getToastSuccess(this.$t("messages.payroll.success.deleteEarnings"));
            this.$nextTick();
            this.loadEarningsData();
            this.loadDropdown();

            this.deleteParam = null;
          }
          break;
        case "DEDUCTIONS":
          const { status2: deductions } =
            await payrollComponentsAPI.DeletePayrollComponent(this.deleteParam);
          if (deductions.status === 0) {
            getToastSuccess(
              this.$t("messages.payroll.success.deleteDeductions")
            );
            this.$nextTick();
            this.loadDeductionsData();
            this.loadDropdown();
            this.deleteParam = null;
          }
          break;
        case "STATUTORY":
          const { status2: statutory } =
            await payrollComponentsAPI.DeleteStatutory(this.deleteParam);
          if (statutory.status === 0) {
            getToastSuccess(
              this.$t("messages.payroll.success.deleteStatutory")
            );
            this.$nextTick();
            this.loadStatutoryData();
            this.loadDropdown();
            this.deleteParam = null;
          }
          break;
      }
    } catch (error) {
      getError(error);
    }
  }

  // HELPER FUNCTION =======================================================
  populateForm(params: any) {
    switch (this.dataType) {
      case "EARNINGS":
        return {
          id: params.id,
          code: params.code,
          name: params.name,
          description: params.description,
          category_code: params.category_code,
          type: params.type,
          default_amount: params.default_amount,
          default_quantity: params.default_quantity,
          unit: params.unit,
          formula: params.formula,
          is_fixed: params.is_fixed,
          is_taxable: params.is_taxable,
          is_included_in_bpjs_health: params.is_included_in_bpjs_health,
          is_included_in_bpjs_employee: params.is_included_in_bpjs_employee,
          is_prorated: params.is_prorated,
          is_show_in_payslip: params.is_show_in_payslip,
          active: params.active,
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
      case "DEDUCTIONS":
        return {
          id: params.id,
          code: params.code,
          name: params.name,
          description: params.description,
          category_code: params.category_code,
          type: params.type,
          default_amount: params.default_amount,
          default_quantity: params.default_quantity,
          unit: params.unit,
          formula: params.formula,
          is_fixed: params.is_fixed,
          is_taxable: params.is_taxable,
          is_included_in_bpjs_health: params.is_included_in_bpjs_health,
          is_included_in_bpjs_employee: params.is_included_in_bpjs_employee,
          is_prorated: params.is_prorated,
          is_show_in_payslip: params.is_show_in_payslip,
          active: params.active,
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
      case "STATUTORY":
        return {
          id: params.id,
          code: params.code,
          name: params.name,
          description: params.description,
          default_amount: params.default_amount
            ? params.default_amount
            : params.default_percentage,
          default_percentage: params.default_percentage,
          type: params.type,
          unit: params.unit,
          is_fixed: params.is_fixed,
          is_taxable: params.is_taxable,
          is_prorated: params.is_prorated,
          is_show_in_payslip: params.is_show_in_payslip,
          active: params.active,
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
    }
  }

  formatData(params: any): any {
    switch (this.dataType) {
      case "EARNINGS":
        return {
          id: params.id ? params.id : null,
          code: params.code,
          name: params.name,
          description: params.description,
          category_code: params.category_code,
          type: params.type,
          default_amount: params.default_amount,
          default_quantity: params.default_quantity,
          unit: params.unit,
          formula: params.formula,
          is_fixed: parseInt(params.is_fixed),
          is_taxable: parseInt(params.is_taxable),
          is_included_in_bpjs_health: parseInt(
            params.is_included_in_bpjs_health
          ),
          is_included_in_bpjs_employee: parseInt(
            params.is_included_in_bpjs_employee
          ),
          is_prorated: parseInt(params.is_prorated),
          is_show_in_payslip: parseInt(params.is_show_in_payslip),
          active: parseInt(params.active),
          // updated_at: params.updated_at.split("T")[0],
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
      case "DEDUCTIONS":
        return {
          id: params.id ? params.id : null,
          code: params.code,
          name: params.name,
          description: params.description,
          category_code: params.category_code,
          type: params.type,
          default_amount: params.default_amount,
          default_quantity: params.default_quantity,
          unit: params.unit,
          is_fixed: parseInt(params.is_fixed),
          is_taxable: parseInt(params.is_taxable),
          is_included_in_bpjs_health: parseInt(
            params.is_included_in_bpjs_health
          ),
          is_included_in_bpjs_employee: parseInt(
            params.is_included_in_bpjs_employee
          ),
          is_prorated: parseInt(params.is_prorated),
          is_show_in_payslip: parseInt(params.is_show_in_payslip),
          active: parseInt(params.active),
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
      case "STATUTORY":
        return {
          id: params.id ? params.id : null,
          code: params.code,
          name: params.name,
          description: params.description,
          type: params.type,
          unit: params.unit,
          default_amount: params.default_amount,
          default_percentage: params.default_percentage,
          min_amount: params.min_amount,
          max_amount: params.max_amount,
          // qty: params.quantity,
          formula: params.formula,
          is_fixed: parseInt(params.is_fixed),
          is_taxable: parseInt(params.is_taxable),
          is_show_in_payslip: parseInt(params.is_show_in_payslip),
          active: parseInt(params.active),
          updated_at: params.updated_at,
          updated_by: params.updated_by,
          created_at: params.created_at,
          created_by: params.created_by,
        };
    }
  }

  // GETTER AND SETTER =======================================================
}
