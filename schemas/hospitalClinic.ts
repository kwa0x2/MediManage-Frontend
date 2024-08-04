import * as z from "zod";

export const AddHospitalClinicSchema = z.object({
//   clinic_name: z.string().nonempty("Poliklinik adı gereklidir"),
  add_clinic_data: z.array(z.string()).optional()

});
