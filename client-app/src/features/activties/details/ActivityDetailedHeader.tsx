/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite';
import { Button, Header, Item, Segment, Image, Label } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../../app/stores/store';

const activityImageStyle = {
  filter: 'brightness(30%)',
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white',
};

interface Props {
  activity: Activity;
}

export default observer(function ActivityDetailedHeader({ activity }: Props) {
  const {
    activityStore: { updateAttendance, loading, cancelActivityTogle },
  } = useStore();

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: '0' }}>
        {activity.isCancelled && (
          <Label
            style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color="red"
            content="Cancelled"
          ></Label>
        )}
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: 'white' }}
                />
                <p>{format(activity.date!, 'M/d/yyyy h:mm:ss a')}</p>
                <p>
                  Hosted by{' '}
                  <strong>
                    <Link to={`/profiles/${activity.host?.username}`}>
                      {activity.host?.username}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <>
            <Button
              onClick={cancelActivityTogle}
              color={activity.isCancelled ? 'green' : 'red'}
              floated="left"
              basic
              loading={loading}
              content={
                activity.isCancelled
                  ? 'Re-activate Activity'
                  : 'Cancel Activity'
              }
            ></Button>
            <Button
              disabled={activity.isCancelled}
              color="orange"
              floated="right"
              as={Link}
              to={`/manage/${activity.id}`}
            >
              Manage Event
            </Button>
          </>
        ) : activity.isGoing ? (
          <Button onClick={updateAttendance} loading={loading}>
            Cancel attendance
          </Button>
        ) : (
          <Button
            onClick={updateAttendance}
            loading={loading}
            color="teal"
            disabled={activity.isCancelled}
          >
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
});
