/* eslint-disable react-refresh/only-export-components */

import { Grid, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActitivityListItemPlaceholder';

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const { setPagingParams, pagination, loadActivities, activityRegistry } =
    activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    if (activityRegistry.size <= 1) {
      loadActivities();
    }
  }, [activityRegistry.size, activityStore, loadActivities]);

  return (
    <Grid>
      <Grid.Column width="10">
        {activityStore.loadingInitial &&
        activityRegistry.size === 0 &&
        !loadingNext ? (
          <>
            <ActivityListItemPlaceholder></ActivityListItemPlaceholder>
            <ActivityListItemPlaceholder></ActivityListItemPlaceholder>
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            
            loadMore={handleGetNext}
            hasMore={
              !loadingNext &&
              !!pagination &&
              pagination.currentPage < pagination.totalPages
            }
            initialLoad={false}
          >
            <ActivityList></ActivityList>
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width="6">
        {/* {selectedActivity && !editMode && <ActivityDetails></ActivityDetails>}
        {editMode && <ActivityForm></ActivityForm>} */}
        <h2>Activity Filters</h2>
        <ActivityFilters></ActivityFilters>
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext}></Loader>
      </Grid.Column>
    </Grid>
  );
});
