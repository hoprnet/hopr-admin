// Packages
import React from 'react';
import styled from '@emotion/styled'

// Components
import NavBar from '../Navbar/navBar.jsx'
import Footer from './footer.jsx';
import { PropaneSharp } from '@mui/icons-material';
import HoprLogo from './logo.svg'

const SLayout = styled.div`
`

const Content = styled.div<any>`
  margin-top: 60px;
  ${props => props.tallerNavBarOnMobile &&  `
    @media screen and (max-width: 520px) {
        margin-top: 0px;
    }
  `}
`

const Layout: React.FC<{
    className?: string,
    itemsNavbarRight?: any, 
    tallerNavBarOnMobile?:boolean
    children?:any
}> = ({ 
    className = '', 
    children, 
    itemsNavbarRight, 
    tallerNavBarOnMobile
}) => {
    return (
        <SLayout className="Layout">
            <NavBar
                mainLogo={HoprLogo}
                mainLogoAlt="hopr logo"
                itemsNavbarRight={itemsNavbarRight}
                tallerNavBarOnMobile={tallerNavBarOnMobile}
            />
            <Content 
                className="Content"
         //       tallerNavBarOnMobile={tallerNavBarOnMobile}
            >
                {children}
            </Content>
            {/* <Footer /> */}
        </SLayout>
    );
};

export default Layout;