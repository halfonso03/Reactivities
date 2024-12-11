/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { User } from "./user";

export interface IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?: Photo[],
    followersCount: number;
    followingCount: number;
    following: boolean
}


export class Profile implements IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string
    photos?: Photo[];
    followersCount: number;
    followingCount: number;
    following: boolean

    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
        this.followersCount = 0;
        this.followingCount = 0;
        this.following = false;
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