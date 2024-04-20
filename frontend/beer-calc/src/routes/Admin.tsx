import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

function Admin() {
  const navigate = useNavigate();
  const signOut = useSignOut();

  const onSignOut = () => {
    signOut();
    navigate("/", { replace: true });
  };
  return (
    <>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Typography variant="h6" component="div">
            Admin
          </Typography>
          <Button variant="contained" onClick={onSignOut}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}
export default Admin;
