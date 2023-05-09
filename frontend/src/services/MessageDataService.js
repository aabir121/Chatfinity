import {ApiService} from "./ApiService";

export const MessageDataService = {
    createMessage: (body) => {
        return ApiService.postData("/Chat/Message", body);
    },

    getAllMessage: () => {
        return ApiService.getData("/Message");
    },

    getMessages: (from, to) => {
        return ApiService.getData(`/Message/${from}/${to}`);
    },

    getPublicChat : () => {
        return ApiService.getData("/Chat/Public");
    }
}