import { createBrowserRouter, redirect } from "react-router";

import App from "../App";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import FirstPage from "../pages/FirstPage";

import UserDashboard from "../pages/UserDashboard";

const router = createBrowserRouter([
	{
		path: "/",
		Component: App,
		children: [
			{
				path: '/',
				loader: () => redirect('/signin')
			},
			{
				path: "/signup",
				Component: SignUp ,
			},
			{
				path: "/signin",
				Component: SignIn ,
			},
			{
				path: "/firstpage",
				Component: FirstPage ,
			},
			{
				path: "/dashboard",
				Component: UserDashboard ,
			}
		]
	}
]);

export default router;