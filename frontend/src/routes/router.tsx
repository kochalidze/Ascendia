import { createBrowserRouter, redirect } from "react-router";

import App from "../App";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import FirstPage from "../pages/FirstPage";

const router = createBrowserRouter([
	{
		path: "/",
		Component: App,
		children: [
			{
				path: '/',
				loader: () => redirect('/firstpage')
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
			}
		]
	}
]);

export default router;