export type IInsertTableView = {
  // number: string;
  document_number: string;
  request_by: string;
  store_code: string;
  to_store_code: string;
  from_store_code: string;
  date: string;
  remark: string;
  details: [
    {
      StNumber: string
      quantity: number;
      from_store_code: string;
      uom_code: string;
      item_code: string;
      receive_id: number;
    }
  ];
};
