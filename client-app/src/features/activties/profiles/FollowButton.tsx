/* eslint-disable no-constant-condition */
/* eslint-disable react-refresh/only-export-components */
import { Button, Reveal, RevealContent } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import { SyntheticEvent } from 'react';

interface Props {
  profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {
  const { profileStore, userStore } = useStore();
  const { updateFollowing, loading } = profileStore;

  if (userStore.user?.username === profile.username) return null;

  function handleFollow(e: SyntheticEvent, username: string) {
    e.preventDefault();
    if (profile.following) {
      updateFollowing(username, false);
    } else {
      updateFollowing(username, true);
    }
  }

  return (
    <Reveal animated="move">
      <RevealContent visible style={{ width: '100%' }}>
        <Button
          fluid
          color="teal"
          content={profile.following ? 'Following' : 'Not Following'}
        ></Button>
      </RevealContent>
      <RevealContent hidden style={{ width: '100%' }}>
        <Button
          fluid
          loading={loading}
          basic
          onClick={(e) => handleFollow(e, profile.username)}
          color={profile.following ? 'red' : 'green'}
          content={profile.following ? 'Unfollow' : 'Follow'}
        ></Button>
      </RevealContent>
    </Reveal>
  );
});
