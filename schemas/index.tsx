import * as z from "zod";
export const RegisterSchema = z.object({
  hospital_name: z
    .string({
      invalid_type_error: "Geçersiz karakter",
    })
    .min(1),
    hospital_tax_identity_number: z.string().min(1),
    hospital_email: z.string().email().min(1),
    hospital_phone_number: z.string().min(1),
    hospital_province_name: z.string().min(1),
    hospital_district_name: z.string().min(1),
    hospital_address: z.string().min(1),
    user_name: z.string().min(1),
    user_surname: z.string().min(1),
    user_identity_number: z.string().min(1),
    user_email: z.string().email(),
    user_phone: z.string().min(1),
    user_password: z.string().min(1),

});

export const LoginSchema = z.object({
  user_identifier: z.string(),
  user_password: z.string().min(1, "Password must be at least 6 characters long"),
});
