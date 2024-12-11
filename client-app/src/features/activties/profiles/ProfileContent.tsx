/* eslint-disable react-refresh/only-export-components */
import { Tab } from 'semantic-ui-react';
import ProfilePhotos from './ProfilePhotos';
import { Profile } from '../../../app/models/profile';
import { observer } from 'mobx-react-lite';
import ProfileDetails from './ProfileDetails';
import ProfileFollowings from './ProfileFollowings';
import { useStore } from '../../../app/stores/store';

interface Props {
  profile: Profile;
}

export default observer(function ProfileContent({ profile }: Props) {
  const { profileStore } = useStore();
  const { setActiveTab } = profileStore;

  const panes = [
    {
      menuItem: 'About',
      render: () => (
        <Tab.Pane>
          <ProfileDetails></ProfileDetails>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Photos',
      render: () => (
        <Tab.Pane>
          <ProfilePhotos profile={profile}></ProfilePhotos>
        </Tab.Pane>
      ),
    },
    { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
    {
      menuItem: 'Followers',
      render: () => (
        <Tab.Pane>
          <ProfileFollowings></ProfileFollowings>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Following',
      render: () => (
        <Tab.Pane>
          <ProfileFollowings></ProfileFollowings>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      onTabChange={(_, data) => setActiveTab(data.activeIndex as number)}
      menuPosition="right"
      panes={panes}
    ></Tab>
  );
});
