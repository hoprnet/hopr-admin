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
  flex-direction: column;
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

    .links {
      display: flex;
      justify-content: center;
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
  width: calc(100% - 32px);
  max-width: 1098px;
  margin: auto;
  display: flex;
  padding: 16px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Newsletter = styled.div`
  width: calc(100% - 32px);
  max-width: 1098px;
  margin: auto;
  display: flex;
  padding: 0 16px;
  justify-content: space-between;
  flex-wrap: wrap;
  color: black;
  flex-direction: column;
  margin-bottom: 3rem;
  margin-top: 5rem;

  .substack-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .title {
    font-size: 28px;
    position: relative;
    top: 40px;
  }
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
    name: 'Terms of Service',
    link: '/tos',
  },
  {
    name: 'Privacy Policy',
    link: '/privacy-notice',
  },
];

const socials = [
  {
    network: 'twitter',
    img: '/assets/social-networks/twitter.svg',
    link: 'https://twitter.com/hoprnet',
  },
  {
    network: 'telegram',
    img: '/assets/social-networks/telegram.svg',
    link: 'https://t.me/hoprnet',
  },
  {
    network: 'linkedin',
    img: '/assets/social-networks/linkedin.svg',
    link: 'https://www.linkedin.com/company/hoprnet',
  },
  {
    network: 'github',
    img: '/assets/social-networks/github.svg',
    link: 'https://github.com/hoprnet',
  },
  {
    network: 'medium',
    img: '/assets/social-networks/medium.svg',
    link: 'https://medium.com/hoprnet',
  },
  {
    network: 'youtube',
    img: '/assets/social-networks/youtube.svg',
    link: 'https://www.youtube.com/channel/UC2DzUtC90LXdW7TfT3igasA',
  },
  {
    network: 'discord',
    img: '/assets/social-networks/discord.svg',
    link: 'https://discord.gg/dEAWC4G',
  },
];

const Footer = (props) => {
  return (
    <SFooter>
      {props.newsletter && (
        <Newsletter>
          <div
            className="substack-section"
            style={{ backgroundColor: 'white' }}
          >
            <h3 className="title">HOPR Newsletter</h3>
            <iframe
              title="substack"
              src="https://hopr.substack.com/embed"
              width={'100%'}
              style={{
                border: 'none',
                marginTop: 0,
                paddingTop: 0,
              }}
              loading="lazy"
            ></iframe>
          </div>
        </Newsletter>
      )}
      <Content>
        <LeftColumn className="left-column">
          <Logo className="logo">
            <img
              src="/assets/hopr_logo.svg"
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
                target="_blank"
                rel="noreferrer"
              >
                {x.name}
              </a>
            ))}
          </div>
        </div>
      </Content>

      <br />
    </SFooter>
  );
};

export default Footer;
