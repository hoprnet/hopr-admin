import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { Link } from 'react-router-dom';

// HOPR Components
import SmallActionButton from '../../future-hopr-lib-components/Button/SmallActionButton';

//Mui
import CopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';

interface Props {
    peerId?: string;
    nodeAddress?: string;
}

const PeersInfo: React.FC<Props> = (props) => {
    const { peerId, nodeAddress, ...rest } = props;
    const aliases = useAppSelector((store) => store.node.aliases.data);
    const peerIdToAliasLink = useAppSelector((store) => store.node.links.peerIdToAlias);


    const getAliasByPeerId = (peerId: string): string => {
        if (aliases && peerId && peerIdToAliasLink[peerId]) return `${peerIdToAliasLink[peerId]} (${peerId})`;
        return peerId;
    };

    const noCopyPaste = !(
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
    );

    return (
        <div>
            <div>
                <span>{peerId}</span>                  <SmallActionButton
                    onClick={() => navigator.clipboard.writeText(peerId as string)}
                    disabled={noCopyPaste}
                    tooltip={noCopyPaste ? 'Clipboard not supported on HTTP' : 'Copy'}
                >
                    <CopyIcon />
                </SmallActionButton><br />
                <span>{nodeAddress}</span>                  <SmallActionButton
                    onClick={() => navigator.clipboard.writeText(nodeAddress as string)}
                    disabled={noCopyPaste}
                    tooltip={noCopyPaste ? 'Clipboard not supported on HTTP' : 'Copy'}
                >
                    <CopyIcon />
                </SmallActionButton>
                <SmallActionButton tooltip={'Open in gnosisscan.io'}>
                    <Link
                        to={`https://gnosisscan.io/address/${nodeAddress}`}
                        target="_blank"
                    >
                        <LaunchIcon />
                    </Link>
                </SmallActionButton>
            </div>
        </div >

    );
}

export default PeersInfo;
