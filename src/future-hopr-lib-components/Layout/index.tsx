/// <reference types="vite-plugin-svgr/client" />
// Packages
import React, { ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

// Components
import NavBar from '../Navbar/navBar';
import Footer from './footer';
import Drawer from './drawer';

// Types
import { ApplicationMapType } from '../../router';
import { useAppSelector } from '../../store';

const SLayout = styled.div`
  &.webapp {
    .Section.full-height-min {
      min-height: calc(100vh - 60px - 80px + 40px);
    }
  }
`;

type ContentType = {
  openedNavigationDrawer: boolean;
  tallerNavBarOnMobile?: boolean;
  drawerRight: boolean;
};

const Content = styled.div<ContentType>`
  margin-top: 60px;
  margin-left: 0;

  transition: margin-left 0.4s ease-out;
  @media (min-width: 499.1px) {
    margin-left: ${(props) => (props.openedNavigationDrawer ? '240px' : '56px')};
  }

  ${(props) =>
    props.tallerNavBarOnMobile &&
    css`
      @media screen and (max-width: 520px) {
        margin-top: 0px;
      }
    `}

  ${(props) =>
    props.drawerRight &&
    css`
      @media screen and (min-width: 740px) {
        margin-right: 233px;
      }
    `}
`;

const Layout: React.FC<{
  className?: string;
  itemsNavbarRight?: any;
  tallerNavBarOnMobile?: boolean;
  children?: ReactNode;
  drawer?: boolean;
  webapp?: boolean;
  drawerLoginState?: {
    node?: boolean;
    web3?: boolean;
  };
  drawerItems: ApplicationMapType;
  drawerRight?: React.ReactNode;
}> = ({
  className = '',
  children,
  itemsNavbarRight,
  tallerNavBarOnMobile,
  drawer,
  drawerItems,
  webapp,
  drawerLoginState,
  drawerRight,
}) => {
  // Determine if the device is a mobile device based on the screen width
  const isMobile = useMediaQuery('(max-width: 500px)');
  const account = useAppSelector((selector) => selector.web3.account);
  const isConnected = useAppSelector((selector) => selector.auth.status.connected);

  // Set the initial state of the drawer based on the device type
  // If it's a mobile device, set the drawer to be closed by default
  const [openedNavigationDrawer, set_openedNavigationDrawer] = useState(!isMobile);

  return (
    <SLayout className={`Layout${webapp ? ' webapp' : ''}`}>
      <NavBar
        mainLogo="/logo.svg"
        mainLogoAlt="hopr logo"
        itemsNavbarRight={itemsNavbarRight}
        tallerNavBarOnMobile={tallerNavBarOnMobile}
        webapp={webapp}
        set_openedNavigationDrawer={set_openedNavigationDrawer}
        openedNavigationDrawer={openedNavigationDrawer}
      />
      {drawer && (
        <Drawer
          drawerItems={drawerItems}
          drawerLoginState={drawerLoginState}
          set_openedNavigationDrawer={set_openedNavigationDrawer}
          openedNavigationDrawer={openedNavigationDrawer}
        />
      )}
      <Content
        className={`Content ${drawerRight ? 'drawerRight' : ''}`}
        openedNavigationDrawer={openedNavigationDrawer}
        drawerRight={!!drawerRight}
      >
        {' '}
        <div>
          <Outlet />
        </div>
        {/* {children} */}
      </Content>
      {drawerRight}
      {/* <Footer /> */}
    </SLayout>
  );
};

export default Layout;
