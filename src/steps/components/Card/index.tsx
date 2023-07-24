import { Description, Image, ImageContainer, StyledCard, Title } from './styled';

type CardProps = {
  image?: {
    src: string;
    alt?: string;
    height?: number;
    width?: number;
  };
  title?: string;
  description?: string;
  descriptionLeft?: boolean;
  children?: JSX.Element;
};

const Card = ({
  image,
  title,
  description,
  descriptionLeft,
  children,
}: CardProps) => {
  return (
    <StyledCard>
      {image && (
        <ImageContainer
          height={image.height}
          width={image.width}
        >
          <Image
            src={image.src}
            alt={image.alt}
          />
        </ImageContainer>
      )}
      {title && <Title>{title}</Title>}
      {description && <Description descriptionLeft={descriptionLeft}>{description}</Description>}
      {children}
    </StyledCard>
  );
};

export default Card;
