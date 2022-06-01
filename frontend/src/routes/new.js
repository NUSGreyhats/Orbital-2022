import React from "react";
import { Navigate } from "react-router-dom";
import {
  Container,
  ThemeProvider,
  createTheme,
  TextField,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  CssBaseline,
  Typography,
} from "@mui/material";

const theme = createTheme();

export default function NewNote() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // Process login information here
    console.log({
      title: data.get("title"),
      body: data.get("body"),
      private: data.get("private") !== null ,
    });
    <Navigate to="/" />;
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Create a new note
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Title" name="title" />
            <br />
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="Multiline"
              multiline
              name="body"
            />
            <br />
            <FormControlLabel
              control={<Checkbox value="private" color="primary" />}
              label="Private"
              name="private"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
