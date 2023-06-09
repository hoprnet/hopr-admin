import { useEffect, useRef } from 'react';
import md5 from 'md5';
// @ts-ignore
import jazzicon from '@metamask/jazzicon';

type JazziconProps = {
  address: string;
  diameter: number;
};

const Jazzicon = ({ address, diameter }: JazziconProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = jazzicon(diameter, md5(address));
    containerRef.current?.appendChild(icon);
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} />;
};

export default Jazzicon;
