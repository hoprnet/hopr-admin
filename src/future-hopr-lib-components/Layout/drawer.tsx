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
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { ApplicationMapType } from '../../router';
import Details from '../../components/InfoBar/details';
import { rounder2 } from '../../utils/functions';

export const drawerWidth = 190;
export const minDrawerWidth = 46;

const StyledDrawer = styled(MuiDrawer)`
  .MuiDrawer-paper {
    box-sizing: border-box;
    padding-top: 54px;
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
        .MuiListItemText-root {
          text-decoration: underline 2px rgb(255, 255, 255);
        }
        background-color: rgba(255, 255, 255, 0.2);
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
  height: 42px;
  letter-spacing: 0.2px;
  font-size: 13px;
  user-select: none;
  color: #777;
  justify-content: center;
  .MuiListItemIcon-root {
    min-width: 34px;
    &.NavigationDrawerClosed{
      padding-left: 10px;
    }
  }

`;

const StyledListItemButton = styled(ListItemButton)`
  height: 38px;
  fill: rgba(0, 0, 0, 0.54);
  width: 100%;
  padding-right: 10px;
  padding-left: 12px;
  .MuiListItemIcon-root {
    min-width: 40px;
    svg {
      width: 22px;
      height: 22px;
    }
  }
  .MuiTypography-root {
    font-size: 12.5px;
    white-space: nowrap;
  }
  &.Mui-selected {
    color: #0000b4;
    fill: #0000b4;
    background-color: rgba(255, 255, 255, 0.45);
    .MuiListItemText-root {
      text-decoration: underline 2px #0000b4;
      text-underline-offset: 4px;
    }
    .MuiTypography-root {
      font-weight: bold;
    }
    .MuiSvgIcon-root,
    .MuiListItemIcon-root {
      color: #0000b4;
      fill: #0000b4;
    }
  }
` as typeof ListItemButton;

const SListItemIcon = styled(ListItemIcon)`
  &.GroupIcon {
    color: rgba(0, 0, 0, 0.2);
  }
`;

const Numbers = styled.div`
  font-size: 10px;
  background-color: #ddeaff;
  padding: 3px;
`;

type DrawerProps = {
  drawerItems: ApplicationMapType;
  drawerFunctionItems?: ApplicationMapType;
  drawerLoginState?: {
    node?: boolean;
    web3?: boolean;
    safe?: boolean;
  };
  drawerNumbers?: {
    [key: string]: number | string | undefined | null;
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
  drawerFunctionItems,
  drawerNumbers,
}: DrawerProps) => {
  const location = useLocation();
  const searchParams = location.search;
  const isMobile = !useMediaQuery('(min-width: 500px)');
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

  const preare = drawerFunctionItems ? drawerFunctionItems : [];
  const allItems = [...preare, ...drawerItems];

  return (
    <StyledDrawer
      variant={drawerVariant}
      open={openedNavigationDrawer}
      onClose={() => set_openedNavigationDrawer(false)}
      className={drawerType === 'blue' ? 'type-blue' : 'type-white'}
    >
      {allItems.map(
        (group) =>
          ((group.mobileOnly === true && isMobile) || !group.mobileOnly) && (
            <div key={group.groupName}>
              <Divider />
              <List
                subheader={
                  openedNavigationDrawer ? (
                    <StyledListSubheader className="StyledListSubheader">
                      <SListItemIcon className="SListItemIcon GroupIcon">{group.icon}</SListItemIcon>
                      {group.groupName}
                      </StyledListSubheader>
                  ) : (
                    <Tooltip
                      title={`Group: ${group.groupName.toLowerCase()}`}
                      placement="right"
                    >
                      <StyledListSubheader className="StyledListSubheader">
                        <SListItemIcon className={`SListItemIcon GroupIcon NavigationDrawerClosed`}>{group.icon}</SListItemIcon>
                      </StyledListSubheader>
                    </Tooltip>
                  )
                }
              >
                {group.items.map(
                  (item) =>
                    item.inDrawer !== false &&
                    ((item.mobileOnly === true && isMobile) || !item.mobileOnly) && (
                      <Tooltip
                        key={item.name}
                        title={!openedNavigationDrawer && item.name}
                        placement="right"
                      >
                        <StyledListItemButton
                          component={item.onClick ? 'button' : Link}
                          to={
                            item.path !== 'function'
                              ? item.path.includes('http')
                                ? item.path
                                : item.overwritePath
                                ? item.overwritePath
                                : `${group.path}/${item.path}${searchParams ?? ''}`
                              : undefined
                          }
                          target={item.path.includes('http') ? '_blank' : undefined}
                          rel={item.path.includes('http') ? 'noopener noreferrer' : undefined}
                          selected={location.pathname === `/${group.path}/${item.path}`}
                          disabled={
                            item.path.includes('http')
                              ? false
                              : (!item.element && !item.onClick) ||
                                (item.loginNeeded && !drawerLoginState?.[item.loginNeeded])
                          }
                          onClick={item.onClick ? item.onClick : handleButtonClick}
                          className="StyledListItemButton"
                        >
                          <SListItemIcon className="SListItemIcon">{item.icon}</SListItemIcon>
                          <ListItemText className="ListItemText">{item.name}</ListItemText>
                          {item.numberKey &&
                            drawerNumbers &&
                            openedNavigationDrawer &&
                            item.loginNeeded &&
                            drawerLoginState?.[item.loginNeeded] && (
                              <Numbers>{rounder2(drawerNumbers[item.numberKey])}</Numbers>
                            )}
                        </StyledListItemButton>
                      </Tooltip>
                    ),
                )}
              </List>
            </div>
          ),
      )}
      {drawerVariant === 'temporary' && <Details style={{ margin: '0 auto 16px' }} />}
    </StyledDrawer>
  );
};

export default Drawer;
