import { useEffect } from 'react';
import Graph from 'graphology';
import { SigmaContainer, useLoadGraph } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';

const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    graph.addNode('first', {
      x: 0,
      y: 0,
      size: 15,
      label: 'My first node',
      color: '#FA4F40',
    });
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

const OpenChannelsMap = () => {
  return (
    <SigmaContainer
      style={{
        marginTop: '2rem',
        height: '600px',
        width: '100%',
      }}
    >
      <LoadGraph />
    </SigmaContainer>
  );
};

export default OpenChannelsMap;
