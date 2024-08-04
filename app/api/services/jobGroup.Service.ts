import axios from "../axios";

export const getAllJobGroups = async () => {
    return await axios.get("/jobgroup");
}

