async function makeApiCall(method, url, body) {
    const actualUrl = ApiService.baseUrl + url;
    const response = await fetch(actualUrl, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const newErrorObj = await response.json();
        const error = new Error(response.statusText);
        error.code = newErrorObj.status;
        error.description = newErrorObj.errorMessage;
        throw error;
    }

    return await response.json();
}

export const ApiService = {
    baseUrl: "http://localhost:5095/api",

    async getData(url) {
        try {
            return await makeApiCall('GET', url);
        } catch (error) {
            return Promise.reject(error);
        }
    },

    async postData(url, body) {
        try {
            return await makeApiCall('POST', url, body);
        } catch (error) {
            return Promise.reject(error);
        }
    },

    async updateData(url, body) {
        try {
            return await makeApiCall('PUT', url, body);
        } catch (error) {
            return Promise.reject(error);
        }
    },

    async deleteData(url) {
        try {
            return await makeApiCall('DELETE', url);
        } catch (error) {
            return Promise.reject(error);
        }
    }
};
