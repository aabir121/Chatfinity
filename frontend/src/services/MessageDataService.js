import {ApiService} from "./ApiService";

export const MessageDataService = {
    getPrivateChat: (participants) => {
        return ApiService.getData(`/Chat/Private/${participants[0]}/${participants[1]}`);
    },

    getPublicChat: () => {
        return ApiService.getData("/Chat/Public");
    }
}