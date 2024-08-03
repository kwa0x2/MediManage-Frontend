import axios from "../axios";

export const getAllProvinces = async () => {
    return await axios.get("/province");
}


