import {ApiService} from "./ApiService";
export const UserDataService={
    getAllUsers : () => {
        return ApiService.getData("/User");
    },

    createNewUser : (userData) => {
        return ApiService.postData("/User", userData);
    },

    loginUser : (userBody) => {
        return ApiService.postData("/User/Login", userBody);
    }
};