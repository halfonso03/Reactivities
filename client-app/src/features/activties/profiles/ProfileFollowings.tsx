/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';

import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import ProfileCard from './ProfileCard';

export default observer(function ProfileFollowings() {
  const { profileStore } = useStore();
  const { profile, followings, loadingFollowings, activeTab } = profileStore;

  return (
    <Tab.Pane loading={loadingFollowings}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={
              'People ' +
              (activeTab === 3
                ? 'Following ' + profile?.displayName
                : profile?.displayName + ' is Following')
            }
          ></Header>
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            {followings.map((profile) => (
              <ProfileCard
                key={profile.username}
                profile={profile}
              ></ProfileCard>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
