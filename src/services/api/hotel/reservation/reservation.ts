import request from "@/utils/axios";
import {
  IFullReservationData,
  IReservationList,
  IUpdateReservationStatus,
} from "../../interfaces";

import RegistrationFormAPI from "../registration-form/registration-form";

class ReservationAPI extends RegistrationFormAPI {
  constructor() {
    super();
  }

  insertReservation(params: IFullReservationData) {
    return request({
      url: "/InsertReservation",
      method: "post",
      data: params,
    });
  }

  editReservation(reservationNumber: number) {
    return request({
      url: `/GetReservation/${reservationNumber}`,
      method: "get",
    });
  }

  updateReservation(params: IFullReservationData) {
    return request({
      url: "/UpdateReservation",
      method: "post",
      data: params,
    });
  }

  getReservationList(params: any) {
    return request({
      url: "/GetReservationList",
      method: "get",
      params,
    });
  }

  getTotalDepositReservation(params: any) {
    return request({
      url: "/GetTotalDepositReservation",
      method: "get",
      params,
    });
  }

  /**
   *
   * @param params
   * change status reservation to cancel/void/no show
   */
  updateReservationStatus(params: IUpdateReservationStatus) {
    return request({
      url: "/UpdateReservationStatus",
      method: "put",
      data: params,
    });
  }

  lockReservation(params: { ReservationNumber: number; IsLock: boolean }) {
    return request({
      url: "/UpdateReservationLock",
      method: "put",
      data: params,
    });
  }

  getLockReservationStatus(params: number) {
    return request({
      url: "/IsReservationLock",
      method: "post",
      data: params,
    });
  }

  checkInReservation(params: number) {
    return request({
      url: "/CheckInReservation",
      method: "post",
      data: params,
    });
  }

  setUnsetStatusWaitList(params: any) {
    return request({
      url: "/SetUnsetStatusWaitList",
      method: "put",
      data: params,
    });
  }

  autoAssignRoom(params: any) {
    return request({
      url: "/AutoAssignRoom",
      method: "put",
      data: params,
    });
  }

  removeAutoAssignRoom(params: any) {
    return request({
      url: "/RemoveAutoAssignRoom",
      method: "put",
      data: params,
    });
  }

  getRoomStatus(roomNumber: any) {
    if (!roomNumber) return;
    return request({
      url: "/GetRoomStatus/" + roomNumber,
      method: "get",
    });
  }

  cancelReservation(params: any) {
    return request({
      url: "/CancelReservation",
      method: "put",
      data: params,
    });
  }

  changeStatus2Reservation(params: any) {
    return request({
      url: "/ChangeStatus2Reservation",
      method: "put",
      data: params,
    });
  }

  updateMultipleReservationRoomRate(params: any) {
    return request({
      url: "/UpdateMultipleReservationRoomRate",
      method: "put",
      data: params,
    });
  }
  // ==================================================
}

export default ReservationAPI;
