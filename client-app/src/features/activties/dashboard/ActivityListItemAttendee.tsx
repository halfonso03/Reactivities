/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite';
import { Image, List, Popup } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';
import { Link } from 'react-router-dom';
import ProfileCard from '../profiles/ProfileCard';

interface Props {
  attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({
  attendees,
}: Props) {
  const styles = {
    borderColor: 'orange',
    borderWidth: 3,
  };

  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <Popup
          hoverable
          key={attendee.username}
          trigger={
            <List.Item
              key={attendee.username}
              as={Link}
              to={`/profiles/${attendee.username}`}
            >
              <Image
                circular
                bordered
                style={attendee.following ? styles : null}
                size="mini"
                src={attendee.image || `assets/user.png`}
              ></Image>
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee}></ProfileCard>
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
});
