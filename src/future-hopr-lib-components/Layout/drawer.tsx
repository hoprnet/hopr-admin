import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import { Link, LinkProps } from 'react-router-dom';
import { RouterProvider, BrowserRouter } from 'react-router-dom';
import styled from '@emotion/styled';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// Types
import { ApplicationMapType } from '../../router';

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  drawerItems?: any[];
  drawerLoginState?: {};
}

const AppBarFiller = styled(Toolbar)`
  min-height: 59px !important;
`;

interface SLinkProps extends LinkProps {
  disabled: boolean;
}

const SLink = styled(Link)<SLinkProps>`
  ${(props) =>
    props.disabled &&
    `
    pointer-events: none;
  `}
`;

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  // const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <AppBarFiller />
      <Divider />
      {props.drawerItems?.map((group, indexG) => {
        if (group.drawer === false) return;

        return (
          <List>
            {group.groupName}
            {group.items &&
              group.items.map((item: any, indexI: number) => {
                return (
                  <SLink
                    to={`${group.path}/${item.path}`}
                    key={indexI}
                    disabled={
                      !item.element ||
                      // @ts-ignore
                      (item.loginNeeded && props?.drawerLoginState[item.loginNeeded] === false )
                    }
                  >
                    <ListItem disablePadding>
                      <ListItemButton 
                        disabled={
                          !item.element ||
                          // @ts-ignore
                          (item.loginNeeded && props?.drawerLoginState[item.loginNeeded] === false )
                        }
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </ListItem>
                  </SLink>
                );
              })}
          </List>
        );
      })}
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
