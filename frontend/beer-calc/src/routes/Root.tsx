import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "../App.css";
import { Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";


function Root() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(username);
    console.log(password);
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      const token = response.data.token;
      // Store token in localStorage or cookies
      console.log("Logged in successfully. Token:", token);
    } catch (error) {
      console.error("Login failed:", error);
    }
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
            <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)}/>
            <div style={{ marginBottom: "20px" }} />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div style={{ marginBottom: "20px" }} />
            <Button variant="contained" onClick={handleSubmit}>Login</Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

export default Root;
