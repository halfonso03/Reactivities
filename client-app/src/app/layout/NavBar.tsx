/* eslint-disable react-refresh/only-export-components */
import { Button, Container, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

export default observer(function NavBar() {
  

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item>
          <img src="logo.png" alt="logo" style={{ marginRight: '10px' }} />
        </Menu.Item>
        <Menu.Item as={NavLink} to="/">
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} to="/activities"></Menu.Item>
        <Menu.Item name="Errors" as={NavLink} to="/errors"></Menu.Item>
        <Menu.Item>
          <Button
            positive
            as={NavLink}
            to="/createActivity"
            content="Create Activity"
          ></Button>
        </Menu.Item>
        {/* <button onClick={() => store.commonStore.setTitle()}>Click Me</button>
        <div
          style={{ padding: '10px', backgroundColor: 'green', width: '100px' }}
        >
          {store?.commonStore?.Title}
        </div> */}
      </Container>
    </Menu>
  );
});
