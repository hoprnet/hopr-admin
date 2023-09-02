import styled from '@emotion/styled';
import Section from '../future-hopr-lib-components/Section';

const StyledContainer = styled.div`
  align-items: center;
  text-align: justify;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  max-width: 1080px;
  padding: 2rem;
`;

const BigTitle = styled.h2`
  color: #414141;
  font-size: 80px;
  font-weight: 400;
  margin-block: 0rem;
  text-transform: uppercase;
  padding-top: 2rem;
`;

const Title = styled.h2`
  color: #414141;
  font-size: 60px;
  font-weight: 400;
  margin-block: 0rem;
  text-transform: uppercase;
  text-align: center;

  width: 100%;
  /* padding-top: 2rem; */
`;

const Description = styled.p`
  color: #414141;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  max-width: 74ch;
  a {
    color: #007bff; /* Set the desired color for links */
    text-decoration: underline;
  }
`;

const TermsOfService = () => {
  return (
    <Section
      center
      fullHeightMin
    >
      <StyledContainer>
        <BigTitle>Terms of Service</BigTitle>
        <br /> <br />
        <Title>Who we are</Title>
        <Description>
          We are HOPR Services Ltd., Bleicherweg 33, 8002 Zürich, Switzerland, and we operate the website{' '}
          <a
            href="https://hub.hoprnet.org/"
            target="_blank"
            rel="noreferrer"
          >
            https://hub.hoprnet.org/
          </a>
        </Description>
        <Title>Understanding our Terms of Service</Title>
        <Description>
          These terms of service (" Website Terms of Service / Terms of Service ") set out the legal terms and
          conditions on which we allow you to access our website. By accessing, browsing or otherwise using our website,
          you accept these Terms of Service without limitation or qualification. If you do not accept these Terms of
          Service, you are not entitled to access or use the website, and you should leave the website immediately.
          <br />
          <br />
          When we refer to "we", "us", or "our", we mean HOPR Services Ltd. When we refer to "you" or "your", we mean
          you, the person accessing or using our website.
        </Description>
        <Title>Our Website</Title>
        <Description>
          Our website is made available free of charge. We do not guarantee that our website, or any content, will
          always be available or uninterrupted. Access to our Website is permitted on a temporary basis. We may suspend,
          withdraw, discontinue or change all or any part of our website without notice. We will not be liable to you
          if, for any reason, our website is unavailable at any time or for any period. We may update the website and/or
          change its content at any time.
          <br />
          <br />
          You are responsible for making all arrangements necessary for you to have access to our website. You are also
          responsible for ensuring that all persons who access our website through your internet connection are aware of
          these Terms of Service and that they comply with them.
          <br />
          <br />
          We do not guarantee that the website or any content on it will be free from errors or omissions. We use
          reasonable efforts to include only accurate and up-to-date information on the website. However, we make no
          representations, warranties or guarantees concerning such information, whether express or implied.
          <br />
          <br />
          The website and the content on it are provided for general information purposes only. They are not intended to
          amount to advice on which you should rely. You must obtain professional or specialist advice before taking or
          refraining from any action based on the content on our website.
        </Description>
        <Title>Intellectual Property Rights</Title>
        <Description>
          We are the owner or licensee of all intellectual property rights in the website and its entire content. This
          includes, in particular but without limitation, page headers, texts, graphics, logos, images, digital
          downloads and the selection and arrangement of the same. You agree not to take any action(s) inconsistent with
          such ownership interests.
        </Description>
        <Title>Limitation of Liability</Title>
        <Description>
          Our liability is excluded to the maximum extent permitted by law. In particular, but without limitation, we
          are not liable for
          <ul>
            <li>Indirect or consequential damages, such as loss of profits, savings or claims by third parties</li>
            <li>Acts or omissions of our auxiliary persons and subcontractors.</li>
            <li>Simple negligence.</li>
          </ul>
          Furthermore, the website is made available “as is,” and we exclude all conditions, liabilities, warranties,
          representations or other terms that may apply to our website or any content on it, whether express or implied.
          <br />
          <br />
          We also will not be liable to any user for any loss or damage, whether in contract, tort, breach of statutory
          duty, or otherwise, even if foreseeable, arising under or in connection with:
          <ul>
            <li>Use of, or inability to use, our website or</li>
            <li>Use of or reliance on any content displayed on our website.</li>
          </ul>
          We will not be liable for any loss or damage caused by a virus, distributed denial-of-service attack, or other
          technologically harmful material that May infect your computer equipment, computer programs, data or other
          proprietary material due to your use of our website or to your downloading of any content on it, or on any
          website linked to it.
          <br />
          <br />
          Our website may contain third-party content or links to third-party websites or applications for your
          convenience only. You understand that your use of any third-party website or application is subject to any
          terms of service and/or privacy notices provided by such third party. We assume no responsibility for
          third-party content or links to third-party websites or applications to which we link from our website. Such
          links should not be interpreted as endorsement by us of those linked websites or applications. We will not be
          liable for any loss or damage that May arise from your use of them.
          <br />
          <br />
          The exclusion of liability under these terms of service shall not apply if the damage is caused willfully or
          by our gross negligence or unless we should be liable otherwise pursuant to mandatory legal provisions such as
          product liability. Moreover, the exclusion of liability does not apply to damage from injury to life, body or
          health (Personal injuries).
        </Description>
        <Title>Privacy</Title>
        <Description>
          Please see our Privacy Policy to understand how we collect and use your personal data.
        </Description>
        <Title>Governing Law and Jurisdiction</Title>
        <Description>
          These Terms of Service are governed by and construed in accordance with the substantive laws of Switzerland
          (without regard to conflicts of laws principles). The application of the United Nations Convention on
          Contracts for the International Sale of Goods shall be excluded.
          <br />
          <br />
          All disputes arising out of or in connection with these Terms of Service shall be exclusively submitted to the
          competent courts of the city of Zurich, Switzerland.
        </Description>
      </StyledContainer>
    </Section>
  );
};

export default TermsOfService;
