import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Chip
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 01rem;
  max-width: 15rem;
  padding: 1rem;
  margin-top: 0.5rem;

  &.blue {
    background-color: #daf8ff;
  }
  &.pink {
    background-color: #ffe7e7;
  }
`;

const StyledChip = styled(Chip)`
  align-self: flex-start;
  font-weight: 700;
  min-width: 7rem;
  text-transform: uppercase;

  &.blue {
    background-color: #0000b2;
    color: #fff;
  }
  &.pink {
    background-color: #ffafa3;
    color: #414141;
  }
`;

const StyledAccordion = styled(Accordion)`
  box-shadow: none;
  border: none;
  margin: 0;

  &::before {
    display: none;
  }

  &.Mui-expanded {
    margin: 0;
  }
`;

const AccordionTitle = styled(AccordionSummary)`
  border-bottom: 2px solid #414141;
  height: 7rem;
  padding: 0;

  &.Mui-expanded {
    min-height: 7rem;
  }

  &.blue {
    background-color: #daf8ff;
  }
  &.pink {
    background-color: #ffe7e7;
  }
`;
const Title = styled.h3`
  color: #414141;
  font-weight: 700;
  margin: 0;
`;
const AccordionContent = styled(AccordionDetails)`
  margin: 0;
  padding: 0.75rem 0;

  &.blue {
    background-color: #daf8ff;
  }
  &.pink {
    background-color: #ffe7e7;
  }
`;
const Content = styled.div`
  color: #414141;
`;

type FaqProps = {
  variant: 'blue' | 'pink';
  label: string;
  data: {
    id: number;
    title: string;
    content: string | JSX.Element;
  }[];
};

export default function FAQ({
  variant,
  label,
  data,
}: FaqProps) {
  const [expandedId, set_expandedId] = useState<number | false>(false);

  const handleAccordionClick = (id: number) => {
    set_expandedId((prevId) => {
      return prevId === id ? false : id;
    });
  };

  return (
    <StyledCard className={`Faq ${variant}`}>
      <StyledChip
        className={`Chip ${variant}`}
        label={label}
      />
      {data.map((faqItem) => (
        <StyledAccordion
          key={faqItem.id}
          expanded={expandedId === faqItem.id}
          onChange={() => handleAccordionClick(faqItem.id)}
        >
          <AccordionTitle
            className={`Title ${variant}`}
            expandIcon={<ExpandMoreIcon />}
          >
            <Title>{faqItem.title}</Title>
          </AccordionTitle>
          <AccordionContent className={`Content ${variant}`}>
            <Content>{faqItem.content}</Content>
          </AccordionContent>
        </StyledAccordion>
      ))}
    </StyledCard>
  );
}
