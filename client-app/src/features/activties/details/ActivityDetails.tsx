/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';

import { useStore } from '../../../app/stores/store';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

import ActivityFilters from '../dashboard/ActivityFilters';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const { id } = useParams();

  const {
    selectedActivity: activity,
    loadActivity,
    loadingInitial,
    clearSelectedActivity,
  } = activityStore;

  useEffect(() => {
    if (id) {
      loadActivity(id);
    }
    return () => {
      clearSelectedActivity();
    };
  }, [id, loadActivity, clearSelectedActivity]);

  if (loadingInitial || !activity) return <LoadingComponent></LoadingComponent>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity}></ActivityDetailedHeader>
        <ActivityDetailedInfo activity={activity}></ActivityDetailedInfo>
        <ActivityDetailedChat activityId={activity.id}></ActivityDetailedChat>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar activity={activity}></ActivityDetailedSidebar>
        <ActivityFilters></ActivityFilters>
      </Grid.Column>
    </Grid>
  );
});
