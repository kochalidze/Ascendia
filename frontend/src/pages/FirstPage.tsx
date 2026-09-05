import { useAuthStore } from "../store/authStore";

import SignUp from "./SignUp";
import SignIn from "./SignIn";

function FirstPage() {
  const { isAuthenticated } = useAuthStore();
  
  return (
	<div>
  {isAuthenticated ? (<SignIn />) : (<SignUp />)}
  </div>
  );
}

export default FirstPage;