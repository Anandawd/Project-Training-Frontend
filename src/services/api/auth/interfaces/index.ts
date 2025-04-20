export type ICredential = {
  user_id: string;
  password: string;
  user_access_type_code: string;
  access_mode: number[];
  is_encrypted?: boolean;
};
