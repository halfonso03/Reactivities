
import { makeAutoObservable, runInAction } from "mobx";
import {  UserFormValues } from "../../features/home/user";
import agent from "../../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";
import { User } from "../models/user";

export default class UserStore {

    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {

        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        const user = await agent.Account.login(creds);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user)
        store.modalStore.closeModal();
        router.navigate('/activities');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => { this.user = user })

        } catch (error) {
            console.log(error)
        }
    }

    logout = () => {
        store.commonStore.token = null;
        this.user = null;
        router.navigate('/')
    }


    register = async (creds: UserFormValues) => {
        const user = await agent.Account.register(creds);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user)
        store.modalStore.closeModal();
        router.navigate('/activities');
    }

    setImage(image: string) {
        if (this.user) {
            this.user.image = image;
        }


    }

    // useEffect(() => {


    //     if (store.commonStore.getToken() && !this.user) {
    //       const token = localStorage.getItem('jwt');
    //       
    //       getUser();

    //     }

    //   }, [getToken, user]);

}