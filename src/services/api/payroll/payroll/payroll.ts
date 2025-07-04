import request from "@/utils/axios-development";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class PayrollAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetPayrollList(params: any) {
    return request({
      url: "GetPayPayrollList",
      method: "get",
      params: params,
    });
  }

  InsertPayroll(params: any) {
    return request({
      url: "InsertPayPayrollList",
      method: "post",
      data: params,
    });
  }

  GetPayroll(params: any) {
    return request({
      url: "GetPayPayroll/" + params,
      method: "get",
    });
  }

  UpdatePayroll(params: any) {
    return request({
      url: "UpdatePayrollPeriodList",
      method: "put",
      data: params,
    });
  }

  DeletePayroll(params: any) {
    return request({
      url: "DeletePayPayroll/" + params,
      method: "delete",
    });
  }

  // employee payroll
  GetPayrollComponentListByEmployeeId(params: any) {
    return request({
      url: "GetPayEmployeePayrollComponentByEmployeeID/" + params,
      method: "get",
    });
  }

  InsertEmployeePayroll(params: any) {
    return request({
      url: "InsertPayEmployeePayrollComponentList",
      method: "post",
      data: params,
    });
  }

  GetEmployeePayroll(params: any) {
    return request({
      url: "GetPayEmployeePayrollComponent/" + params,
      method: "get",
    });
  }

  UpdateEmployeePayroll(params: any) {
    return request({
      url: "UpdateEmployeePayrollComponentList",
      method: "put",
      data: params,
    });
  }

  DeleteEmployeePayroll(params: any) {
    return request({
      url: "DeletePayEmployeePayrollComponent/" + params,
      method: "delete",
    });
  }

  // employee statutory
  GetEmployeeStatutoryList(params: any) {
    return request({
      url: "GetPayEmployeeStatutoryComponentList",
      method: "get",
      params: params,
    });
  }

  GetEmployeeStatutoryListById(params: any) {
    return request({
      url: "GetPayEmployeeStatutoryComponent/" + params,
      method: "get",
    });
  }

  GetEmployeeStatutoryListByEmployeeId(params: any) {
    return request({
      url: "GetPayEmployeeStatutoryComponentByEmployeeID/" + params,
      method: "get",
    });
  }

  InsertEmployeeStatutory(params: any) {
    return request({
      url: "InsertPayEmployeeStatutoryComponentList",
      method: "post",
      data: params,
    });
  }

  UpdateEmployeeStatutory(params: any) {
    return request({
      url: "UpdateEmployeeStatutoryComponentList",
      method: "put",
      data: params,
    });
  }

  DeleteEmployeeStatutory(params: any) {
    return request({
      url: "DeletePayEmployeeStatutoryComponent/" + params,
      method: "delete",
    });
  }

  // generate
  GetEmployeeListByPlacementCode(params: any) {
    return request({
      url: "GetPayEmployeeByPlacementCode/" + params,
      method: "get",
    });
  }
  GetPositionListByPlacementCode(params: any) {
    return request({
      url: "GetPayCfgInitPositionByPlacementCode/" + params,
      method: "get",
    });
  }
  GetDepartmentListByPlacementCode(params: any) {
    return request({
      url: "GetPayCfgInitDepartmentByPlacementCode/" + params,
      method: "get",
    });
  }
  GetConstTaxMethod() {
    return request({
      url: "GetPayConstTaxMethodList",
      method: "get",
    });
  }
  GetConstTaxIncomeType() {
    return request({
      url: "GetPayConstTaxIncomeTypeList",
      method: "get",
    });
  }

  GeneratePayroll(params: any) {
    return request({
      url: "GeneratePayrollBySelection",
      method: "post",
      data: params,
    });
  }

  // payroll list
  GetPayrollListByPeriodCode(params: any) {
    return request({
      url: "GetPayPayrollByPeriodCode/" + params,
      method: "get",
    });
  }
  GetPayrollDetailByPeriodCode(params: any) {
    return request({
      url: "GetPayPayrollDetailByPeriodCode/" + params,
      method: "get",
    });
  }

  // payroll
  GetPayrollByPeriodCodeAndEmployeeId(periodCode: any, employeeId: any) {
    return request({
      url: `GetPayPayrollByPeriodCodeAndEmployeeID/${periodCode}/${employeeId}`,
      method: "get",
    });
  }

  GetEmployeeSalaryByEmployeeId(employeeId: any) {
    return request({
      url: `GetPayPayrollByPeriodCodeAndEmployeeID/${employeeId}`,
      method: "get",
    });
  }

  GetEmployeePayrollEarningsComponent(employeeId: any) {
    return request({
      url: `GetPayEmployeePayrollComponentByEmployeeIDEarnings/${employeeId}`,
      method: "get",
    });
  }

  GetEmployeePayrollDeductionsComponent(employeeId: any) {
    return request({
      url: `GetPayEmployeePayrollComponentByEmployeeIDDeductions/${employeeId}`,
      method: "get",
    });
  }

  GetEmployeeStatutoryEarningsComponent(employeeId: any) {
    return request({
      url: `GetPayEmployeeStatutoryComponentByEmployeeIDEarnings/${employeeId}`,
      method: "get",
    });
  }

  GetEmployeeStatutoryDeductionsComponent(employeeId: any) {
    return request({
      url: `GetPayEmployeeStatutoryComponentByEmployeeIDDeductions/${employeeId}`,
      method: "get",
    });
  }

  GetStatutoryDetailByPayrollId(payrollId: any) {
    return request({
      url: `GetPayStatutoryDetailByPayrollId/${payrollId}`,
      method: "get",
    });
  }

  GetTaxDetailByPayrollId(payrollId: any) {
    return request({
      url: `GetPayTaxDetailByPayrollID/${payrollId}`,
      method: "get",
    });
  }

  // employee payroll detail
  InsertEmployeePayrollInEmployeePayrollDetail(params: any) {
    return request({
      url: "InsertEmployeePayrollComponent",
      method: "post",
      data: params,
    });
  }

  InsertEmployeeStatutoryInEmployeePayrollDetail(params: any) {
    return request({
      url: "InsertEmployeeStatutory",
      method: "post",
      data: params,
    });
  }

  UpdateProrateInEmployeePayrollDetail(params: any) {
    return request({
      url: "UpdateProrateEmployeePayroll",
      method: "put",
      data: params,
    });
  }

  // payroll disbursement
  GetPaymentProcessingList(params: any) {
    return request({
      url: "GetPayPaymentProcessingList",
      method: "get",
      params: params,
    });
  }

  InsertPaymentProcessing(params: any) {
    return request({
      url: "InsertPayPaymentProcessingList",
      method: "post",
      data: params,
    });
  }

  GetPaymentProcessing(params: any) {
    return request({
      url: "GetPayPaymentProcessing/" + params,
      method: "get",
    });
  }

  UpdatePaymentProcessing(params: any) {
    return request({
      url: "UpdatePaymentProcessingList",
      method: "put",
      data: params,
    });
  }

  DeletePaymentProcessing(params: any) {
    return request({
      url: "DeletePayPaymentProcessing/" + params,
      method: "delete",
    });
  }
}

export { PayrollAPI as default };
