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
import Section from '../future-hopr-lib-components/Section';
import { SendMessageModal } from '../components/Modal/SendMessageModal';

const StyledTable = styled(Table)`
  td {
    overflow-wrap: anywhere;
  }
  th {
    font-weight: 600;
  }
`;
const messages = () => {
  const {
    messages,
    aliases,
  } = useAppSelector((selector) => selector.node);
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((selector) => selector.auth.loginData);
  const dispatch = useAppDispatch();

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

  return (
    <Section
      yellow
      fullHeightMin
    >
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
