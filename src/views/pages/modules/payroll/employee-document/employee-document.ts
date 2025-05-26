import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CModal from "@/components/modal/modal.vue";
import { formatDate, formatDateTime2, formatDateTimeUTC } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastError, getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./employee-document-input-form/employee-document-input-form.vue";

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
  created(): void {
    this.loadData();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.payroll.employee.employeeId"), value: 0 },
      {
        text: this.$t("commons.filter.payroll.employee.employeeName"),
        value: 1,
      },
      {
        text: this.$t("commons.filter.payroll.employee.documentType"),
        value: 2,
      },
      {
        text: this.$t("commons.filter.payroll.employee.fileName"),
        value: 3,
      },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        insert: true,
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
        headerName: this.$t("commons.table.payroll.employee.documentId"),
        headerClass: "align-header-center",
        field: "employee_id",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.employee"),
        headerClass: "align-header-center",
        field: "employee_name",
        width: 100,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.documentType"),
        field: "document_type_name",
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
        valueFormatter: formatDate,
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
    console.log("formData di handleSave", formData);
    const formattedData = this.formatData(formData);
    console.log("formattedData di handleSave", formattedData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData).then(() => {
        this.showForm = false;
      });
    } else {
      this.updateData(formattedData).then(() => {
        this.showForm = false;
      });
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

  handlePrint(formatData: any) {}

  handleDownload(formatData: any) {}

  confirmAction() {
    if (this.dialogAction === "delete") {
      this.deleteData();
    }
    this.showDialog = false;
  }

  refreshData(search: any) {
    this.searchOptions = { ...search };
    this.loadDataGrid(search);
  }

  onRefresh() {
    this.loadDataGrid(this.searchDefault);
  }

  // API REQUEST =======================================================
  async loadData() {
    try {
      this.loadMockData();
      this.loadDropdown();
    } catch (error) {
      getError(error);
    }
  }

  async loadDataGrid(search: any = this.searchDefault) {
    try {
      /*
      let params = {
        Index: search.index,
        Text: search.text,
        IndexCheckBox: search.filter[0],
      };
      const { data } = await salaryAdjustmentAPI.GetSalaryAdjustmentList(params);
      this.rowData = data;
      */

      let filteredData = [...this.rowData];

      if (search.text && search.text.trim()) {
        let searchText = search.text.toLowerCase().trim();
        let searchIndex = search.index;

        filteredData = filteredData.filter((item: any) => {
          switch (searchIndex) {
            case 0: // Employee ID
              return item.employee_id.toLowerCase().includes(searchText);
            case 1: // Employee Name
              return item.employee_name.toLowerCase().includes(searchText);
            case 2: // Department
              return item.document_type_name.toLowerCase().includes(searchText);
            case 3: // Adjustment Reason
              return item.file_name.includes(searchText);
            default:
              return true;
          }
        });
      }

      if (search.filter && search.filter.length > 0) {
        const statusFilter = parseInt(search.filter[0]);
        if (statusFilter !== 0) {
          filteredData = filteredData.filter((item: any) => {
            switch (statusFilter) {
              case 1:
                return item.status.toUpperCase() === "VALID";
              case 2:
                return item.status.toUpperCase() === "EXPIRING SOON";
              case 3:
                return item.status.toUpperCase() === "EXPIRED";
              default:
                return true;
            }
          });
        }
      }

      if (this.gridApi) {
        this.gridApi.setRowData(filteredData);
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      this.employeeOptions = [
        {
          employee_id: "EMP001",
          name: "John Doe",
          current_salary: 9000000,
          department_code: "OPERATIONS",
          department_name: "Operations",
          position_code: "MANAGER",
          position_name: "Manager",
          SubGroupName: "Employee",
        },
        {
          employee_id: "EMP002",
          name: "Jane Smith",
          current_salary: 13500000,
          department_code: "HUMAN_RESOURCES",
          department_name: "Human Resources",
          position_code: "STAFF",
          position_name: "Staff",
          SubGroupName: "Employee",
        },
        {
          employee_id: "EMP003",
          name: "Robert Johnson",
          current_salary: 18000000,
          department_code: "Finance",
          department_name: "Finance",
          position_code: "STAFF",
          position_name: "Staff",
          SubGroupName: "Employee",
        },
        {
          employee_id: "EMP004",
          name: "Emily Davis",
          current_salary: 7500000,
          department_code: "INFORMATION_TECHNOLOGY",
          department_name: "Information Technology",
          position_code: "STAFF",
          position_name: "Staff",
          SubGroupName: "Employee",
        },
        {
          employee_id: "EMP005",
          name: "Michael Wilson",
          current_salary: 15000000,
          department_code: "INFORMATION_TECHNOLOGY",
          department_name: "Information Technology",
          position_code: "STAFF",
          position_name: "Staff",
          SubGroupName: "Employee",
        },
      ];
      this.documentTypeOptions = [
        { code: "KTP", name: "KTP" },
        { code: "PASSPORT", name: "Passport" },
        { code: "NPWP", name: "NPWP" },
        { code: "CERTIFICATE", name: "Certificate" },
        { code: "CV", name: "CV" },
      ];
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

  async loadEditData(id: any) {
    try {
      /*
      const { data } = await documentAPI.GetDocument(id);
      this.populateForm(data);
      */

      const document = this.rowData.find((item: any) => item.id === id);

      if (document) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(document);
        });
      } else {
        getToastError(this.$t("messages.employee.error.notFoundDocument"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      /*
      const { status2 } = await salaryAdjustmentAPI.InsertSalaryAdjustment(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        this.loadDataGrid(this.searchDefault);
      }
      */

      const newId = Math.max(...this.rowData.map((item: any) => item.id)) + 1;

      const selectedDocument = this.documentTypeOptions.find(
        (item: any) => item.code === formData.document_type_code
      );

      const newDocument = {
        id: newId,
        employee_id: formData.employee_id,
        employee_name: formData.employee_name,
        document_type_code: selectedDocument.code,
        document_type_name: selectedDocument.name,
        file_name: formData.file
          ? formData.file.name
          : `document_${formData.id}.pdf`,
        file_path: formData.file
          ? `/uploads/${formData.file.name}`
          : `/uploads/document_${formData.id}.pdf`,
        file_type: formData.file ? formData.file.type : "application/pdf",
        file_size: formData.file ? formData.file.size : 1024000,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date,
        remark: formData.remark,
        status: this.calculateDocumentStatus(formData.expiry_date),
        created_at: formatDateTimeUTC(new Date()),
        created_by: "Current User",
        updated_at: formatDateTimeUTC(new Date()),
        updated_by: "Current User",
      };

      console.log("insertData", this.rowData);

      this.rowData.push(newDocument);
      this.searchDefault.filter = [0];

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.employee.success.saveDocument"));
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      /*
      const { status2 } = await salaryAdjustmentAPI.UpdateSalaryAdjustment(formData);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
      */

      const iDocument = this.rowData.findIndex(
        (item: any) => item.id === formData.id
      );
      if (iDocument !== -1) {
        this.rowData[iDocument] = {
          ...this.rowData[iDocument],
          document_type: formData.document_type,
          file_name: formData.file
            ? formData.file.name
            : this.rowData[iDocument].file_name,
          file_path: formData.file
            ? `/uploads/${formData.file.name}`
            : this.rowData[iDocument].file_path,
          file_type: formData.file
            ? formData.file.type
            : this.rowData[iDocument].file_type,
          file_size: formData.file
            ? formData.file.size
            : this.rowData[iDocument].file_size,
          issue_date: formData.issue_date,
          expiry_date: formData.expiry_date || null,
          remark: formData.remark || "",
          status: this.calculateDocumentStatus(formData.expiry_date),
          updated_at: formatDateTimeUTC(new Date()),
          updated_by: "Current User",
        };
      }

      this.searchDefault.filter = [0];

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);

      getToastSuccess(this.$t("messages.employee.success.updateDocument"));
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      /*
      const { status2 } = await salaryAdjustmentAPI.DeleteSalaryAdjustment(this.deleteParam);
      if (status2.status == 0) {
        this.loadDataGrid(this.searchDefault);
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
      */

      this.rowData = this.rowData.filter(
        (item: any) => item.id !== this.deleteParam
      );

      this.searchDefault.filter = [1];

      await this.$nextTick();
      await this.loadDataGrid(this.searchDefault);
      getToastSuccess(this.$t("messages.employee.success.deleteDocument"));
    } catch (error) {
      getError(error);
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      employee_id: params.employee_id,
      employee_name: params.employee_name,
      document_type_code: params.document_type_code,
      document_type_name: params.document_type_name,
      file: params.file,
      file_name: params.file_name,
      issue_date: params.issue_date,
      expiry_date: params.expiry_date,
      remark: params.remark,
      status: params.staus,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      employee_id: params.employee_id,
      employee_name: params.employee_name,
      document_type_code: params.document_type_code,
      document_type_name: params.document_type_name,
      file: params.file,
      file_name: params.file_name,
      issue_date: params.issue_date,
      expiry_date: params.expiry_date,
      remark: params.remark,
      status: params.status,
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
