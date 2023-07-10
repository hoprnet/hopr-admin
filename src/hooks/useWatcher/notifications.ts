import { ToastOptions, toast } from 'react-toastify';
import { appActions } from '../../store/slices/app';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch } from '../../store';

export const sendNotification = ({
  notificationPayload,
  toastPayload,
  dispatch,
}: {
  // notification payload without id
  notificationPayload: Omit<Parameters<typeof appActions.addNotification>[0], 'id'>;
  toastPayload?: { message: string; type?: ToastOptions['type'] };
  dispatch: ReturnType<typeof useAppDispatch>;
}) => {
  const notificationId = nanoid();
  if (toastPayload) {
    toast(toastPayload.message, {
      type: toastPayload.type,
      // when a user presses cancel button it is not considered as an interaction
      onClick: () => dispatch(appActions.interactedWithNotification(notificationId)),
    });
  }

  dispatch(
    appActions.addNotification({
      ...notificationPayload,
      id: notificationId,
    }),
  );
};
