import { User } from "@/models/user";
import axios from "../axios";

export const deleteUser = async (user_id: number) => {
  return await axios.delete(`/user/${user_id}`);
};

export const postUser = async (values: any) => {
  return await axios.post("/user", values);
};

export const putUser = async (values: any) => {
  const userObj: User = {
    user_name: values.user_name,
    user_surname: values.user_surname,
    user_identity_number: values.user_identity_number,
    user_email: values.user_email,
    user_phone: values.user_phone,
    user_password: values.user_password,
    user_role: values.user_role,
  };

  const body = {
    user: userObj,
    user_id: values.user_id,
  };
  return await axios.put("/user", body);
};

export const getAllUser = async () => {
  return await axios.get("/user");
};
