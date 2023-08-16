import { useEffect } from 'react';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { nodeActions } from '../../store/slices/node';
import { actionsAsync } from '../../store/slices/node/actionsAsync';

// HOPR components
import Section from '../../future-hopr-lib-components/Section';
import { SendMessageModal } from '../../components/Modal/SendMessageModal';
import { SubpageTitle } from '../../components/SubpageTitle';
import TablePro from '../../future-hopr-lib-components/Table/table-pro';

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

  const header = [
    {
      key: 'body',
      name: 'Message',
    },
    {
      key: 'actions',
      name: 'Actions',
      search: false,
      width: '168px',
      maxWidth: '168px',
    },
  ];

  const parsedTableData = messages.map((message) => {
    return {
      body: message.body,
      actions: (
        <>
          <button onClick={() => dispatch(nodeActions.toggleMessageSeen(message))}>
            Mark as {message.seen ? 'unseen' : 'seen'}
          </button>
        </>
      ),
    };
  });

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
      <TablePro
        data={parsedTableData}
        header={header}
      />
    </Section>
  );
};

export default messages;
