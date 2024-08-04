import * as z from "zod";

export const AddUserSchema = z.object({
  user_name: z.string().nonempty("Personel adı gereklidir"),
  user_surname: z.string().nonempty("Personel soyadı gereklidir"),
  user_identity_number: z.string().nonempty("TC Kimlik Numarası gereklidir").max(11),
  user_email: z.string().email().nonempty("E-Posta gereklidir").max(15),
  user_phone: z.string().nonempty("Telefon numarası gereklidir"),
  user_role: z.string().nonempty("Role gereklidir"),
  user_password: z.string().optional()
});
