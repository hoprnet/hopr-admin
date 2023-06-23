/// <reference types="vite-plugin-svgr/client" />
// Packages
import React, { ReactNode, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

// Components
import NavBar from '../Navbar/navBar';
import Footer from './footer';
import Drawer from '../Drawer';

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
  const [openDrawer, set_openDrawer] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        set_openDrawer(false);
      } else {
        if (!openDrawer) return;
        set_openDrawer(true);
      }
    };

    handleResize(); // Set initial state on component mount
    window.addEventListener('resize', handleResize); // Add event listener to handle window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener on component unmount
    };
  }, []);

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
