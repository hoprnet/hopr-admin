import styled from '@emotion/styled';
import { css } from '@emotion/react';
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ApplicationMapType } from '../../router';

const drawerWidth = 240;
const minDrawerWidth = 56;

const StyledDrawer = styled(MuiDrawer)`
  .MuiDrawer-paper {
    box-sizing: border-box;
    padding-top: 59px;
    transition: width 0.4s ease-out;
    overflow: hidden;
    width: ${(props) => (props.open ? `${drawerWidth}px` : `${minDrawerWidth}px`)};

    ${(props) =>
    props.variant === 'temporary' &&
      css`
        width: ${drawerWidth}px;
      `}
  }
`;

const StyledListSubheader = styled(ListSubheader)`
  align-items: center;
  color: #777;
  display: flex;
  height: 64px;
  letter-spacing: 0.2px;
  user-select: none;
`;

type DrawerProps = {
  drawerItems: ApplicationMapType;
  drawerLoginState?: {
    node: boolean;
    web3: boolean;
  };
  openNavigationDrawer: boolean;
  set_openNavigationDrawer: (openNavigationDrawer: boolean) => void;
};

const Drawer = ({
  drawerItems,
  drawerLoginState,
  openNavigationDrawer,
  set_openNavigationDrawer,
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
      set_openNavigationDrawer(false);
    }
  };

  return (
    <StyledDrawer
      variant={drawerVariant}
      open={openNavigationDrawer}
      onClose={() => set_openNavigationDrawer(false)}
    >
      {drawerItems.map((group) => (
        <div key={group.groupName}>
          <Divider />
          <List
            subheader={
              openNavigationDrawer ? (
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
                title={!openNavigationDrawer && item.name}
                placement="right"
              >
                <ListItemButton
                  component={Link}
                  to={`${group.path}/${item.path}${searchParams ?? ''}`}
                  selected={location.pathname === `/${group.path}/${item.path}`}
                  disabled={item.loginNeeded && !drawerLoginState?.[item.loginNeeded]}
                  onClick={handleButtonClick}
                  sx={{
                    height: 48,
                    '&.Mui-selected': {
                      color: '#0000B4',
                      '& .MuiTypography-root': { fontWeight: 'bold' },
                      '& .MuiListItemIcon-root': { color: '#0000B4' },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>{item.name}</ListItemText>
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </div>
      ))}
    </StyledDrawer>
  );
};

export default Drawer;
