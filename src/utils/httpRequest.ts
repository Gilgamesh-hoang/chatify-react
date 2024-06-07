import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL;

if (!baseURL) {
    throw new Error('REACT_APP_BACKEND_URL is not defined in .env file');
}

const httpRequest: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
});

export const get = async <T>(path: string, option: AxiosRequestConfig = {}): Promise<T> => {
    const response: AxiosResponse<T> = await httpRequest.get<T>(path, option);
    return response.data;
}
export const post = async <T>(path: string, option: AxiosRequestConfig = {}): Promise<T> => {
    const response: AxiosResponse<T> = await httpRequest.post<T>(path, option);
    return response.data;
}

export default httpRequest;
