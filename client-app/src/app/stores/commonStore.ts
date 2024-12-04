import { ServerError } from './../models/serverError';
import { makeAutoObservable } from "mobx";

export default class CommonStore {
    error: ServerError | null = null;
    title: string | null = null;

    constructor() {
        makeAutoObservable(this);
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
}