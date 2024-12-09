/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite';
import { Profile } from '../../../app/models/profile';
import { Card, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

interface Props {
  profile: Profile;
}

export default observer(function ProfileCard({ profile }: Props) {
  return (
    <Card as={Link} to={`/profiles/${profile.username}`}>
      <Image src={profile.image || 'assets/user.png'}></Image>
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>Bio goes here</Card.Description>
      </Card.Content>
      <Card.Content>
        20 followers
      </Card.Content>
    </Card>
  );
});
