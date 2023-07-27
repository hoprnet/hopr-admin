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

type LoadGraphProps = {
  nodes: Node[];
};

type OpenChannelsMapProps = {
  nodes: Node[];
};

const LoadGraph = ({ nodes }: LoadGraphProps) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();

    nodes.forEach((node) => {
      graph.addNode(node.id, node);
    });

    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

const OpenChannelsMap = ({ nodes }: OpenChannelsMapProps) => {
  return (
    <SigmaContainer
      style={{
        marginTop: '2rem',
        height: '600px',
        width: '100%',
      }}
    >
      <LoadGraph nodes={nodes} />
    </SigmaContainer>
  );
};

export default OpenChannelsMap;
