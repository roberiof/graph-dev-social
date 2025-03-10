'use client';

import { companyColor, developerColor } from '@/common/constants/colors';
import { useGraphData } from '@/common/context/GraphData';
import { ILink, INode } from '@/common/interfaces/types';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import LinkOptionsModal from './components/LinkOptionsModal/LinkOptionsModal';
import NodeOptionsModal from './components/NodeOptionsModal/NodeOptionsModal';
import { ClientGraphProps } from './types';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function ClientGraph({ initialData }: ClientGraphProps) {
  const [extraRenderers, setExtraRenderers] = useState<unknown[]>([]);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [selectedLink, setSelectedLink] = useState<ILink | null>(null); 

  const { graphData, setGraphData } = useGraphData();
  
  useEffect(() => {
    if (graphData) return;
    setGraphData(initialData);
  }, [graphData, initialData, setGraphData]); 

  useEffect(() => {
    setExtraRenderers([new CSS2DRenderer()]);
  }, []);
  

  if (!graphData || extraRenderers.length === 0) return null;

  return (
    <>
      <ForceGraph3D
        backgroundColor='rgba(0, 0, 0, 0.90)'
        graphData={graphData}
        linkColor={link => link.label === 'knows' ? developerColor : companyColor}
        linkOpacity={0.5}
        extraRenderers={extraRenderers}
        onLinkClick={(link) => {
          setSelectedLink(link as ILink);
        }}
        onNodeClick={(node) => {
          setSelectedNode(node as INode);
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
        nodeThreeObjectExtend={true}
        nodeLabel={node => "Id:" + (node.id?.toString() ?? 'Not found')}
        linkLabel={link => `Relation: ${link.label}`}
      />
      <NodeOptionsModal selectedNode={selectedNode} setSelectedNode={setSelectedNode}/>
      <LinkOptionsModal selectedLink={selectedLink} setSelectedLink={setSelectedLink}/>
    </>
  );
}
