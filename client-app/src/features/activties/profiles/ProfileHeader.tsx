/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-constant-condition */
import {
  Button,
  Divider,
  Grid,
  Header,
  Item,
  Reveal,
  RevealContent,
  Segment,
  Statistic,
  StatisticLabel,
  StatisticValue,
} from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';

import { observer } from 'mobx-react-lite';

interface Props {
  profile: Profile;
}

export default observer(function ProfileHeader({ profile }: Props) {
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
              <StatisticValue>42</StatisticValue>
              <StatisticLabel>Following</StatisticLabel>
            </Statistic>
            <Statistic>
              <StatisticValue>5</StatisticValue>
              <StatisticLabel>Followers</StatisticLabel>
            </Statistic>
          </Statistic.Group>
          <Divider></Divider>
          <Reveal animated="move">
            <RevealContent visible style={{ width: '100%' }}>
              <Button fluid color="teal" content="Following"></Button>
            </RevealContent>
            <RevealContent hidden style={{ width: '100%' }}>
              <Button
                fluid
                basic
                color={1 == 1 ? 'red' : 'green'}
                content={1 == 1 ? 'Unfollow' : 'Follow'}
              ></Button>
            </RevealContent>
          </Reveal>
        </Grid.Column>
      </Grid>
    </Segment>
  );
});
