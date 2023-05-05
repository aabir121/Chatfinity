import {ApiService} from "./ApiService";

export const MessageDataService = {
    createMessage: (body) => {
        return ApiService.postData("/Message", body);
    },

    getAllMessage: () => {
        return ApiService.getData("/Message");
    },

    getMessages: (from, to) => {
        return ApiService.getData(`/Message/${from}/${to}`);
    }
}