import axios from "../axios";

export const getAllTitleByJobGroupName = async (jobGroupName:  string) => {
    return await axios.get(`/title/${jobGroupName}`);
}

