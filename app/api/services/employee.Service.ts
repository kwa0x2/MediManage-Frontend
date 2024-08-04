import { Employee } from "@/models/employee";
import axios from "../axios";

export const getAllEmployees = async () => {
  return await axios.get("/employee");
};

export const postEmployeeWithWorkDays = async (values: any) => {
  const employeeObj: Employee = {
    employee_name: values.employee_name,
    employee_surname: values.employee_surname,
    employee_identity_number: Number(values.employee_identity_number),
    employee_phone_number: values.employee_phone_number,
    employee_job_group_name: values.employee_job_group_name,
    employee_title_name: values.employee_title_name,
    employee_clinic_name: values.employee_clinic_name,
  };

  const body = {
    employee: employeeObj,
    employee_working_days: values.employee_working_days,
  };
  return await axios.post("/employee/withworkday", body);
};

export const deleteEmployees = async (employee_id: number) => {
  return await axios.delete(`/employee/${employee_id}`);
};

export const putEmployeeWithWorkDays = async (values: any, employeeId: number) => {
  const employeeObj: Employee = {
    employee_name: values.employee_name,
    employee_surname: values.employee_surname,
    employee_identity_number: Number(values.employee_identity_number),
    employee_phone_number: values.employee_phone_number,
    employee_job_group_name: values.employee_job_group_name,
    employee_title_name: values.employee_title_name,
    employee_clinic_name: values.employee_clinic_name,
  };

  const body = {
    employee: employeeObj,
    employee_id: employeeId,
    employee_working_days: values.employee_working_days,
  };

  return await axios.put("/employee", body);
};
