import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Drawer as MuiDrawer,
  Tooltip
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { ApplicationMapType } from '../../router';

const drawerWidth = 240;
const minDrawerWidth = 56;

const StyledDrawer = styled(MuiDrawer)`
  .MuiDrawer-paper {
    box-sizing: border-box;
    padding-top: 59px;
    transition: width 0.4s ease-out;
    overflow-x: hidden;
    background: #3c64a5;
    color: white;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    width: ${(props) => (props.open ? `${drawerWidth}px` : `${minDrawerWidth}px`)};

    ${(props) =>
    props.variant === 'temporary' &&
      css`
        width: ${drawerWidth}px;
      `}
  }
  hr {
    border-color: rgb(255 255 255 / 50%);
  }
`;

const StyledListSubheader = styled(ListSubheader)`
  align-items: center;
  color: white;
  display: flex;
  height: 64px;
  letter-spacing: 0.2px;
  user-select: none;
  background: #3c64a5;
`;

const StyledListItemButton = styled(ListItemButton)`
  height: 48px;
  color: white;
  .MuiSvgIcon-root {
    color: white;
  }
  svg {
    width: 24px;
    height: 24px;
  }
  &.Mui-selected {
    color: #0000b4;
    text-decoration: underline;
    background-color: rgba(255, 255, 255, 0.45);
    .MuiTypography-root {
      font-weight: bold;
    }
    .MuiSvgIcon-root {
      color: #0000b4;
    }
    .MuiListItemIcon-root {
      color: #0000b4;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
` as typeof ListItemButton;

type DrawerProps = {
  drawerItems: ApplicationMapType;
  drawerLoginState?: {
    node?: boolean;
    web3?: boolean;
  };
  openedNavigationDrawer: boolean;
  set_openedNavigationDrawer: (openedNavigationDrawer: boolean) => void;
};

const Drawer = ({
  drawerItems,
  drawerLoginState,
  openedNavigationDrawer,
  set_openedNavigationDrawer,
}: DrawerProps) => {
  const location = useLocation();
  const searchParams = location.search;

  const [drawerVariant, set_drawerVariant] = useState<'permanent' | 'temporary'>('permanent');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        set_drawerVariant('temporary');
      } else {
        set_drawerVariant('permanent');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleButtonClick = () => {
    if (drawerVariant === 'temporary') {
      set_openedNavigationDrawer(false);
    }
  };

  return (
    <StyledDrawer
      variant={drawerVariant}
      open={openedNavigationDrawer}
      onClose={() => set_openedNavigationDrawer(false)}
    >
      {drawerItems.map((group) => (
        <div key={group.groupName}>
          <Divider />
          <List
            subheader={
              openedNavigationDrawer ? (
                <StyledListSubheader>{group.groupName}</StyledListSubheader>
              ) : (
                <Tooltip
                  title={`Group: ${group.groupName.toLowerCase()}`}
                  placement="right"
                >
                  <StyledListSubheader>
                    <ListItemIcon sx={{ color: '#ddd' }}>{group.icon}</ListItemIcon>
                  </StyledListSubheader>
                </Tooltip>
              )
            }
          >
            {group.items.map((item) => (
              <Tooltip
                key={item.name}
                title={!openedNavigationDrawer && item.name}
                placement="right"
              >
                <StyledListItemButton
                  component={Link}
                  to={`${group.path}/${item.path}${searchParams ?? ''}`}
                  selected={location.pathname === `/${group.path}/${item.path}`}
                  disabled={!item.element || (item.loginNeeded && !drawerLoginState?.[item.loginNeeded])}
                  onClick={handleButtonClick}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>{item.name}</ListItemText>
                </StyledListItemButton>
              </Tooltip>
            ))}
          </List>
        </div>
      ))}
    </StyledDrawer>
  );
};

export default Drawer;
