import request from "../utils/axios";

/**
 * Simple RESTful resource class
 */
class Resource {
  uri: any;
  list(query: any) {
    return request({
      url: "/" + this.uri,
      method: "get",
      params: query,
    });
  }
  get(id: string) {
    return request({
      url: "/" + this.uri + "/" + id + "/edit",
      method: "get",
    });
  }
  store(resource: any) {
    return request({
      url: "/" + this.uri,
      method: "post",
      data: resource,
    });
  }
  update(resource: any) {
    return request({
      url: "/" + this.uri + "/update",
      method: "put",
      data: resource,
    });
  }
  delete(params: any) {
    return request({
      url: "/" + this.uri + "/delete",
      method: "post",
      data: params,
    });
  }

  destroy(id: string) {
    return request({
      url: "/" + this.uri + "/" + id,
      method: "delete",
    });
  }
}

export { Resource as default };
