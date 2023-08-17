import { useEffect } from 'react';
import styled from '@emotion/styled';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { nodeActions } from '../../store/slices/node';
import { actionsAsync } from '../../store/slices/node/actionsAsync';

// Mui
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'

// HOPR components
import Section from '../../future-hopr-lib-components/Section';
import Tooltip from '../../future-hopr-lib-components/Tooltip/tooltip-fixed-width';
import { SendMessageModal } from '../../components/Modal/SendMessageModal';
import { SubpageTitle } from '../../components/SubpageTitle';

const StyledTable = styled(Table)`
  td {
    overflow-wrap: anywhere;
  }
  th {
    font-weight: 600;
  }
`;
const messages = () => {
  const messages = useAppSelector((store) => store.node.messages);
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((store) => store.auth.loginData);
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
      fullHeightMin
      yellow
    >
      <SubpageTitle
        title={`MESSAGES`}
        actions={
          <>
            <SendMessageModal />
          </>
        }
      />
      <Paper
        style={{
          padding: '24px',
          width: 'calc( 100% - 48px )',
        }}
      >
        <TableContainer component={Paper}>
          <StyledTable
            sx={{ minWidth: 650 }}
            aria-label="aliases table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Actions</TableCell>
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
                      <Tooltip
                        title={date}
                        notWide
                      >
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
      </Paper>
    </Section>
  );
};

export default messages;
