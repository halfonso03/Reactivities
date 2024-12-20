import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import App from '../layout/App';
import ActivityDashboard from '../../features/activties/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activties/form/ActivityForm';
import ActivityDetails from '../../features/activties/details/ActivityDetails';
import TestErrors from '../../features/errors/testError';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import LoginForm from '../../features/users/LoginForm';
import ProfilePage from '../../features/activties/profiles/ProfilePage';
import RequireAuth from './RequireAuth';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App></App>,
    children: [
      {
        element: <RequireAuth></RequireAuth>,
        children: [
          {
            path: 'activities',
            element: <ActivityDashboard />,
          },
          {
            path: 'createActivity',
            element: <ActivityForm key="create" />,
          },
          {
            path: 'manage/:id',
            element: <ActivityForm key="manage" />,
          },
          {
            path: 'profiles/:username',
            element: <ProfilePage />,
          },
          {
            path: 'login',
            element: <LoginForm />,
          },
          {
            path: 'activities/:id',
            element: <ActivityDetails></ActivityDetails>,
          },
          {
            path: 'errors',
            element: <TestErrors />,
          },
        ],
      },
      {
        path: 'not-found',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <Navigate replace to="/not-found"></Navigate>,
      },
      {
        path: 'server-error',
        element: <ServerError></ServerError>,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
