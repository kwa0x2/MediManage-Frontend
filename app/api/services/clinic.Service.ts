import axios from "../axios";

export const getAllClinicData = async () => {
    return await axios.get("/clinic");
}

export const getAllHospitalClinicData = async () => {
    return await axios.get("/clinic/hospital");
}

export const postHospitalClinic = async (values: any) => {
    return await axios.post("/clinic/hospital", values);
  };

  export const deleteHospitalClinicById = async (clinic_name: string) => {
    return await axios.delete(`/clinic/hospital/${clinic_name}`);
  };

  export const putHospitalClinic = async (values: any) => { 
    return await axios.put("/clinic/hospital", values);
  };
  