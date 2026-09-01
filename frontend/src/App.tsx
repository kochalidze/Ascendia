import {useEffect} from "react";
import { useAuthStore } from "./store/authStore";

import Registration from "./pages/Registration.tsx";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div className="app">
      <Registration />
    </div>
  )
}

export default App;