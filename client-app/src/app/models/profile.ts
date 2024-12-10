/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { User } from "./user";

export interface IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?: Photo[]
}


export class Profile implements IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string
    photos?: Photo[];

    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}


export interface IProfileFormValues {
    displayName: string;
    bio: string
}

export class ProfileFormValues implements IProfileFormValues {

    displayName: string = '';
    bio: string = ''
    constructor(displayName: string, bio: string) {
        this.displayName = displayName;
        this.bio = bio;
    }
}


export interface Photo {
    id: string;
    url: string;
    isMain: boolean
}