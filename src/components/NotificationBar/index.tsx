import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';

// Mui
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { appActions } from '../../store/slices/app';

const Container = styled.div`
  height: 59px;
  width: 59px;
  border-left: 1px lightgray solid;
  border-right: 1px lightgray solid;
`;

const SBadge = styled(Badge)`
  width: 100%;
  height: 100%;
  .MuiBadge-badge {
    transform: scale(1) translate(-23%, 56%);
    background-color: #0000b4;
  }
`;

const SIconButton = styled(IconButton)`
  width: 100%;
  height: 100%;
  border-radius: 0;
  svg {
    width: 40px;
    height: 40px;
  }
`;

const SMenu = styled(Menu)``;

const SMenuItem = styled(MenuItem)``;

export default function NotificationBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notifications } = useAppSelector((state) => state.app);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (notification: (typeof notifications)[0]) => {
    setAnchorEl(null);
  };

  return (
    <Container>
      <SBadge
        id="notification-menu-button"
        badgeContent={
          notifications.filter((notification) => !notification.seen).length
        }
        color="secondary"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <SIconButton>
          <NotificationsNoneIcon />
        </SIconButton>
      </SBadge>
      <SMenu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'notification-menu-button',
        }}
      >
        {notifications.filter((notification) => !notification.seen).length ? (
          notifications
            .filter((notification) => !notification.seen)
            .map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => {
                  dispatch(appActions.seenNotification(notification));
                }}
              >
                {notification.name}
              </MenuItem>
            ))
        ) : (
          <MenuItem>No notifications</MenuItem>
        )}
      </SMenu>
    </Container>
  );
}
