import { useAppDispatch } from '../../store';
import { Message } from '../../store/slices/node/initialState';
import { sendNotification } from './notifications';
import { observeData } from './observeData';

export type WatcherMessage = {
  createdAt: number;
  amountOfTimesRepeated: number;
  message?: Message;
} | null;

const getLatestMessage = (newMessages?: Message[]): WatcherMessage | undefined => {
  if (!newMessages?.length) return;

  const sortedMessages = [...newMessages].sort((a, b) => b.createdAt - a.createdAt);
  const latestMessage = sortedMessages?.[0];
  const latestTimestamp = latestMessage.createdAt ?? 0;
  const amountOfMessagesWithTimestamp = newMessages.filter((msg) => msg.createdAt === latestTimestamp)?.length;

  return {
    createdAt: latestTimestamp,
    amountOfTimesRepeated: amountOfMessagesWithTimestamp,
    message: latestMessage,
  };
};

const checkForNewMessage = (oldMessage: WatcherMessage, newMessage: NonNullable<WatcherMessage>) => {
  if (!oldMessage) return true;

  if (oldMessage.createdAt < newMessage.createdAt) {
    return true;
  }

  if (oldMessage.createdAt === newMessage.createdAt) {
    return oldMessage.amountOfTimesRepeated < newMessage.amountOfTimesRepeated;
  }

  return false;
};

export const observeMessages = ({
  previousState,
  messages,
  updatePreviousData,
  dispatch,
}: {
  previousState: WatcherMessage | null;
  messages: Message[];
  updatePreviousData: (currentData: WatcherMessage) => void;
  dispatch: ReturnType<typeof useAppDispatch>;
}) =>
  observeData<WatcherMessage>({
    disabled: !getLatestMessage(messages),
    previousData: previousState,
    fetcher: async () => getLatestMessage(messages),
    isDataDifferent: (newData) => checkForNewMessage(previousState, newData),
    notificationHandler: (newData) => {
      sendNotification({
        notificationPayload: {
          source: 'node',
          name: 'Received new message',
          url: 'networking/messages',
          timeout: null,
        },
        toastPayload: { message: `received message: ${newData.message?.body}` },
        dispatch,
      });
    },
    updatePreviousData,
  });
