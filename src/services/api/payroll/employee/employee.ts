import request from "@/utils/axios";
import ConfigurationResource from "../../configuration/configuration-resource";

const uri = "";

class EmployeeAPI extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  GetEmployeeList(params: any) {
    return request({
      url: "GetEmployeeList",
      method: "get",
      params: params,
    });
  }

  InsertEmployee(params: any) {
    return request({
      url: "InsertEmployee",
      method: "post",
      data: params,
    });
  }

  GetEmployee(params: any) {
    return request({
      url: "GetEmployee/" + params,
      method: "get",
    });
  }

  UpdateEmployee(params: any) {
    return request({
      url: "UpdateEmployee",
      method: "put",
      data: params,
    });
  }

  DeleteEmployee(params: any) {
    return request({
      url: "DeleteEmployee/" + params,
      method: "delete",
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

  // Options Methods
  GetEmployeeTypeOptions() {
    return request({
      url: "GetEmployeeTypeOptions",
      method: "get",
    });
  }

  GetPaymentFrequencyOptions() {
    return request({
      url: "GetPaymentFrequencyOptions",
      method: "get",
    });
  }

  GetMaritalStatusOptions() {
    return request({
      url: "GetMaritalStatusOptions",
      method: "get",
    });
  }

  GetPaymentMethodOptions() {
    return request({
      url: "GetPaymentMethodOptions",
      method: "get",
    });
  }

  GetBankOptions() {
    return request({
      url: "GetBankOptions",
      method: "get",
    });
  }

  GetDocumentTypeOptions() {
    return request({
      url: "GetDocumentTypeOptions",
      method: "get",
    });
  }
}

export { EmployeeAPI as default };
