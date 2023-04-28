import axios from 'axios';

interface RequestData {
    url: string;
    data: any;
    method: 'get' | 'post' | 'put' | 'delete';

  }

export const fetchMethod = ({url, data, method }:RequestData) => {
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response?.status) {
                return Promise.reject(error)
            }
        });
    return axios(
        {
            url,
            method,
            data,
        })
}