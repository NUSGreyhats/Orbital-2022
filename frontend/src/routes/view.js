import {
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  ListItem,
  Avatar,
  ListItemText,
  List,
  ListItemAvatar,
  createTheme,
  Box,
  ListItemButton,
  Button,
  Divider,
} from "@mui/material";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { get_notes, get_note_content } from "../api/api";
import { Link } from "react-router-dom";

const theme = createTheme();

const to_list_item = (note) => {
  return (
    <ListItem alignItems="flex-start" key={note.id}>
      <ListItemAvatar>
        <Avatar alt={note.author} />
      </ListItemAvatar>
      <ListItemText primary={note.title} />
      <ListItemButton component={Link} to={`/view?id=${note.id}`}>
        View
      </ListItemButton>
    </ListItem>
  );
};

const ViewAllNotes = async () => {
  const all_notes = await get_notes();
  if (all_notes.length === 0) {
    return <Typography variant="h3">No notes found.</Typography>;
  }
  return (
    <div>
      <Typography variant="h3">All notes</Typography>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {all_notes.map(to_list_item)}
      </List>
    </div>
  );
};

const ViewOneNote = async (id) => {
  const note = await get_note_content(id);
  const body_elem = (
    <Typography variant="body" marginBottom={10}>
      <div dangerouslySetInnerHTML={{__html: note.body}}></div>
    </Typography>
  );
  return (
    <div>
      <Typography variant="h1" marginBottom={3}>
        {note.title}
      </Typography>
      {body_elem}
      <br />
      <Divider />
      <Button component={Link} to="/view">
        Back to all notes
      </Button>
    </div>
  );
};

export default function ViewNote() {
  const [content, setContent] = React.useState(
    <Typography>Loading</Typography>
  );
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get("id");

  useEffect(() => {
    if (noteId) {
      ViewOneNote(noteId).then(setContent);
    } else {
      ViewAllNotes().then(setContent);
    }
  }, [noteId]);

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
          {content}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
