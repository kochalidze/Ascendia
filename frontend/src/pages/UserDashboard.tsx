import { useAuthStore } from "../store/authStore";
// import Test from "../components/Test";
import UpdateTest from "../components/UploadPicture";

function UserDashboard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard.</div>;
  }
  return (
	<div>
    {/* <Test /> */}
    <UpdateTest />
  </div>
  )
}

export default UserDashboard;