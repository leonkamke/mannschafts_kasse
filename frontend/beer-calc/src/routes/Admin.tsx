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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{width: 500}}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin Page
            </Typography>
            <Button color="inherit" onClick={onSignOut}>Sign Out</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div>
        <p>Welcome to our website!</p>
      </div>
    </>
  );
}
export default Admin;
