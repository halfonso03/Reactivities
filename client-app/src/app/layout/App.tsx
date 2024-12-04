/* eslint-disable react-refresh/only-export-components */

import { Container } from 'semantic-ui-react';

import NavBar from './NavBar';

import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';

export default observer(function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        theme="colored"
      ></ToastContainer>
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
