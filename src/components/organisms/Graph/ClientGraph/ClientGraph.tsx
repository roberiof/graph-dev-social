'use client';

import { useGraphData } from '@/common/context/GraphData';
import { INode } from '@/common/interfaces/types';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import NodeOptionsModal from './components/NodeOptionsModal/NodeOptionsModal';
import { ClientGraphProps } from './types';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function ClientGraph({ initialData }: ClientGraphProps) {
  const { graphData, setGraphData } = useGraphData();
  const extraRenderers = [new CSS2DRenderer()];
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);

  useEffect(() => {
    if (graphData) return;
    setGraphData(initialData);
  }, [graphData, initialData, setGraphData]); 

  if (!graphData) return null;

  return (
    <>
      <ForceGraph3D
        graphData={graphData}
        linkDirectionalParticles={20}
        linkDirectionalParticleSpeed={0.005}
        extraRenderers={extraRenderers}
        onNodeClick={(node) => {
          setSelectedNode(node as INode);
          setOptionsModalOpen(true);
        }}
        nodeThreeObject={node => {
          const nodeEl = document.createElement('div');
          nodeEl.textContent = node.name?.toString() ?? '';
          nodeEl.style.color = node.color;
          nodeEl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          nodeEl.style.padding = '2px 6px';
          nodeEl.style.borderRadius = '4px';
          nodeEl.style.fontSize = '12px';
          
          nodeEl.className = 'node-label';  
          return new CSS2DObject(nodeEl);
        }}
      linkThreeObject={(link) => {
          const linkEl = document.createElement('div');
          linkEl.textContent = link.label?.toString() ?? '';
          linkEl.style.color = '#ffffff';
          linkEl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          linkEl.style.padding = '2px 6px';
          linkEl.style.borderRadius = '4px';
          linkEl.style.fontSize = '10px';
          linkEl.className = 'link-label';
          return new CSS2DObject(linkEl);
        }}
        linkPositionUpdate={(sprite, { start, end }) => {
          const middle = {
            x: start.x + (end.x - start.x) / 2,
            y: start.y + (end.y - start.y) / 2,
            z: start.z + (end.z - start.z) / 2
          };
          Object.assign(sprite.position, middle);
        }}
        nodeThreeObjectExtend={true}
        nodeLabel={node => "Id:" + (node.id?.toString() ?? 'Not found')}
      />
      <NodeOptionsModal open={optionsModalOpen} onOpenChange={setOptionsModalOpen} selectedNode={selectedNode} setSelectedNode={setSelectedNode}/>
    </>
  );
}
