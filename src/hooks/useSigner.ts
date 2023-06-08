import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

type Window = {
  ethereum: ethers.providers.ExternalProvider;
};

/**
 * React hook that gets signer from window.ethereum
 * @returns ethers signer
 */
export const useSigner = () => {
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function initializeSigner() {
      try {
        if (typeof (window as unknown as Window).ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(
            (window as unknown as Window).ethereum
          );
          const newSigner = provider.getSigner();
          setSigner(newSigner);
          setLoading(false);

          // Handle account change
          (window as any).ethereum.on('accountsChanged', async function () {
            const newSigner = provider.getSigner();
            setSigner(newSigner);
          });
        } else {
          setError('Please install MetaMask');
        }
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    initializeSigner();
  }, []);

  return { signer, loading, error };
};
