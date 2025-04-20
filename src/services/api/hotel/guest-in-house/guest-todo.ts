import Resource from "../../../resource";
import request from "@/utils/axios";

class GuestTodoAPI extends Resource {
  getGuestTodoList(folioNumber: number, searchParams: any) {
    return request({
      url: `/GetGuestTodoList/${folioNumber}`,
      method: "get",
      params: searchParams,
    });
  }

  getGuestTodo(folioNumber: number) {
    return request({
      url: `/GetGuestTodo/${folioNumber}`,
      method: "get",
    });
  }

  insertGuestTodo(data: any) {
    return request({
      url: `/InsertGuestTodo`,
      method: "post",
      data,
    });
  }

  updateGuestTodo(data: any) {
    return request({
      url: `/UpdateGuestTodo`,
      method: "put",
      data,
    });
  }

  updateGuestTodoIsDone(data: any) {
    return request({
      url: `/UpdateGuestTodoIsDone`,
      method: "put",
      data,
    });
  }

  deleteGuestTodo(id: number) {
    return request({
      url: `/DeleteGuestTodo/${id}`,
      method: "delete",
    });
  }
}

export { GuestTodoAPI as default };
