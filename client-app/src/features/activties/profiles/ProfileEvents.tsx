import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,

  Image,
  Segment,
  SegmentInline,
  Tab,
  TabPane,
} from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { UserActivity } from '../../../app/models/profile';

export default function ProfileEvents() {
  const {
    profileStore: { loadingActivities },
  } = useStore();

  const panes = [
    {
      menuItem: 'Future Events',
      render: () => (
        <TabPane attached={false} loading={loadingActivities}>
          <ProfilEventsList predicate={'future'}></ProfilEventsList>
        </TabPane>
      ),
    },
    {
      menuItem: 'Past Events',
      render: () => (
        <TabPane attached={false} loading={loadingActivities}>
          <ProfilEventsList predicate={'past'}></ProfilEventsList>
        </TabPane>
      ),
    },
    {
      menuItem: 'Hosting',
      render: () => (
        <TabPane attached={false} loading={loadingActivities}>
          <ProfilEventsList predicate={'hosting'}></ProfilEventsList>
        </TabPane>
      ),
    },
  ];

  return <Tab menu={{ secondary: true, pointing: true }} panes={panes} />;
}

interface PropsEvents {
  predicate: string;
}

const ProfilEventsList = observer(function ProfilEventsList({
  predicate,
}: PropsEvents) {
  const {
    profileStore: { loadActivities, profile, profileActivities },
  } = useStore();

  useEffect(() => {
    loadActivities(profile!.username!, predicate);
  }, [loadActivities, predicate, profile]);

  return (
    <Segment basic>
      <SegmentInline>
        {profileActivities.map((activity: UserActivity) => (
          <Card key={activity.id} >
            <Image src="/asset/placeholder.png" wrapped ui={false} />
            <CardContent>
              <CardHeader centered={true}>{activity.title}</CardHeader>

              <CardDescription centered={true}>{activity.category}</CardDescription>
            </CardContent>
            <CardContent
              extra
              centered={true}
              content={activity?.date ? activity.date.toString() : ''}
            ></CardContent>
          </Card>
        ))}
      </SegmentInline>
    </Segment>
  );
});
