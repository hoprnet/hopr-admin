import React from 'react';
import styled from '@emotion/styled';
import NavButton from './navButton';

const Content = styled.div`
  gap: 5px;
  align-items: center;
  &.menu-right:not(.menu-webpapp) {
    margin-right: 8px;
  }
  &.menu-mobile {
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: center;
  }
`;

const NavBarItems: React.FC<{
  className?: string;
  center?: boolean;
  webapp?: boolean;
  right?: boolean;
  mobile?: boolean;
  itemsNavbar?: any[];
  onButtonClick?: any;
}> = (props) => {
  const poz = props.center
    ? 'center'
    : props.right
    ? 'right'
    : props.mobile
    ? 'mobile'
    : 'poz-undefined';

  return (
    <Content className={['menu', `menu-${poz}`, props.webapp ? 'menu-webpapp' : ''].join(' ')}>
      {/*  @ts-ignore */}
      {props?.itemsNavbar[0]?.label &&
        props.itemsNavbar.map((item, i) => (
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
      {props.itemsNavbar}
    </Content>
  );
};

export default NavBarItems;

NavBarItems.defaultProps = {
  itemsNavbar: [],
};
