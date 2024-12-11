/* eslint-disable react-refresh/only-export-components */
import {
  Divider,
  Grid,
  Header,
  Item,
  Segment,
  Statistic,
  StatisticLabel,
  StatisticValue,
} from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';

import { observer } from 'mobx-react-lite';
import FollowButton from './FollowButton';

interface Props {
  profile: Profile;
}

export default observer(function ProfileHeader({ profile }: Props) {
  console.log(profile);
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size="small"
                src={profile?.image || '/assets/user.png'}
              ></Item.Image>
              <Item.Content verticalAlign="middle">
                <Header as="h1" content={profile.displayName}></Header>
              </Item.Content>
            </Item>
          </Item.Group>
          `
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic>
              <StatisticValue>{profile.followersCount || 0}</StatisticValue>
              <StatisticLabel>Followers</StatisticLabel>
            </Statistic>
            <Statistic>
              <StatisticValue>{profile.followingCount || 0}</StatisticValue>
              <StatisticLabel>Following</StatisticLabel>
            </Statistic>
          </Statistic.Group>
          <Divider></Divider>
          <FollowButton profile={profile}></FollowButton>
        </Grid.Column>
      </Grid>
    </Segment>
  );
});
