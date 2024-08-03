import axios from "../axios";

export const getAll = async () => {
    return await axios.get("/district");
}

export const getAllDistrictsByProvince = async (provinceName:  string) => {
    return await axios.get(`/district/${provinceName}`);
}
