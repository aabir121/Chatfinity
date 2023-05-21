import {ApiService} from "./ApiService";

export const UserDataService = {
    getAllUsers: () => {
        return ApiService.getData("/User/Chat");
    },

    createNewUser: (userData) => {
        return ApiService.postData("/User", userData);
    },

    loginUser: (userBody) => {
        return ApiService.postData("/User/Login", userBody);
    },

    logoutUser: (userName) => {
        return ApiService.postData("/User/Logout", {userName: userName});
    }
};
