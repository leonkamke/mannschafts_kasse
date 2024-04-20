import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "../App.css";
import { Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";

interface JWTPayload {
  id: number;
  username: string;
  role: string;
}

function Root() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [usernameStr, setUsername] = useState("");
  const [passwordStr, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = (e: any) => {
    e.preventDefault();
    const formData = {
      username: usernameStr,
      password: passwordStr,
    };
    axios
      .post("http://localhost:3000/api/login", formData)
      .then((res) => {
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
            setErrorMessage("");
            const decodedToken: JWTPayload = jwtDecode(res.data.token);
            if (decodedToken.role === "admin") {
              // Route to Admin page
              console.log("Admin");
              navigate("/Admin", { replace: false });
            } else if (decodedToken.role! === "basic") {
              // Route to basic User page
              console.log("User");
              navigate("/User", { replace: false });
            }
          } else {
            //Throw error
          }
        } else {
        }
      })
      .catch((error) => {
        // console.log("Error occurred:", error);
        setErrorMessage("An error occurred. Please try again.");
      });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "transparent",
        }}
      >
        <Card
          sx={{
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "20px",
            paddingBottom: "30px",
            backgroundColor: "#101418",
            borderRadius: 3,
          }}
        >
          <CardContent>
            <h1 style={{ color: "#ffffff" }}>Mannschaftskasse</h1>
            <div style={{ marginBottom: "35px" }} />
            <Stack>
              <TextField
                label="Username"
                variant="outlined"
                value={usernameStr}
                onChange={(e) => setUsername(e.target.value)}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
                sx={{
                  backgroundColor: "#252e38",
                  borderRadius: "6px", // Set your desired border radius here
                }}
              />
              <div style={{ marginBottom: "20px" }} />
              <TextField
                label="Password"
                type="password"
                autoComplete="current-password"
                value={passwordStr}
                onChange={(e) => setPassword(e.target.value)}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
                sx={{
                  backgroundColor: "#252e38",
                  borderRadius: "6px", // Set your desired border radius here
                }}
              />
              <div style={{ marginBottom: "20px" }} />
              <Button variant="contained" onClick={onSubmit}>
                Login
              </Button>
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </Stack>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Root;
