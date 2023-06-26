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
import Drawer from '../Drawer';

// Types
import { ApplicationMapType } from '../../router';

const SLayout = styled.div``;

type ContentType = {
  openNavigationDrawer: boolean;
  tallerNavBarOnMobile?: boolean;
  drawerRight: boolean;
};

const Content = styled.div<ContentType>`
  margin-top: 60px;
  transition: margin 0.4s ease;
  margin-left: 0;
  @media (min-width: 499.1px) {
    margin-left: ${(props) => (props.openNavigationDrawer ? '240px' : '56px')};
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
      @media screen and (min-width: 600px) {
        margin-right: 161px;
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
    node: boolean;
    web3: boolean;
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

  // Set the initial state of the drawer based on the device type
  // If it's a mobile device, set the drawer to be closed by default
  const [openNavigationDrawer, set_openNavigationDrawer] = useState(!isMobile);

  return (
    <SLayout className="Layout">
      <NavBar
        mainLogo="/logo.svg"
        mainLogoAlt="hopr logo"
        itemsNavbarRight={itemsNavbarRight}
        tallerNavBarOnMobile={tallerNavBarOnMobile}
        webapp={webapp}
        set_openNavigationDrawer={set_openNavigationDrawer}
        openNavigationDrawer={openNavigationDrawer}
      />

      {drawer && (
        <Drawer
          drawerItems={drawerItems}
          drawerLoginState={drawerLoginState}
          set_openNavigationDrawer={set_openNavigationDrawer}
          openNavigationDrawer={openNavigationDrawer}
        />
      )}
      <Content
        className="Content"
        openNavigationDrawer={openNavigationDrawer}
        drawerRight={!!drawerRight}
      >
        <Outlet />
        {/* {children} */}
      </Content>
      {drawerRight}
      {/* <Footer /> */}
    </SLayout>
  );
};

export default Layout;
