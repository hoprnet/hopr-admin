import React from 'react';
import NextHead from 'next/head'
import { seasonNumber } from '../../config';

const Head = () => {
  return (
    <NextHead>
      <title>{`HOPR | Staking Season ${seasonNumber}`}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href="https://hoprnet.org/" />
      <meta name="theme-color" content="#ffffa0" />
      <meta
        name="description"
        content="The HOPR protocol ensures everyone has control of their privacy and data."
      />
      <meta charSet="utf-8" />
      <meta name="keywords" content="crypto, data privacy, network-level" />
      <meta name="author" content="HOPR | Michał Jadach" />
      <meta name="copyright" content="HOPR" />
      {/*<meta name="robots" content="index,nofollow" />*/}
      <meta httpEquiv="cache-control" content="no-cache" />
      <meta httpEquiv="expires" content="43200" />
      {/* <script src="https://cdn.usefathom.com/script.js" data-site="" defer></script> */}
    </NextHead>
  );
};

export default Head;


