import styled from '@emotion/styled';
import CodeCopyBox from './CodeCopyBox';

const SCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
  // text-transform: uppercase;
  code {
    font-size: 12px!important;
    line-height: 16px;
  }
`;

const codeHTML = (moduleAddress?: string | null, safeAddress?: string | null) => { return (
  <>
    {`docker run --pull always -d --restart always -m 3g --platform linux/x86_64 --log-driver json-file --log-opt max-size=100M --log-opt max-file=5 -ti -v $HOME/.hoprd-db-dufour:/app/hoprd-db -p 9091:9091/tcp -p 9091:9091/udp -p 8080:8080 -p 3001:3001 -e DEBUG="hopr*" europe-west3-docker.pkg.dev/hoprassociation/docker-images/hoprd:stable --network dufour --init --api --identity /app/hoprd-db/.hopr-id-dufour --data /app/hoprd-db --password 'open-sesame-iTwnsPNg0hpagP+o6T0KOwiH9RQ0' --apiHost "0.0.0.0" --apiToken '`}
    <span style={{color: '#00fc00'}}>YOUR_SECURITY_TOKEN</span>
    {`' --healthCheck --healthCheckHost "0.0.0.0" --announce --safeAddress ${safeAddress} --moduleAddress ${moduleAddress} --host `}
    <span style={{color: '#00fc00'}}>{`YOUR_PUBLIC_IP`}</span>{`:9091 --provider `}
    <span style={{color: '#00fc00'}}>CUSTOM_RPC_PROVIDER</span>
  </>
)}

const code = (moduleAddress?: string | null, safeAddress?: string | null) => { return `docker run --pull always -d --restart always -m 3g --platform linux/x86_64 --log-driver json-file --log-opt max-size=100M --log-opt max-file=5 -ti -v $HOME/.hoprd-db-dufour:/app/hoprd-db -p 9091:9091/tcp -p 9091:9091/udp -p 8080:8080 -p 3001:3001 -e DEBUG="hopr*" europe-west3-docker.pkg.dev/hoprassociation/docker-images/hoprd:stable --network dufour --init --api --identity /app/hoprd-db/.hopr-id-dufour --data /app/hoprd-db --password 'open-sesame-iTwnsPNg0hpagP+o6T0KOwiH9RQ0' --apiHost "0.0.0.0" --apiToken 'YOUR_SECURITY_TOKEN' --healthCheck --healthCheckHost "0.0.0.0" --announce --safeAddress ${safeAddress} --moduleAddress ${moduleAddress} --host YOUR_PUBLIC_IP:9091 --provider CUSTOM_RPC_PROVIDER`}


export const CodeContainer = (props: {moduleAddress?: string | null, safeAddress?: string | null}) => {
  return(
    <SCodeContainer>
      <span>INSTALL AND RUN HOPRd</span>
      <CodeCopyBox
        code={<>{codeHTML(props.moduleAddress,props.safeAddress)}</>}
        copy={code(props.moduleAddress,props.safeAddress)}
      />
    </SCodeContainer>
  )
}
