/// <reference types="vite-plugin-svgr/client" />
// Packages
import React, { ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

// Components
import NavBar from '../Navbar/navBar';
import Footer from './footer';
import Drawer from '../Drawer';

// Types
import { ApplicationMapType } from '../../router';

const SLayout = styled.div``;

const Content = styled.div<{ openDrawer: boolean }>`
  margin-top: 60px;
  transition: margin 0.4s ease;
  margin-left: 0;
  @media (min-width: 499.1px) {
    margin-left: ${(props) => (props.openDrawer ? '240px' : '56px')};
  }
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
}> = ({
  className = '',
  children,
  itemsNavbarRight,
  tallerNavBarOnMobile,
  drawer,
  drawerItems,
  webapp,
  drawerLoginState,
}) => {
  // Determine if the device is a mobile device based on the screen width
  const isMobile = useMediaQuery('(max-width: 500px)');

  // Set the initial state of the drawer based on the device type
  // If it's a mobile device, set the drawer to be closed by default
  const [openDrawer, set_openDrawer] = useState(!isMobile);

  return (
    <SLayout className="Layout">
      <NavBar
        mainLogo="/logo.svg"
        mainLogoAlt="hopr logo"
        itemsNavbarRight={itemsNavbarRight}
        tallerNavBarOnMobile={tallerNavBarOnMobile}
        webapp={webapp}
        set_openDrawer={set_openDrawer}
        openDrawer={openDrawer}
      />

      {drawer && (
        <Drawer
          drawerItems={drawerItems}
          drawerLoginState={drawerLoginState}
          set_openDrawer={set_openDrawer}
          openDrawer={openDrawer}
        />
      )}
      <Content
        className="Content"
        openDrawer={openDrawer}
      >
        <Outlet />
        {/* {children} */}
      </Content>
      {/* <Footer /> */}
    </SLayout>
  );
};

export default Layout;
