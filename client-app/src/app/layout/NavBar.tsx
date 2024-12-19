/* eslint-disable react-refresh/only-export-components */
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';

export default observer(function NavBar() {
  const {
    userStore: { user, logout, isLoggedIn },
  } = useStore();

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item>
          <img src="logo.png" alt="logo" style={{ marginRight: '10px' }} />
        </Menu.Item>

        {isLoggedIn && (
          <>
            <Menu.Item as={NavLink} to="/">
              Reactivities
            </Menu.Item>
            <Menu.Item
              name="Activities"
              as={NavLink}
              to="/activities"
            ></Menu.Item>
            <Menu.Item name="Errors" as={NavLink} to="/errors"></Menu.Item>
            <Menu.Item>
              <Button
                positive
                as={NavLink}
                to="/createActivity"
                content="Create Activity"
              ></Button>
            </Menu.Item>
            <Menu.Item position="right">
              <Image
                src={user?.image || '/assets/user.png'}
                avatar
                spaced="right"
              ></Image>
              <Dropdown pointing="top left" text={user?.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profiles/${user?.username}`}
                    text="My Profile"
                  ></Dropdown.Item>
                  <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
        )}

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
