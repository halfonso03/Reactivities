/* eslint-disable react-refresh/only-export-components */
import { Grid } from 'semantic-ui-react';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function ProfilePage() {
  const { username } = useParams<{ username: string }>();

  const { profileStore } = useStore();
  const { loadingProfile, loadProfile, profile, setActiveTab } = profileStore;

  useEffect(() => {
    loadProfile(username!);
    return () => setActiveTab(0);
  }, [loadProfile, setActiveTab, username]);

  if (loadingProfile) return <LoadingComponent></LoadingComponent>;

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && <ProfileHeader profile={profile}></ProfileHeader>}
        {profile && <ProfileContent profile={profile}></ProfileContent>}
      </Grid.Column>
    </Grid>
  );
});
