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

  GetTaxDetailByPayrollId(payrollId: any) {
    return request({
      url: `GetPayTaxDetailByPayrollID/${payrollId}`,
      method: "get",
    });
  }
}

export { PayrollAPI as default };
