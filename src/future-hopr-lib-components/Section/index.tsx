import styled from '@emotion/styled';

const SSection = styled.section`
  overflow: hidden;
  &.section--gradient {
    --section-background: linear-gradient(
      180deg,
      #0000b4 -110.52%,
      hsla(0, 0%, 85%, 0) 60.89%
    );
  }
  &.section--yellow {
    --section-background: #ffffa0;
  }
  &.section--dark-gray {
    --section-background: #414141;
    color: #fff;
  }
  &.section--light-blue-gradient {
    --section-background: linear-gradient(
      180deg,
      #1ad1ff -110.52%,
      hsla(0, 0%, 85%, 0) 105%
    );
  }
  &.section--light-blue {
    --section-background: #7ee5ff;
  }
  &.section--dark-gradient {
    --section-background: linear-gradient(180deg, #000050 0.5%, #0000b4 100%);
  }
  &.section--gray {
    --section-background: #eeeeee;
  }
  &.section--light-gray {
    --section-background: #e3e5e7;
  }
  &.section--disabled {
    filter: opacity(0.35);
    pointer-events: none;
  }

  background: var(--section-background);

  &.full-height-min {
    min-height: calc(100vh - 68px - 170px);
    @media (max-width: 850px) {
      min-height: calc(100vh - 68px - 294px);
    }
  }
  &.full-height {
    min-height: calc(100vh - 60px);
    @media (max-width: 768px) {
      min-height: -webkit-fill-available;
    }
  }
  &.center {
    display: grid;
    place-items: center;
  }
  padding-bottom: 40px;
  padding-top: 40px;
`;

const Content = styled.div`
  max-width: 1098px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 16px;
  padding-right: 16px;
  &.content--center {
    align-items: center;
  }
`;

interface SectionProps {
  className?: string;
  gradient?: boolean;
  yellow?: boolean;
  darkGradient?: boolean;
  lightBlueGradient?: boolean;
  lightBlue?: boolean;
  gray?: boolean;
  darkGray?: boolean;
  lightGray?: boolean;
  fullHeightMin?: boolean;
  fullHeight?: boolean;
  center?: boolean;
  disabled?: boolean;
  id?: string;
  children?: any;
}

const Section: React.FC<SectionProps> = (props) => {
  return (
    <SSection
      className={[
        `Section`,
        props.className && props.className,
        props.gradient && 'section--gradient',
        props.yellow && 'section--yellow',
        props.darkGradient && 'section--dark-gradient',
        props.lightBlueGradient && 'section--light-blue-gradient',
        props.lightBlue && 'section--light-blue',
        props.gray && 'section--gray',
        props.darkGray && 'section--dark-gray',
        props.lightGray && 'section--light-gray',
        props.fullHeightMin && 'full-height-min',
        props.fullHeight && 'full-height',
        props.center && 'center',
        props.disabled && 'section--disabled',
      ].join(' ')}
      id={props.id}
    >
      <Content
        className={[`Content`, props.center && 'content--center'].join(' ')}
      >
        {props.children}
      </Content>
    </SSection>
  );
};

export default Section;
