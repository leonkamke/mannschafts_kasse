import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "../App.css";
import { Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Link, useNavigate } from 'react-router-dom';


function Root() {

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
            <TextField label="Username" />
            <div style={{ marginBottom: "20px" }} />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
            />
            <Link to="admin">Admin</Link>
            <div style={{ marginBottom: "20px" }} />
            <Button variant="contained">Login</Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

export default Root;
