import request from "@/utils/axios";
import ConfigurationResource from "../configuration/configuration-resource";
const uri = "";
export default class Booking extends ConfigurationResource {
  constructor() {
    super(uri);
  }

  getBookingList(query: any) {
    return request({
      url: "GetBookingList",
      method: "get",
      params: query
    });
  }

  getBooking(param: string) {
    return request({
      url: "GetBooking/" + param,
      method: "get",
    })
  }

  GetCompanyDetailList() {
    return request({
      url: `GetCompanyDetailList`,
      method: "get",
    });
  }

  StateByCountry(query: Array<string>) {
    return request({
      url: "GetStateByCountry/" + query,
      method: "get",
    });
  }

  CityByState(query: Array<string>) {
    return request({
      url: "GetCityByState/" + query,
      method: "get",
    });
  }

  insertBooking(resource: any) {
    return request({
      url: "InsertBooking",
      method: "post",
      data: resource
    })
  }

  updateBooking(resource: any) {
    return request({
      url: "UpdateBooking",
      method: "put",
      data: resource
    })
  }

  checkInBooking(resource: any) {
    return request({
      url: "CheckInBooking",
      method: "put",
      data: resource
    })
  }

  CancelBooking(resource: any) {
    return request({
      url: "CancelBooking",
      method: "put",
      data: resource
    })
  }

  // reservation
  getBookingReservationList(params: any, bookingId: string) {
    return request({
      url: "GetBookingReservationList/" + bookingId,
      method: "get",
      params: params
    })
  }

  insertBookingReservation(resource: any) {
    return request({
      url: "InsertBookingReservation",
      method: "post",
      data: resource
    })
  }

  updateBookingReservation(resource: any) {
    return request({
      url: "UpdateBookingReservation",
      method: "put",
      data: resource
    })
  }

  getBookingReservation(number: any) {
    return request({
      url: "GetBookingReservation/" + number,
      method: "get",
    })
  }

  cancelBookingReservation(resource: any) {
    return request({
      url: "CancelBookingReservation",
      method: "put",
      data: resource
    })
  }

  // charge
  getBanReservationChargeList(query: any, bookingNumber: number) {
    return request({
      url: "GetBanReservationChargeList/" + bookingNumber,
      method: "get",
      params: query
    })
  }

  bookingReservationProductComboList(param: any) {
    return request({
      url: "BookingReservationProductComboList/" + param,
      method: "get"
    })
  }

  bookingReservationPackageComboList(param: any) {
    return request({
      url: "BookingReservationPackageComboList/" + param,
      method: "get"
    })
  }

  bookingReservationProductList(categoryCode: any) {
    return request({
      url: "BookingReservationProductList",
      method: "get",
      params: categoryCode
    })
  }

  bookingReservationPackageList(bnsSCode: any) {
    return request({
      url: "BookingReservationPackageList",
      method: "get",
      params: bnsSCode
    })
  }

  getPackageBusinessSourceCommission(query: any) {
    return request({
      url: "GetPackageBusinessSourceCommission",
      method: "get",
      params: query
    })
  }

  insertBanquetProduct(resource: any) {
    return request({
      url: "InsertBanquetProduct ",
      method: "post",
      data: resource
    })
  }

  insertBookingReservationPackage(resource: any) {
    return request({
      url: "InsertBookingReservationPackage ",
      method: "post",
      data: resource
    })
  }

  // Schedule Payment
  getSchedulePaymentList(query: any) {
    // TODO : harusnya ada filter berdasarkan booking_number
    return request({
      url: "GetBookingSchedulePaymentList",
      method: "get",
      params: query
    });
  }

  getSchedulePayment(number: any) {
    return request({
      url: "GetBookingSchedulePayment/" + number,
      method: "get",
    });
  }

  getBookingDepositList(bookingNumber: any) {
    return request({
      url: "GetBookingDepositList/" + bookingNumber,
      method: "get",
    });
  }

  insertSchedulePayment(resource: any) {
    return request({
      url: "InsertBookingSchedulePayment",
      method: "post",
      data: resource
    })
  }

  updateSchedulePayment(resource: any) {
    return request({
      url: "UpdateBookingSchedulePayment",
      method: "put",
      data: resource
    })
  }

  deleteBookingSchedulePayment(id: any) {
    return request({
      url: "DeleteBookingSchedulePayment/" + id,
      method: "delete",
    })
  }
}