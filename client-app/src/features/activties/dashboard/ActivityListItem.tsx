import { Button, Item, Label, Segment } from 'semantic-ui-react';

import { Link } from 'react-router-dom';
import { Activity } from '../../../app/models/activity';
import { format } from 'date-fns';
import ActivityListItemAttendee from './ActivityListItemAttendee';
// import { SyntheticEvent, useState } from 'react';
// import { useStore } from '../../../app/stores/store';

interface Props {
  activity: Activity;
}

export default function ActivityListItem({ activity }: Props) {
  // const { activityStore } = useStore();
  // const { deleteActivity, loading } = activityStore;

  // const [target, setTarget] = useState('');

  // function handleActivityDelete(
  //   e: SyntheticEvent<HTMLButtonElement>,
  //   id: string
  // ) {
  //   setTarget(e.currentTarget.name);
  //   deleteActivity(id);
  // }

  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label
            attached="top"
            color="red"
            content="Cancelled"
            style={{ textAlign: 'center' }}
          ></Label>
        )}
        <Item.Group>
          <Item>
            <Item.Image
              style={{ marginBottom: 5}}
              size="tiny"
              circular
              src={'/assets/user.png'}
            />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by {activity.host?.displayName}
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color="orange">
                    Your are hosting this activity
                  </Label>
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color="green">
                    Your are going to this activity
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          {/* <Icon name="clock" />  */}
          {format(activity.date!, 'M/d/yyyy h:mm:ss a')}{' '}
          {/* <Icon name="marker" /> */}
          {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendee
          attendees={activity.attendees!}
        ></ActivityListItemAttendee>
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          color="teal"
          floated="right"
          content="View"
        />
      </Segment>
    </Segment.Group>
  );
}
