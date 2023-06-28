/// <reference types="vite-plugin-svgr/client" />
// Packages
import React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

// Components
import NavBar from '../Navbar/navBar';
import Footer from './footer';
import Drawer from './drawer';
import { PropaneSharp } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';

const SLayout = styled.div``;

const Content = styled.div<any>`
  margin-top: 60px;
  ${(props) =>
    props.tallerNavBarOnMobile &&
    `
    @media screen and (max-width: 520px) {
        margin-top: 0px;
    }
  `}
  ${(props) =>
    props.drawer &&
    `
    @media screen and (min-width: 600px) {
        margin-left: 240px;
    }
  `}
  ${(props) =>
    props.drawerRight &&
    `
      @media screen and (min-width: 600px) {
          margin-right: 161px;
      }
    `}
`;

const Layout: React.FC<{
  className?: string;
  itemsNavbarRight?: any;
  tallerNavBarOnMobile?: boolean;
  children?: any;
  drawer?: boolean;
  webapp?: boolean;
  drawerLoginState?: {};
  drawerItems?: {}[];
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
  return (
    <SLayout className="Layout">
      <NavBar
        mainLogo="/logo.svg"
        mainLogoAlt="hopr logo"
        itemsNavbarRight={itemsNavbarRight}
        tallerNavBarOnMobile={tallerNavBarOnMobile}
        webapp={webapp}
      />
      {drawer && (
        <Drawer
          drawerItems={drawerItems}
          drawerLoginState={drawerLoginState}
        />
      )}
      <Content
        className="Content"
        drawer={!!drawer}
        drawerRight={!!drawerRight}
        //       tallerNavBarOnMobile={tallerNavBarOnMobile}
      >
        <Outlet />
        {/* {children}  */}
      </Content>
      {drawerRight}
      {/* <Footer /> */}
    </SLayout>
  );
};

export default Layout;
