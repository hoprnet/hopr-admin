import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import {
  Divider,
  List,
  ListItemButton,
  ListItemButtonTypeMap,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Drawer as MuiDrawer,
  Tooltip
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { ApplicationMapType } from '../../router';
import Details from '../../components/InfoBar/details';

const drawerWidth = 240;
const minDrawerWidth = 56;


interface SListItemButtonTypeMap extends ListItemButtonTypeMap {
  rel?: string;
}

const StyledDrawer = styled(MuiDrawer)`
  .MuiDrawer-paper {
    box-sizing: border-box;
    padding-top: 59px;
    transition: width 0.4s ease-out;
    overflow-x: hidden;
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

  &.type-blue {
    .MuiDrawer-paper {
      background: #000050;
      color: white;
    }
    hr {
      border-color: rgb(255 255 255 / 50%);
    }
    .StyledListSubheader {
      background: #000050;
      color: white;
    }
    .StyledListItemButton {
      color: white;
      &.Mui-selected {
        text-decoration: underline 2px rgb(255, 255, 255);
        background-color: rgba(255, 255, 255, 0.20);
        .MuiSvgIcon-root {
          color: #b4f0ff;
          fill: #b4f0ff;
        }
        &:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      }
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
    .MuiSvgIcon-root {
      color: white;
      fill: white;
    }
  }
`;

const StyledListSubheader = styled(ListSubheader)`
  align-items: center;
  display: flex;
  height: 64px;
  letter-spacing: 0.2px;
  user-select: none;
  color: #777;
`;

const StyledListItemButton = styled(ListItemButton )`
  height: 48px;
  fill: rgba(0, 0, 0, 0.54);
  svg {
    width: 24px;
    height: 24px;
  }
  &.Mui-selected {
    color: #0000b4;
    fill: #0000b4;
    background-color: rgba(255, 255, 255, 0.45);
    text-decoration: underline 2px #0000b4;
    text-underline-offset: 4px;
    .MuiTypography-root {
      font-weight: bold;
    }
    .MuiSvgIcon-root,
    .MuiListItemIcon-root {
      color: #0000b4;
      fill: #0000b4;
    }
  }
`;

const SListItemIcon = styled(ListItemIcon)`
  &.GroupIcon {
    color: rgba(0, 0, 0, 0.2);
  }
`;

type DrawerProps = {
  drawerItems: ApplicationMapType;
  drawerLoginState?: {
    node?: boolean;
    web3?: boolean;
    safe?: boolean;
  };
  openedNavigationDrawer: boolean;
  drawerType?: 'blue' | 'white' | false;
  set_openedNavigationDrawer: (openedNavigationDrawer: boolean) => void;
};

const Drawer = ({
  drawerItems,
  drawerLoginState,
  openedNavigationDrawer,
  set_openedNavigationDrawer,
  drawerType,
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
      className={drawerType === 'blue' ? 'type-blue' : 'type-white'}
    >
      {drawerItems.map((group) => (
        <div key={group.groupName}>
          <Divider />
          <List
            subheader={
              openedNavigationDrawer ? (
                <StyledListSubheader className="StyledListSubheader">{group.groupName}</StyledListSubheader>
              ) : (
                <Tooltip
                  title={`Group: ${group.groupName.toLowerCase()}`}
                  placement="right"
                >
                  <StyledListSubheader className="StyledListSubheader">
                    <SListItemIcon className="SListItemIcon GroupIcon">{group.icon}</SListItemIcon>
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
                  to={item.path.includes('http') ? item.path : `${group.path}/${item.path}${searchParams ?? ''}`}
                  target={item.path.includes('http') ? "_blank" : null}
                  //@ts-ignore
                  rel={item.path.includes('http') ? "noopener noreferrer" : null}
                  selected={location.pathname === `/${group.path}/${item.path}`}
                  disabled={item.path.includes('http') ? false : (!item.element || (item.loginNeeded && !drawerLoginState?.[item.loginNeeded]))}
                  onClick={handleButtonClick}
                  className="StyledListItemButton"
                >
                  <SListItemIcon className="SListItemIcon">{item.icon}</SListItemIcon>
                  <ListItemText className="ListItemText">{item.name}</ListItemText>
                </StyledListItemButton>
              </Tooltip>
            ))}
          </List>
        </div>
      ))}
      {drawerVariant === 'temporary' && <Details style={{ margin: '0 auto 16px' }} />}
    </StyledDrawer>
  );
};

export default Drawer;
