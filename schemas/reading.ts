import * as z from "zod";



export const AddEmployeeSchema = z.object({
    employee_name: z.string().nonempty("Personel adı gereklidir"),
    employee_surname: z.string().nonempty("Personel soyadı gereklidir"),
    employee_identity_number: z.string().nonempty("TC Kimlik Numarası gereklidir").max(11),
    employee_phone_number: z.string().nonempty("Telefon numarası gereklidir").max(15),
    employee_job_group_name: z.string().nonempty("Meslek grubu gereklidir"),
    employee_title_name: z.string().nonempty("Unvan gereklidir"),
    employee_clinic_name: z.string().optional(),
    employee_working_days: z.array(z.string()).optional()
  });

