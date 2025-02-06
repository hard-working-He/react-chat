import { lazy } from 'react';

import { withPrivateRoute } from '../components/PrivateRoute';

import Login from '@/pages/login';
import Register from '@/pages/register';
import de from '@/pages/de'
export interface IRouter {
	name?: string;
	redirect?: string;
	path: string;
	children?: Array<IRouter>;
	component: React.ComponentType;
}

export const router: Array<IRouter> = [
			{
				path: '/chat',
				component: withPrivateRoute(lazy(() => import('../pages/container/ChatList')))
			},
			{
				path: '/address-book',
				component: withPrivateRoute(lazy(() => import('../pages/container/AddressBook')))
			},

	{
		path: '/login',
		component: Login
	},
	{
		path: '/register',
		component: Register
  },
  {
		path: '/dede',
		component: de
  }
];
