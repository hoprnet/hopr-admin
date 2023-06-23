import styled from '@emotion/styled';
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

const drawerWidth = 240;

const StyledDrawer = styled(MuiDrawer)`
  .MuiDrawer-paper {
    box-sizing: border-box;
    padding-top: 59px;
    transition: width 0.4s ease;
    width: ${(props) => (props.open ? `${drawerWidth}px` : '56px')};
  }
`;

type DrawerProps = {
  drawerItems: {
    groupName: string;
    path: string;
    items: {
      name: string;
      path: string;
      icon: JSX.Element;
      element?: JSX.Element;
      loginNeeded?: 'node' | 'web3';
    }[];
  }[];
  drawerLoginState?: {
    node: boolean;
    web3: boolean;
  };
  openDrawer: boolean;
  set_openDrawer: (openDrawer: boolean) => void;
};

const Drawer = ({
  drawerItems,
  drawerLoginState,
  openDrawer,
  set_openDrawer,
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

    handleResize(); // Set initial state on component mount
    window.addEventListener('resize', handleResize); // Add event listener to handle window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener on component unmount
    };
  }, []);

  return (
    <StyledDrawer
      variant={drawerVariant}
      open={openDrawer}
      onClose={() => set_openDrawer(!openDrawer)}
    >
      {drawerItems.map((group) => (
        <>
          <Divider />
          <List
            key={group.groupName}
            subheader={openDrawer && <ListSubheader>{group.groupName}</ListSubheader>}
            disablePadding
          >
            {group.items.map((item) => (
              <Tooltip
                key={item.name}
                title={!openDrawer && item.name}
                placement="right-end"
              >
                <ListItemButton
                  component={Link}
                  to={`${group.path}/${item.path}${searchParams ?? ''}`}
                  selected={location.pathname === `/${group.path}/${item.path}`}
                  disabled={item.loginNeeded && !drawerLoginState?.[item.loginNeeded]}
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
                  {openDrawer && <ListItemText>{item.name}</ListItemText>}
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </>
      ))}
    </StyledDrawer>
  );
};

export default Drawer;
