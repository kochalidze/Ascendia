import { useAuthStore } from "../store/authStore";
// import Test from "../components/Test";
import UpdateTest from "../components/UploadPicture";
import PostUploadTest from "../components/Postuploadtest";

function UserDashboard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard.</div>;
  }
  return (
	<div>
    {/* <Test /> */}
    <UpdateTest />
    <br />
    <PostUploadTest />
  </div>
  )
}

export default UserDashboard;