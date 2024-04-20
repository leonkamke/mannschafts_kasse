import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';


function User() {
  const navigate = useNavigate();
  const signOut = useSignOut()

  const onSignOut = () => {
    signOut();
    navigate("/", {replace: true});
  }
  return (
    <div>
      <h2>User</h2>
      <p>Welcome to our website!</p>
      <button onClick={onSignOut}>Sign Out</button>
    </div>
  );
  }
  export default User;