import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import EmployeeAPI from "@/services/api/payroll/employee/employee";
import LegalDocumentsAPI from "@/services/api/payroll/legal-documents/legal-document";
import { formatDate, formatDateTime2, formatDateTimeUTC } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./employee-document-input-form/employee-document-input-form.vue";

const legalDocumentAPI = new LegalDocumentsAPI();
const employeeAPI = new EmployeeAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CInputForm,
  },
})
export default class PayrollApprovals extends Vue {
  // data
  public rowData: any = [];
  public deleteParam: any;

  // options data
  public employeeOptions: any = [];
  public documentTypeOptions: any = [];

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // dialog
  public showDialog: boolean = false;
  public dialogMessage: string = "";
  public dialogAction: string = "";

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

  // stats
  public statusCounts: any = ref({
    all: 0,
    valid: 0,
    expiringSoon: 0,
    expired: 0,
  });

  // AG GRID VARIABLE
  gridOptions: any = {};
  columnDefs: any;
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  statusBar: any;
  paginationPageSize: any;
  rowSelection: string;
  rowModelType: string;
  limitPageSize: any;
  gridApi: any;
  paramsData: any;
  ColumnApi: any;
  agGridSetting: any;

  // RECYCLE LIFE FUNCTION =======================================================
  mounted(): void {
    this.loadDataGrid();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.employeeId"), value: 0 },
      {
        text: this.$t("commons.filter.payroll.employee.employeeName"),
        value: 1,
      },
      {
        text: this.$t("commons.filter.payroll.employee.fileName"),
        value: 3,
      },
      { text: this.$t("commons.filter.payroll.employee.position"), value: 2 },
      { text: this.$t("commons.filter.payroll.employee.department"), value: 3 },
      { text: this.$t("commons.filter.payroll.employee.placement"), value: 4 },
      {
        text: this.$t("commons.filter.remark"),
        value: 5,
      },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        edit: true,
        delete: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.id"),
        field: "employee_id",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employee"),
        field: "FullName",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.documentType"),
        field: "DocumentType",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.fileName"),
        field: "file_name",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.issueDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "issue_date",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDate,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.expiryDate"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "expiry_date",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "status",
        width: 100,
        cellRenderer: (params: any) => {
          const status = params.value.toUpperCase();
          let badgeClass = "";

          if (status === "VALID") badgeClass = "bg-success px-3";
          else if (status === "EXPIRING SOON") badgeClass = "bg-warning px-2";
          else if (status === "EXPIRED") badgeClass = "bg-danger px-3";
          else badgeClass = "bg-secondary";

          return `<span class="badge ${badgeClass} py-1 ">${status}</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        enableRowGroup: false,
        valueFormatter: formatDateTime2,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        enableRowGroup: false,
        valueFormatter: formatDateTime2,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
        enableRowGroup: false,
      },
    ];
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
    };
    this.rowGroupPanelShow = "always";
    this.statusBar = {
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
        { statusPanel: "agTotalRowCountComponent", align: "center" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.ColumnApi = params.columnApi;
  }

  // GENERAL FUNCTION =======================================================
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }

    const result = [
      {
        name: this.$t("commons.contextMenu.insert"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.edit),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.print"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("print_icon24"),
        action: () => this.handlePrint(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.download"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("download_icon24"),
        action: () => this.handleDownload(this.paramsData),
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id == vm.paramsData.id) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;
    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        this.inputFormElement.initialize();
      } else {
        this.loadEditData(params.id);
      }
    });
    this.showForm = true;
  }

  handleMenu() {}

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

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
    this.dialogMessage = this.$t("messages.employee.confirm.documentDelete");
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  handleToDocumentType() {
    this.$router.push({
      name: "DocumentType",
    });
  }

  handlePrint(formatData: any) {}

  handleDownload(formatData: any) {}

  confirmAction() {
    if (this.dialogAction === "delete") {
      this.deleteData();
    }
    this.showDialog = false;
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  // API REQUEST =======================================================
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await legalDocumentAPI.GetLegalDocumentsList(params);
      if (data) {
        this.rowData = data;
      } else {
        this.rowData = [];
      }

      // const { data: statusData } =
      //   await salaryAdjustmentAPI.GetAdjustmentSalaryCount({});
      // this.statusCounts = statusData;
      this.loadDropdown();
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const promises = [
        employeeAPI.GetEmployeeList({}).then((response) => {
          this.employeeOptions = response.data;
        }),

        legalDocumentAPI.GetDocumentTypeList({}).then((response) => {
          this.documentTypeOptions = response.data;
        }),
      ];

      await Promise.all(promises);
    } catch (error) {
      getError(error);
    }
  }

  async loadMockData() {
    this.rowData = [
      {
        id: 1,
        employee_id: "EMP001",
        employee_name: "John Doe",
        document_type_code: "KTP",
        document_type_name: "KTP",
        file_name: "john_doe_id_card.pdf",
        file_path: "documents/employee/EMP001/john_doe_id_card.pdf",
        file_type: "application/pdf",
        file_size: 1024000,
        issue_date: "2019-05-15",
        expiry_date: "2024-05-15",
        remark: "National ID Card",
        status: "Valid",
        created_at: "2020-01-10 08:30:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 08:30:00",
        updated_by: "Admin System",
      },
      {
        id: 2,
        employee_id: "EMP001",
        employee_name: "John Doe",
        document_type_code: "NPWP",
        document_type_name: "NPWP",
        file_name: "john_doe_tax_id.pdf",
        file_path: "documents/employee/EMP001/john_doe_tax_id.pdf",
        file_type: "application/pdf",
        file_size: 850000,
        issue_date: "2018-03-20",
        expiry_date: null,
        remark: "Tax registration document",
        status: "Valid",
        created_at: "2020-01-10 08:45:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 08:45:00",
        updated_by: "Admin System",
      },
      {
        id: 3,
        employee_id: "EMP001",
        employee_name: "John Doe",
        document_type_code: "CV",
        document_type_name: "CV",
        file_name: "john_doe_cv.pdf",
        file_path: "documents/employee/EMP001/john_doe_cv.pdf",
        file_type: "application/pdf",
        file_size: 1200000,
        issue_date: "2019-12-15",
        expiry_date: null,
        remark: "Latest CV",
        status: "Expiring soon",
        created_at: "2020-01-10 09:00:00",
        created_by: "Admin System",
        updated_at: "2020-01-10 09:00:00",
        updated_by: "Admin System",
      },
      {
        id: 4,
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        document_type_code: "KTP",
        document_type_name: "KTP",
        file_name: "jane_smith_id_card.pdf",
        file_path: "documents/employee/EMP002/jane_smith_id_card.pdf",
        file_type: "application/pdf",
        file_size: 980000,
        issue_date: "2020-08-22",
        expiry_date: "2025-08-22",
        remark: "National ID Card",
        status: "Expired",
        created_at: "2021-03-15 09:30:00",
        created_by: "Admin System",
        updated_at: "2021-03-15 09:30:00",
        updated_by: "Admin System",
      },
      {
        id: 5,
        employee_id: "EMP002",
        employee_name: "Jane Smith",
        document_type_code: "PASSPORT",
        document_type_name: "Passport",
        file_name: "jane_smith_passport.pdf",
        file_path: "documents/employee/EMP002/jane_smith_passport.pdf",
        file_type: "application/pdf",
        file_size: 1500000,
        issue_date: "2019-05-10",
        expiry_date: "2029-05-10",
        remark: "International passport",
        status: "Valid",
        created_at: "2021-03-15 09:45:00",
        created_by: "Admin System",
        updated_at: "2021-03-15 09:45:00",
        updated_by: "Admin System",
      },
    ];
  }

  async loadEditData(params: any) {
    try {
      console.log("oarams", params);
      const { data } = await legalDocumentAPI.GetLegalDocument(params);
      console.log("loadEditData", data);
      // this.$nextTick(() => {
      //   this.inputFormElement.form = this.populateForm(data);
      // });

      this.$nextTick(async () => {
        this.inputFormElement.form = this.populateForm(data);

        await this.$nextTick();
        if (this.inputFormElement.loadExistingFile) {
          await this.inputFormElement.loadExistingFile();
        }
      });
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      console.log("insertData", formData);
      const uploadData = new FormData();

      uploadData.append("employee_id", formData.employee_id);
      uploadData.append("document_type_code", formData.document_type_code);
      uploadData.append("issue_date", formData.issue_date);
      uploadData.append("expiry_date", formData.expiry_date);
      uploadData.append("status", formData.status);
      uploadData.append("remark", formData.remark);

      if (this.inputFormElement.selectedFile) {
        uploadData.append("file_content", this.inputFormElement.selectedFile);
        console.log(
          "insertData selected file",
          this.inputFormElement.selectedFile
        );
      }

      // Debug FormData content
      console.log("FormData prepared:", uploadData);
      for (let pair of uploadData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const { status2 } = await legalDocumentAPI.InsertLegalDocument(
        uploadData
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.employee.success.saveDocument"));
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      console.log("updateData", formData);
      const uploadData = new FormData();

      uploadData.append("id", formData.id);
      uploadData.append("employee_id", formData.employee_id);
      uploadData.append("document_type_code", formData.document_type_code);
      uploadData.append("issue_date", formData.issue_date);
      uploadData.append("expiry_date", formData.expiry_date);
      uploadData.append("status", formData.status);
      uploadData.append("remark", formData.remark);

      if (this.inputFormElement.selectedFile) {
        uploadData.append("file_content", this.inputFormElement.selectedFile);
      } else {
        uploadData.append("file_content", "");
      }

      const { status2 } = await legalDocumentAPI.UpdateLegalDocument(
        uploadData
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.employee.success.updateDocument"));
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const { status2 } = await legalDocumentAPI.DeleteLegalDocument(
        this.deleteParam
      );
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.employee.success.deleteDocument"));
        this.loadDataGrid(this.searchDefault);
      }
    } catch (error) {
      getError(error);
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    let issueDate;
    let expiryDate;
    if (this.modeData === $global.modeData.insert) {
      issueDate = params.issue_date;
      expiryDate = params.expiry_date;
    } else {
      issueDate = params.issue_date;
      expiryDate = params.expiry_date;
      // issueDate = params.issue_date.split("T")[0];
      // expiryDate = params.expiry_date.split("T")[0];
    }
    console.log("formatData", { issueDate, expiryDate });
    return {
      id: params.id ? params.id : null,
      employee_id: params.employee_id,

      document_type_code: params.document_type_code,
      issue_date: issueDate,
      expiry_date: expiryDate,
      status: params.status,
      remark: params.remark,

      // metadata -> database
      file_name: params.file_name,
      file_path: params.file_path,
      file_size: parseInt(params.file_size),
      file_type: params.file_type,

      // file ori -> backend
      file_content: params.file_content,

      // modified
      created_at: formatDateTimeUTC(params.created_at),
      created_by: params.created_by,
      updated_at: formatDateTimeUTC(params.updated_at),
      updated_by: params.updated_by,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      employee_id: params.employee_id,
      Position: params.Position,
      Department: params.Department,
      Placement: params.Placement,
      document_type_code: params.document_type_code,
      issue_date: params.issue_date,
      expiry_date: params.expiry_date,
      status: params.status,
      remark: params.remark,

      file_name: params.file_name,
      file_path: params.file_path,
      file_size: parseInt(params.file_size),
      file_type: params.file_type,
      // file_content: params.file_content,

      // modified
      created_at: params.created_at,
      created_by: params.created_by,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
    };
  }

  calculateDocumentStatus(expiryDate: string): string {
    if (!expiryDate) return "Valid";

    const today = new Date();
    const expiry = new Date(expiryDate);

    if (isNaN(expiry.getTime())) return "Valid";

    if (expiry < today) {
      return "Expired";
    } else if (expiry.getTime() - today.getTime() < 30 * 24 * 60 * 60 * 1000) {
      return "Expiring Soon";
    } else {
      return "Valid";
    }
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
