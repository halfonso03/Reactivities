
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../../api/agent";
import { format } from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {

    activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activityRegistry.clear();
                this.loadActivities();
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }


    setPredicate = (predicate: string, value: string | Date) => {

        const resetPredicate = () => {
            this.predicate.forEach((_, key) => {
                if (key !== 'startDate') this.predicate.delete(key)
            })
        };


        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate': {
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value)
            }
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString())
            } else {
                params.append(key, value);
            }
        })

        return params;
    }


    get activitiesByDate() {


        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {

        return Object.entries(this.activitiesByDate.reduce((activities, activity) => {
            const date = format(activity.date!, "dd MMM yyyy");
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: Activity[] }))
    }

    loadActivities = async () => {


        this.setLoadingInitial(true);
        try {
            const result = await agent.Activities.list(this.axiosParams);

            result.data.forEach(activity => {
                this.setActivity(activity);
            });
            this.setPagination(result.pagination);
            this.setLoadingInitial(false);
        } catch (error) {
            this.setLoadingInitial(false);
            console.log(error)
        }
    }

    setPagination = (p: Pagination) => {
        this.pagination = p;
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    // selectActivity = (id: string) => {

    //     this.selectedActivity = this.activityRegistry.get(id);
    // }

    // cancelSelectedActivity() {
    //     this.selectedActivity = undefined;
    // }


    // not used after routing
    // openForm = (id?: string) => {
    //     if (id) {
    //         this.selectActivity(id);
    //     } else {
    //         this.cancelSelectedActivity();
    //     }

    //     this.editMode = true;
    // }

    // closeForm = () => {
    //     this.editMode = false;
    // }

    createActivity = async (activity: ActivityFormValues) => {
        // this.loading = true;
        //activity.id = uuid();
        const user = store.userStore.user;
        const attendee = new Profile(user!);

        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                // this.activityRegistry.set(newActivity.id, newActivity);
                this.selectedActivity = newActivity;
            });
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false;
            })
        }
    }


    updateActivity = async (activity: ActivityFormValues) => {

        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    const updatedActivity = { ...this.getActivity(activity.id), ...activity };
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
                //this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
            });
        } catch (error) {
            console.log(error)
            runInAction(() => {

            })
        }
    }



    deleteActivity = async (id: string) => {
        this.loading = true;

        try {
            await agent.Activities.delete(id);
            runInAction(() => {

                this.activityRegistry.delete(id);
                //(this.activities.findIndex(a => a.id === id), 1);
                //if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
                // this.selectActivity(null);
                this.loading = false;
            });
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    cancelActivityTogle = async () => {
        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    loadActivity = async (id: string) => {

        let activity = this.getActivity(id);

        if (activity) {
            this.selectedActivity = activity;
            return this.selectedActivity;
        } else {
            this.setLoadingInitial(true);

            try {

                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                });
                this.setLoadingInitial(false);
                return this.selectedActivity;
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false);
            }
        }
    }

    updateAttendance = async () => {

        const user = store.userStore.user;

        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees =
                        this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                } else {

                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }

                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.loading = false);
        }

    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    updateAttendeeFollowing = (username: string) => {


        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.username == username) {
                    if (attendee.following) {
                        attendee.followersCount--;
                    } else {
                        attendee.followersCount++;
                    }

                    attendee.following = !attendee.following;
                }
            })
        })
    }




    private setActivity = (activity: Activity) => {

        const user = store.userStore.user;

        if (user) {
            activity.isGoing = activity.attendees!.some(a => a.username === user.username);
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }

        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }



    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }
}