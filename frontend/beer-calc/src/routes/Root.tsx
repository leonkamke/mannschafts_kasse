import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "../App.css";
import { Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";

interface JWTPayload {
  id: number,
  username: string,
  role: string,
}

function Root() {
  const signIn = useSignIn();  
  const [usernameStr, setUsername] = useState("");
  const [passwordStr, setPassword] = useState("");

  const onSubmit = (e: any) => {
    e.preventDefault();
    const formData = {
      username: usernameStr,
      password: passwordStr,
    };
    axios.post("http://localhost:3000/api/login", formData).then((res) => {
      if (res.status === 200) {
        if (
          signIn({
            auth: {
              token: res.data.token,
              type: "Bearer",
            },
            refresh: res.data.refreshToken,
            userState: res.data.authUserState,
          })
        ) {
          // Only if you are using refreshToken feature
          // Redirect or do-something
          console.log("Login successfull");
          const decodedToken: JWTPayload  = jwtDecode(res.data.token);
          if (decodedToken.role === 'admin') {
            // Route to Admin page
            console.log("Admin");
          } else if (decodedToken.role! === 'basic') {
            // Route to basic User page
            console.log("User");
          }
        } else {
          //Throw error
        }
      }
    });
  };

  return (
    <>
      <Card
        sx={{
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "10px",
          paddingBottom: "20px",
          backgroundColor: "#dedede",
        }}
      >
        <CardContent>
          <h1 style={{ color: "#101418" }}>Beer Calculator!</h1>
          <Stack>
            <TextField
              label="Username"
              value={usernameStr}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div style={{ marginBottom: "20px" }} />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              value={passwordStr}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div style={{ marginBottom: "20px" }} />
            <Button variant="contained" onClick={onSubmit}>
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

export default Root;
