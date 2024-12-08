/* eslint-disable react-refresh/only-export-components */

import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();

  const { loadActivities, activityRegistry } = activityStore;

  useEffect(() => {
    if (activityRegistry.size <= 1) {
      loadActivities();
    }
  }, [activityRegistry.size, activityStore, loadActivities]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content={'Loading Activities'}></LoadingComponent>;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList></ActivityList>
        asdasd
      </Grid.Column>
      <Grid.Column width="6">
        {/* {selectedActivity && !editMode && <ActivityDetails></ActivityDetails>}
        {editMode && <ActivityForm></ActivityForm>} */}
        <h2>Activity Filters</h2>
        <ActivityFilters></ActivityFilters>
      </Grid.Column>
    </Grid>
  );
});
