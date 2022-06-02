import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Copyright } from "../components/copyright";
import { report_bug } from "../api/api";

const theme = createTheme();

export default function ReportBug() {
  const [hasReported, setHasReported] = React.useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    report_bug(data.get("bug"))
      .then((resp) => {
        document.getElementById("result").innerHTML =
          (resp.data.message ?? resp.data.error) + "Response: " + resp.data.output;
      })
      .catch((_) => {
        document.getElementById("result").innerHTML = "Network Error, please check the logs";
      });
    setHasReported(true);
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
            Bug reporting
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
              name="bug"
              label="Bug Report"
              type="text"
              id="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={hasReported}
            >
              Report
            </Button>
          </Box>
        </Box>

        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
