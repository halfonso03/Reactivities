/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite';
import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

export default observer(function ActivityFilters() {
  const { activityStore } = useStore();
  const { predicate, setPredicate } = activityStore;

  return (
    <>
      <Menu vertical size="large" style={{ width: '100%', marginTop: '25px' }}>
        <Header attached color="teal" content="Filters"></Header>
        {/* icon="filter" */}

        <Menu.Item
          active={predicate.has('all')}
          onClick={() => setPredicate('all', 'true')}
        >
          All Activities
        </Menu.Item>
        <Menu.Item
          onClick={() => setPredicate('isGoing', 'true')}
          active={predicate.has('isGoing')}
        >
          I'm Going
        </Menu.Item>
        <Menu.Item
          onClick={() => setPredicate('isHost', 'true')}
          active={predicate.has('isHost')}
        >
          I'm Hosting
        </Menu.Item>
      </Menu>
      <Header></Header>
      <Calendar
        onChange={(date) => setPredicate('startDate', date as Date)}
        value={predicate.get('startDate') || new Date()}
      ></Calendar>
    </>
  );
});
