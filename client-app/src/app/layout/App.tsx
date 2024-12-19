/* eslint-disable react-refresh/only-export-components */

import { Container } from 'semantic-ui-react';

import NavBar from './NavBar';

import { observer } from 'mobx-react-lite';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';

export default observer(function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
console.log(commonStore.token)
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) {
    return <LoadingComponent content="Loading app..."></LoadingComponent>;
  }

  return (
    <>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        theme="colored"
      ></ToastContainer>
      <ScrollRestoration></ScrollRestoration>
      <ModalContainer></ModalContainer>
      {location.pathname === '/' ? (
        <HomePage></HomePage>
      ) : (
        <>
          <NavBar></NavBar>
          <Container style={{ marginTop: '7em' }}>
            <Outlet></Outlet>
          </Container>
        </>
      )}
    </>
  );
});

// {ducks.map((d) => (
//   <DuckItem duck={d} key={d.name}></DuckItem>
// ))}
