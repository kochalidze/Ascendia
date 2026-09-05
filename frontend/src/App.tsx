import {useEffect} from "react";
import {  Outlet } from "react-router";
import { useAuthStore } from "./store/authStore";


function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="app">
      <Outlet />
    </div>
  )
}

export default App;