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
  TextField,
  IconButton,
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

const DomSeachBar = (props) => {
  const setSearchParams = props.searchSetter;
  const searchItem = props.searchItem;
  const htmlAttr = {
    __html:
      searchItem !== null && searchItem.length > 0
        ? `Your Search Term: ${searchItem}`
        : "Type to begin searching",
  };

  return (
    <div>
      <form>
        <TextField
          id="search-bar"
          className="text"
          onInput={(e) => {
            setSearchParams({ search: e.target.value });
          }}
          label="Enter your search term"
          variant="outlined"
          placeholder="Search..."
          size="small"
        />
        <IconButton type="submit" aria-label="search"></IconButton>
      </form>
      <div dangerouslySetInnerHTML={htmlAttr}></div>
    </div>
  );
};

const ViewAllNotes = async (searchParams, setSearchParams) => {
  const all_notes = await get_notes();

  if (all_notes.length === 0) {
    return <Typography variant="h3">No notes found.</Typography>;
  }
  const search_term = searchParams.get("search");
  var note_items = all_notes;

  if (search_term !== null && search_term.length > 0) {
    console.log("hit");
    note_items = all_notes.filter(
      (note) =>
        note.title.includes(search_term) || note.body.includes(search_term)
    );
  }

  return (
    <div>
      <Typography variant="h3">All notes</Typography>
      <DomSeachBar searchSetter={setSearchParams} searchItem={search_term} />
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {note_items.map(to_list_item)}
      </List>
    </div>
  );
};

const ViewOneNote = async (id) => {
  const note = await get_note_content(id);
  const body_elem = (
    <Typography variant="body" marginBottom={10}>
      <div dangerouslySetInnerHTML={{ __html: note.body }}></div>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const noteId = searchParams.get("id");

  useEffect(() => {
    if (noteId) {
      ViewOneNote(noteId).then(setContent);
    } else {
      ViewAllNotes(searchParams, setSearchParams).then(setContent);
    }
  }, [noteId, searchParams, setSearchParams]);

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
