import { useAppDispatch } from '../../store';
import { Message } from '../../store/slices/node/initialState';
import { sendNotification } from './notifications';
import { observeData } from './observeData';

/**
 * Describes a message being watched for changes.
 * It includes the time it was created, how many times it's been repeated,
 * and the actual message object.
 */
export type WatcherMessage = {
  createdAt: number;
  amountOfTimesRepeated: number;
  message?: Message;
} | null;

/**
 * Sorts and returns the most recent message in an array of messages.
 *
 * @param newMessages The array of messages to process.
 */
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

/**
 * Checks if a new message is different from an old message.
 *
 * @param oldMessage The old message to compare.
 * @param newMessage The new message to compare.
 */
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

/**
 * Observes messages and triggers a notification when there's a new message.
 *
 * @param previousState The previous message.
 * @param messages An array of current messages.
 * @param updatePreviousData A function that updates the previous message with the current one.
 * @param dispatch The dispatch function returned by the useAppDispatch hook.
 */
export const observeMessages = ({
  previousState,
  messages,
  active,
  updatePreviousData,
  dispatch,
}: {
  previousState: WatcherMessage | null;
  messages: Message[];
  active: boolean;
  updatePreviousData: (currentData: WatcherMessage) => void;
  dispatch: ReturnType<typeof useAppDispatch>;
}) =>
  observeData<WatcherMessage>({
    active: active && !!getLatestMessage(messages),
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
