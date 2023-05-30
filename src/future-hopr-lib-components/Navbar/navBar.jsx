import React, { useEffect, useState } from 'react';
//import { useRouter } from 'next/router';
import styled from '@emotion/styled';

//import Sections from '../Sections';
//import LaunchPlaygroundBtn from '../../future-hopr-lib-components/Button/LaunchPlayground';
import MuiAppBar from '@mui/material/AppBar';
import NavBarItems from './navBarItems';

const AppBar = styled(({ tallerNavBarOnMobile, ...rest }) => (
  <MuiAppBar {...rest} />
))`
  background: white;
  height: 60px;
  border-bottom: 1px lightgray solid;
  box-shadow: unset;
  padding-left: 16px;
  padding-right: 16px;

  ${(props) =>
    props.tallerNavBarOnMobile &&
    `
    @media screen and (max-width: 520px) {
    //  height: 100px;
      position: static;
    }
  `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 1098px;
  width: 100%;
  margin: auto;
  position: relative;
  .menu {
    display: flex;
    flex-direction: row;
  }
`;

const Logo = styled.div`
  width: 92px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    img {
      flex-shrink: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

const NavBar = (props) => {
  //  const router = useRouter();
  const [activaMenu, setActivaMenu] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  //const showCoinbase = router.pathname === '/' || router.pathname === '/token';

  const onScrollNavBar = function () {
    if (window.pageYOffset === 0) {
      setIsScroll(false);
    } else {
      setIsScroll(true);
      setActivaMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScrollNavBar);
    return () => window.removeEventListener('scroll', onScrollNavBar);
  }, [isScroll]);

  return (
    <>
      <AppBar
        className="Hopr-navBar navbar"
        tallerNavBarOnMobile={props.tallerNavBarOnMobile}
      >
        <Container>
          <Logo className="logo-hopr">
            <a href="/">
              <img
                className="logo-hopr-navbar"
                alt={props.mainLogoAlt}
                src={props.mainLogo}
              />
            </a>
          </Logo>
          <div
            onClick={() => setActivaMenu(!activaMenu)}
            className={'icon-menu' + (activaMenu ? ' open' : '')}
          >
            <span></span>
          </div>
          <NavBarItems
            itemsNavbar={props.itemsNavbarCenter}
            center
          />
          <NavBarItems
            itemsNavbar={props.itemsNavbarRight}
            right
          />
        </Container>
      </AppBar>
      <div className={`menu mobile ${activaMenu ? ' show-menu' : ''}`}>
        <NavBarItems
          //     itemsNavbar={[...props.itemsNavbarCenter, ...props.itemsNavbarRight]}
          onButtonClick={() => {
            setActivaMenu(false);
          }}
          mobile
        />
      </div>
    </>
  );
};

NavBar.defaultProps = {
  itemsNavbarCenter: [],
  itemsNavbarRight: [],
};

export default NavBar;
