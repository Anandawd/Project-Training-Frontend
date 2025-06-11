import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class EmployeeAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetEmployeeList(params: any) {
    return request({
      url: "GetPayEmployeeList",
      method: "get",
      params,
    });
  }

  InsertEmployee(params: any) {
    return request({
      url: "InsertPayEmployeeList",
      method: "post",
      data: params,
    });
  }

  GetEmployee(params: any) {
    return request({
      url: "GetPayEmployee/" + params,
      method: "get",
    });
  }

  UpdateEmployee(params: any) {
    return request({
      url: "UpdateEmployeeList",
      method: "put",
      data: params,
    });
  }

  DeleteEmployee(params: any) {
    return request({
      url: "DeletePayEmployee/" + params,
      method: "delete",
    });
  }

  // Employee Type
  GetEmployeeTypeList(params: any) {
    return request({
      url: "GetPayCfgInitEmployeeTypeList",
      method: "get",
      params: params,
    });
  }

  InsertEmployeeType(params: any) {
    return request({
      url: "InsertPayCfgInitEmployeeTypeList",
      method: "post",
      data: params,
    });
  }

  GetEmployeeType(params: any) {
    return request({
      url: "GetPayCfgInitEmployeeType/" + params,
      method: "get",
    });
  }

  UpdateEmployeeType(params: any) {
    return request({
      url: "UpdateCfgInitEmployeeTypeList",
      method: "put",
      data: params,
    });
  }

  DeleteEmployeeType(params: any) {
    return request({
      url: "DeletePayCfgInitEmployeeType/" + params,
      method: "delete",
    });
  }

  // Options Methods
  GetGenderOptions() {
    return request({
      url: "GetPayConstGenderList",
      method: "get",
    });
  }

  GetPaymentFrequencyOptions() {
    return request({
      url: "GetPayConstPaymentFrequencyList",
      method: "get",
    });
  }

  GetMaritalStatusOptions() {
    return request({
      url: "GetPayConstMaritalStatusList",
      method: "get",
    });
  }

  GetPaymentMethodOptions() {
    return request({
      url: "GetPayConstPaymentMethodList",
      method: "get",
    });
  }

  GetBankOptions() {
    return request({
      url: "GetPayConstBankOptionsList",
      method: "get",
    });
  }

  // Employee Document Methods
  GetEmployeeDocumentList(employeeId: any, params: any) {
    return request({
      url: `GetEmployeeDocumentList/${employeeId}`,
      method: "get",
      params: params,
    });
  }

  InsertEmployeeDocument(params: any) {
    return request({
      url: "InsertEmployeeDocument",
      method: "post",
      data: params,
    });
  }

  GetEmployeeDocument(params: any) {
    return request({
      url: "GetEmployeeDocument/" + params,
      method: "get",
    });
  }

  UpdateEmployeeDocument(params: any) {
    return request({
      url: "UpdateEmployeeDocument",
      method: "put",
      data: params,
    });
  }

  DeleteEmployeeDocument(params: any) {
    return request({
      url: "DeleteEmployeeDocument/" + params,
      method: "delete",
    });
  }

  // Employee Salary Methods
  GetEmployeeSalaryList(employeeId: any, params: any) {
    return request({
      url: `GetEmployeeSalaryList/${employeeId}`,
      method: "get",
      params: params,
    });
  }

  InsertEmployeeSalary(params: any) {
    return request({
      url: "InsertEmployeeSalary",
      method: "post",
      data: params,
    });
  }

  GetEmployeeSalary(params: any) {
    return request({
      url: "GetEmployeeSalary/" + params,
      method: "get",
    });
  }

  UpdateEmployeeSalary(params: any) {
    return request({
      url: "UpdateEmployeeSalary",
      method: "put",
      data: params,
    });
  }

  DeleteEmployeeSalary(params: any) {
    return request({
      url: "DeleteEmployeeSalary/" + params,
      method: "delete",
    });
  }
}

export { EmployeeAPI as default };
