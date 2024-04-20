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
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h6" component="div">
            My Material-UI Website
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
export default Admin;
