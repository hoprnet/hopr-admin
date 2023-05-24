import React from 'react';
import styled from '@emotion/styled';
import NavButton from './navButton';

const Content = styled.div`
  gap: 5px;
  &.menu-right {
    margin-right: 8px;
  }
  &.menu-mobile {
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: center;
  }
`;

const NavBarItems = (props) => {
  const poz = props.center
    ? 'center'
    : props.right
    ? 'right'
    : props.mobile
    ? 'mobile'
    : 'poz-undefined';



  return (
    <Content className={['menu', `menu-${poz}`].join(' ')}>
      { props.itemsNavbar[0]?.label && props.itemsNavbar.map((item, i) => (
        <NavButton
          key={`itemsNavbar-${poz}-${i}`}
          id={`itemsNavbar-${poz}-${i}`}
          path={item.path}
          subMenu={item.subMenu}
          label={item.name}
          background={item.background}
          onButtonClick={props.onButtonClick}
        >
          {item.name}
        </NavButton>
      ))}
      { props.itemsNavbar }
    </Content>
  );
};

export default NavBarItems;

NavBarItems.defaultProps = {
  itemsNavbar: [],
};