import {
  Button,
  Chip,
  Container,
  Icon,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import {
  MessagesDocument,
  useCreateMessageMutation,
  useMessagesQuery,
  useRemoveMessageMutation,
} from "../generated/graphql";
import { MdDeleteForever } from "react-icons/md";

const Message = (props: {
  content?: string;
  createdAt?: string;
  id: string;
}) => {
  const [removeMessage] = useRemoveMessageMutation({
    refetchQueries: [MessagesDocument],
  });

  return (
    <Paper sx={{ p: 1 }}>
      <Stack direction="row" alignItems="center" width="100%">
        <Typography variant="h5" flexGrow={1}>
          {props.content}
        </Typography>
        <Icon
          onClick={() =>
            removeMessage({
              variables: {
                id: props.id,
              },
            })
          }
          color="error"
          sx={{ cursor: "pointer", justifySelf: "end" }}
        >
          <MdDeleteForever />
        </Icon>
      </Stack>
      <Chip
        label={moment(Number(props.createdAt)).fromNow()}
        sx={{ alignSelf: "end" }}
      />
    </Paper>
  );
};

export const MessagesPages = () => {
  const { loading, data } = useMessagesQuery();
  const [sendMessage] = useCreateMessageMutation({
    refetchQueries: [MessagesDocument],
  });

  const [textMessage, setTextMessage] = useState("");

  return (
    <Container>
      <Stack gap={2}>
        <Stack gap={2} direction="row" width="100%">
          <TextField
            id="outlined-basic"
            label="Message"
            variant="outlined"
            value={textMessage}
            fullWidth
            onChange={(event) => setTextMessage(event.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              sendMessage({
                variables: {
                  content: textMessage,
                },
              });
            }}
          >
            Send
          </Button>
        </Stack>
        <Stack gap={3}>
          {loading && Array(3).fill(<Skeleton animation="wave" />)}
          {data?.messages.map((message) => (
            <Message
              key={message?.id}
              content={message?.content}
              createdAt={message?.createdAt}
              id={message?.id ?? ""}
            />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};
