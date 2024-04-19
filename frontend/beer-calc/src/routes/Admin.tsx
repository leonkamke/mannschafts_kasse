import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';


function Admin() {
  const navigate = useNavigate();
  const signOut = useSignOut()

  const onSignOut = () => {
    signOut();
    navigate("/", {replace: true});
  }
  return (
    <div>
      <h2>Admin</h2>
      <p>Welcome to our website!</p>
      <button onClick={onSignOut}>Sign Out</button>
    </div>
  );
}
export default Admin;