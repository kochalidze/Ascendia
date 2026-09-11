import { useAuthStore } from "../store/authStore";

function UserDashboard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard.</div>;
  }
  return (
	<div>UserDashboard</div>
  )
}

export default UserDashboard;