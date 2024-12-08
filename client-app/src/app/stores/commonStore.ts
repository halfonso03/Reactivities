import { ServerError } from './../models/serverError';
import { makeAutoObservable, reaction } from "mobx";

export default class CommonStore {
    error: ServerError | null = null;
    title: string | null = null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) {
                    localStorage.setItem('jwt', token);
                } else {
                    localStorage.removeItem('jwt');
                }
            }
        )
    }

    setTitle() {

        this.title = 'Mr.';
    }


    get Title() {
        return this.title;
    }

    setServerError(error: ServerError) {
        this.error = error;
    }

    setToken = (token: string | null) => {
        this.token = token;

    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }

    getToken = () => {
        const token = localStorage.getItem('jwt');
        if (token) {
            return token;
        }
        return null;
    }
}