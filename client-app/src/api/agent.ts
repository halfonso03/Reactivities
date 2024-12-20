import { toast } from 'react-toastify';
import { Activity, ActivityFormValues } from './../app/models/activity';
/* eslint-disable @typescript-eslint/no-empty-object-type */
import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from '../app/router/Routes';
import { store } from '../app/stores/store';
import { UserFormValues } from '../features/home/user';
import { User } from '../app/models/user';
import { Photo, Profile, ProfileFormValues, UserActivity } from '../app/models/profile';
import { PaginatedResult } from '../app/models/pagination';



const sleep = (delay: number) => { return new Promise(resolve => setTimeout(resolve, delay)) }

// middleware
axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(async response => {

    if (import.meta.env.DEV) await sleep(1000);

    const pagination = response.headers["pagination"];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<unknown>>;
    }
    return response;

}, (error: AxiosError) => {
    const { data, status, config, headers } = error.response as AxiosResponse;

    switch (status) {

        case 400:

            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                router.navigate('/not-found');
            }

            if (data.errors) {

                const modelStateErrors = [];

                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            else {
                toast.error(data);
            }
            // toast.error('bad Request');
            break;
        case 401:
            if (status === 401 && headers['www-authenticate']?.startsWith("Bearer error=invalid_token")) {
                store.userStore.logout();
                toast.error('Session expired. Please log in again');
            } else {
                toast.error('Unauthorized');
            }

            break;
        case 403:
            toast.error('Forbidden')
            break;
        case 404:
            router.navigate('/not-found')
            //toast.error('Not found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error')
            break;
    }

    return Promise.reject(error)
});

axios.defaults.baseURL = import.meta.env.VITE_API_URL;



const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}


const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', { params })
        .then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),

}


const Account = {
    current: () => requests.get<User>('/account'),
    // current: (token: string) => {
    //     axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    //     return requests.get<User>('/account');

    // },
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    refreshToken: () => requests.post<User>('/account/refreshtoken', {})
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        const formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),
    update: (profile: ProfileFormValues) => requests.put(`/profiles`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}


export default agent;