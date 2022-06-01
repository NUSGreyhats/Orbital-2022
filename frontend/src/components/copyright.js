import Typography from "@mui/material/Typography";

export function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <a
        color="inherit"
        href="https://nusgreyhats.org"
        noreferrer="true"
        rel="noreferrer"
        target="_blank"
      >
        NUS Greyhats Orbital Workshop
      </a>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
