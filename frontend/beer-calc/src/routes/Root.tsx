import "../App.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import { sha3_256 } from "js-sha3";
import { Button, Input } from "antd";

interface JWTPayload {
  id: number;
  username: string;
  role: string;
}

const serverIP = "192.168.178.131"; //"192.168.178.160"

function Root() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [usernameStr, setUsername] = useState("");
  const [passwordStr, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(" ");

  const onSubmit = (e: any) => {
    e.preventDefault();
    const formData = {
      username: usernameStr,
      password: passwordStr,
    };
    axios
      .post("http://" + serverIP + ":3000/api/login", formData)
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
            setErrorMessage(" ");
            const decodedToken: JWTPayload = jwtDecode(res.data.token);
            if (decodedToken.role === "admin") {
              // Route to Admin page
              navigate("/Admin", { replace: false });
            } else if (decodedToken.role === "basic") {
              // Route to basic User page
              navigate("/Spieler", { replace: false });
            } else if (decodedToken.role === "moderator") {
              navigate("/Moderator", { replace: false });
            }
          } else {
            //Throw error
          }
        } else {
        }
      })
      .catch((error) => {
        // console.log("Error occurred:", error);
        setErrorMessage("Du hast verkackt, du Idiot!");
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
          //   backgroundSize: "cover",
          //  backgroundPosition: "center",
        }}
      >
        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "0px",
            paddingBottom: "30px",
            backgroundColor: "#141414",
            borderRadius: 10,
            width: "400px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h1 style={{ color: "white" }}>SG Alftal</h1>
          <div style={{ marginBottom: "15px" }} />
          <div>
            <Input
              placeholder="Username"
              size="large"
              onChange={(e) => setUsername(e.target.value)}
              onPressEnter={onSubmit}
            />
            <div style={{ marginBottom: "20px" }} />
            <Input.Password
              placeholder="Password"
              size="large"
              onChange={(e) => {
                setPassword(sha3_256(e.target.value));
              }}
              onPressEnter={onSubmit}
            />
            <div style={{ marginBottom: "20px" }} />

            <Button
              style={{
                color: "white",
                width: "170px",
                alignSelf: "center",
              }}
              onClick={onSubmit}
            >
              Login
            </Button>
            {errorMessage && <p style={{ color: "#ff6669" }}>{errorMessage}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Root;
