import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

// Store
import { useAppDispatch, useAppSelector } from '../store';
import { nodeActions } from '../store/slices/node';
import { actionsAsync } from '../store/slices/node/actionsAsync';

// mui
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material'

// HOPR components
// import Checkbox from '../future-hopr-lib-components/Toggles/Checkbox';
import Section from '../future-hopr-lib-components/Section';
import { SendMessageModal } from '../components/SendMessageModal';

// const PathOrHops = styled.div`
//   display: flex;
//   flex-direction: row;
//   gap: 8px;
//   align-items: center;
// `;

// const StatusContainer = styled.div`
//   height: 32px;
// `;

const StyledTable = styled(Table)`
  td {
    overflow-wrap: anywhere;
  }
  th {
    font-weight: 600;
  }
`;

// const nonAutomaticPathTooltip = 'Disable `automatic path` to enable `Number of hops`';

const messages = () => {
  const {
    messages, aliases, 
  } = useAppSelector((selector) => selector.node);
  const {
    apiEndpoint, apiToken, 
  } = useAppSelector((selector) => selector.auth.loginData);
  const dispatch = useAppDispatch();

  // const [message, set_message] = useState<string>('');
  // const [numberOfHops, set_numberOfHops] = useState<number | ''>('');
  // const [path, set_path] = useState<string>('');
  // const [automaticPath, set_automaticPath] = useState<boolean>(true);
  // const [sendMode, set_sendMode] = useState<'path' | 'automaticPath' | 'numberOfHops'>('automaticPath');
  // const [receiver, set_receiver] = useState<string>('');
  // const [loader, set_loader] = useState<boolean>(false);
  // const [status, set_status] = useState<string>('');

  // const maxLength = 500;
  // const remainingChars = maxLength - message.length;

  // useEffect(() => {
  //   switch (sendMode) {
  //   case 'path':
  //     set_automaticPath(false);
  //     set_numberOfHops('');
  //     break;
  //   case 'numberOfHops':
  //     set_automaticPath(false);
  //     set_path('');
  //     break;
  //   default: //'automaticPath'
  //     set_numberOfHops('');
  //     set_path('');
  //   }
  // }, [sendMode, path, automaticPath, numberOfHops]);

  useEffect(() => {
    if (apiEndpoint && apiToken) {
      dispatch(
        actionsAsync.getAliasesThunk({
          apiEndpoint,
          apiToken,
        }),
      );
    }
  }, []);

  // const isAlias = (alias: string) => {
  //   if (aliases) {
  //     return !!aliases[alias];
  //   } else return false;
  // };

  // const validatePeerId = (receiver: string) => {
  //   if (isAlias(receiver)) {
  //     if (aliases) {
  //       return aliases[receiver];
  //     } else return receiver;
  //   } else return receiver;
  // };

  // const handleSendMessage = async (event: MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  //   if (!(apiEndpoint && apiToken)) return;
  //   set_status('');
  //   set_loader(true);
  //   const validatedReceiver = validatePeerId(receiver);

  //   const messagePayload: SendMessagePayloadType = {
  //     apiToken,
  //     apiEndpoint,
  //     body: message,
  //     recipient: validatedReceiver,
  //   };
  //   if (numberOfHops !== '') {
  //     messagePayload.hops = numberOfHops;
  //   } else if (path !== '') {
  //     const pathElements = path.replace(/(\r\n|\n|\r| )/gm, '').split(',');
  //     const validatedPath = pathElements.map((element) => validatePeerId(element));
  //     messagePayload.path = validatedPath;
  //   }

  //   let response;
  //   try {
  //     response = await dispatch(actionsAsync.sendMessageThunk(messagePayload)).unwrap();

  //     console.log('@message response:', response);
  //     if (typeof response === 'string') set_status('Message sent');
  //   } catch (err: any) {
  //     console.log('@message err:', err);
  //     set_status(err.error);
  //   }
  //   set_loader(false);
  // };

  // const handlePath = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   set_sendMode('path');
  //   set_path(event.target.value);
  // };

  // const handleNumberOfHops = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   set_sendMode('numberOfHops');
  //   set_numberOfHops(
  //     parseInt(event.target.value) || parseInt(event.target.value) === 0 ? parseInt(event.target.value) : '',
  //   );
  // };

  // const handleAutomaticPath = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   set_sendMode('automaticPath');
  //   set_automaticPath(event.target.checked);
  // };

  return (
    <Section yellow>
      <h2>Send Message</h2>
      <SendMessageModal />
      <h2>Messages</h2>
      <TableContainer component={Paper}>
        <StyledTable
          sx={{ minWidth: 650 }}
          aria-label="aliases table"
        >
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>message</TableCell>
              <TableCell>actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message, index) => {
              const date = new Date(message.createdAt).toString();
              return (
                <TableRow
                  key={message.id}
                  className={`message-${message.seen ? 'unseen' : 'seen'}`}
                >
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    {index}
                  </TableCell>
                  <TableCell style={{ overflowWrap: 'anywhere' }}>
                    <Tooltip title={date}>
                      <span>{message.body}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => dispatch(nodeActions.toggleMessageSeen(message))}>
                      Mark as {message.seen ? 'unseen' : 'seen'}
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Section>
  );
};

export default messages;
