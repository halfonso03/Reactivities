import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';

export default function ActivityFilters() {
  return (
    <>
      <Menu vertical size="large" style={{ width: '100%', marginTop: '25px' }}>
        <Header  attached color="teal" content="Filters"></Header>
        {/* icon="filter" */}
        <Menu.Item content="All Activities"></Menu.Item>
        <Menu.Item content="I'm going"></Menu.Item>
        <Menu.Item content="I'm Hosting"></Menu.Item>
      </Menu>
      <Header></Header>
      <Calendar></Calendar>
    </>
  );
}
