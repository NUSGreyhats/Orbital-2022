import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate } from "react-router";
import { Copyright } from "../components/copyright";
import { Link } from "react-router-dom";
import { register } from "../api/api";

const theme = createTheme();

export default function Signup() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // Process login information here
    const username = data.get("username");
    const password = data.get("password");
    const passwordcfm = data.get("passwordcfm");
    const remember = data.get("remember");

    if (username.length === 0) {
      alert("Username is required");
      return;
    }

    if (password.length === 0) {
      alert("Password is required");
      return;
    }

    if (password !== passwordcfm) {
      alert("Password and Confirm Password do not match.");
      return;
    }
    if (remember !== "agree") {
      alert("Please agree to the terms and condition.");
      return;
    }

    register(username, password).then((resp) => {
      document.getElementById("result").innerHTML =
        resp.data.message ?? resp.data.error;
      if (!resp.data.error) {
        document.location.href = "/login";
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Typography id="result" component="h1" variant="h6" />
          <br />
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordcfm"
              label="Confirm Password"
              type="password"
              id="passwordcfm"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={
                <Checkbox name="remember" value="agree" color="primary" />
              }
              label="I agree to the terms and conditions"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/login" variant="body2">
                  {"Have an account? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
