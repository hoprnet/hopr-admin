import '@react-sigma/core/lib/react-sigma.min.css';
import { useEffect } from 'react';
import Graph from 'graphology';
import { SigmaContainer, useLoadGraph } from '@react-sigma/core';

type Node = {
  id: string;
  label: string;
  image: string;
  cluster: string;
  tag: string;
  color: string;
  size: number;
  x: number;
  y: number;
};

type Channels = {
  incoming: {
    type: 'incoming' | 'outgoing';
    status: 'WaitingForCommitment' | 'Open' | 'PendingToClose' | 'Closed';
    channelId: string;
    peerId: string;
    balance: string;
  }[];
  outgoing: {
    type: 'incoming' | 'outgoing';
    status: 'WaitingForCommitment' | 'Open' | 'PendingToClose' | 'Closed';
    channelId: string;
    peerId: string;
    balance: string;
  }[];
};

type LoadGraphProps = {
  nodes: Node[];
  channels: Channels;
};

type OpenChannelsMapProps = {
  nodes: Node[];
  channels: Channels;
};

const LoadGraph = ({
  nodes,
  channels,
}: LoadGraphProps) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();

    nodes.forEach((node) => {
      graph.addNode(node.id, node);
    });

    // channels.incoming.forEach((channel) => {
    //   graph.addEdge(userNode.id, channel.peerId, {
    //     size: 1,
    //     weight: 1,
    //   });
    // });

    // channels.outgoing.forEach((channel) => {
    //   graph.addEdge(userNode.id, channel.peerId, {
    //     size: 1,
    //     weight: 1,
    //   });
    // });

    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

const OpenChannelsMap = ({
  nodes,
  channels,
}: OpenChannelsMapProps) => {
  console.log('@  channels:', channels);
  console.log('@  nodes:', nodes);
  return (
    <SigmaContainer
      style={{
        marginTop: '2rem',
        height: '600px',
        width: '100%',
      }}
    >
      <LoadGraph
        nodes={nodes}
        channels={channels}
      />
    </SigmaContainer>
  );
};

export default OpenChannelsMap;
