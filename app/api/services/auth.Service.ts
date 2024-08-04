import { User, UserRoleType } from "@/models/user";
import axios from "../axios";
import { Hospital } from "@/models/hospital";
import { getMyCookie } from "@/hooks/get-my-cookie";

export const Register = async (values: any) => {

    const hospitalObj: Hospital = {
        hospital_name: values.hospital_name,
        hospital_tax_identity_number: values.hospital_tax_identity_number,
        hospital_email: values.hospital_email,
        hospital_phone_number: values.hospital_phone_number,
        hospital_province_name: values.hospital_province_name,
        hospital_district_name: values.hospital_district_name,
        hospital_address: values.hospital_address
    }

    const userObj: User = {
        user_name: values.user_name,
        user_surname: values.user_surname,
        user_identity_number: values.user_identity_number,
        user_email: values.user_email,
        user_phone: values.user_phone,
        user_password: values.user_password,
        user_role: UserRoleType.Staff
    }

    const body = {
        user : userObj,
        hospital : hospitalObj
    }
    return await axios.post("/auth/register",body);
}

export const Login = async (body: any) => {
    return await axios.post("/auth/login",body);
}

export const getLoggedInUserServer = async () => {
    const query = await fetch(`${process.env.BASE_URL}/auth`, {
      headers: {
        Cookie: `${getMyCookie()}`,
      },
    });

    const response = await query.json();
    console.warn("asdas",response)
    return response;
  };


// logout server side
export const logoutServer = async () => {
    const query = await fetch(`${process.env.BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: `${getMyCookie()}`,
      },
    });
    const response = {
      status: query.status,
      statusText: query.statusText,
      headers: query.headers,
    };
    return response;
  };
