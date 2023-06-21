import React from 'react';
import styled from '@emotion/styled';

const SFooter = styled.footer`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: linear-gradient(#000050, #0000b4);
  color: #fff;
  font-family: 'Source Code Pro';
  font-style: normal;
  font-size: 15px;
  text-align: left;
  min-height: 170px;
  @media (max-width: 850px) {
    min-height: 294px;
  }

  .right-column {
    .social-networks {
      align-items: center;
      display: flex;
      justify-content: center;
      padding: 10px 0;
      margin: 10px 0 30px;
    }

    .social-networks a {
      font-size: 0;
      line-height: 0;
      padding: 10px;
    }

    .social-networks a img {
      height: 22px;
      width: auto;
    }

    .links a {
      font-size: 13px;
      margin-right: 15px;
      color: #fff;
      text-decoration: none;
    }
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 1098px;
  margin: auto;
  display: flex;
  padding: 16px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const LeftColumn = styled.div`
  display: flex;
  gap: 32px;
`;

const Logo = styled.div`
  height: auto;
  width: 58px;
`;

const Addresses = styled.div`
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  address {
    text-align: left;
    font-style: normal;
  }
`;

const links = [
  {
    name: 'CONTACT',
    link: 'mailto:contact@hoprnet.org',
  },
  {
    name: 'ABOUT US',
    link: 'https://hoprnet.org/about-us/mission',
  },
  {
    name: 'PARTNERS',
    link: 'https://hoprnet.org/about-us/partners',
  },
  {
    name: 'DISCLAIMER',
    link: 'https://hoprnet.org/disclaimer',
  },
];

const socials = [
  {
    network: 'twitter',
    img: '/assets/icons/social-networks/twitter.svg',
    link: 'https://twitter.com/hoprnet',
  },
  {
    network: 'telegram',
    img: '/assets/icons/social-networks/telegram.svg',
    link: 'https://t.me/hoprnet',
  },
  {
    network: 'linkedin',
    img: '/assets/icons/social-networks/linkedin.svg',
    link: 'https://www.linkedin.com/company/hoprnet',
  },
  {
    network: 'github',
    img: '/assets/icons/social-networks/github.svg',
    link: 'https://github.com/hoprnet',
  },
  {
    network: 'medium',
    img: '/assets/icons/social-networks/medium.svg',
    link: 'https://medium.com/hoprnet',
  },
  {
    network: 'youtube',
    img: '/assets/icons/social-networks/youtube.svg',
    link: 'https://www.youtube.com/channel/UC2DzUtC90LXdW7TfT3igasA',
  },
  {
    network: 'discord',
    img: '/assets/icons/social-networks/discord.svg',
    link: 'https://discord.gg/dEAWC4G',
  },
];

const Footer = () => {
  return (
    <SFooter>
      <Content>
        <LeftColumn className="left-column">
          <Logo className="logo">
            <img
              src="/hopr_token-icon.svg"
              alt="HOPR Logo"
            />
          </Logo>
          <div className="content">
            <Addresses>
              <address>
                HOPR
                <br />
                Bleicherweg 33
                <br />
                8002 Zürich
                <br />
                Switzerland
              </address>
              <address>
                HOPR Tech Pte. Ltd.
                <br />
                68 Circular Road, #02-01,
                <br />
                049422 Singapore
                <br />
                Singapore
              </address>
            </Addresses>
            <div>© HOPR Association, all rights reserved</div>
          </div>
        </LeftColumn>
        <div className="right-column">
          <div className="social-networks">
            {socials?.map((x, i) => (
              <a
                key={i}
                href={x.link}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={x.img}
                  alt={x.network}
                />
              </a>
            ))}
          </div>
          <div className="links">
            {links?.map((x, i) => (
              <a
                key={i}
                title={x.name}
                href={x.link}
              >
                {x.name}
              </a>
            ))}
          </div>
        </div>
      </Content>
    </SFooter>
  );
};

export default Footer;
