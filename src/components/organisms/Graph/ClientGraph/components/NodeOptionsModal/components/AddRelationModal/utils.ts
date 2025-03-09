import { INode } from "@/common/interfaces/types";
import { Dispatch, SetStateAction } from "react";
import { GraphData } from "react-force-graph-3d";

export const getBody = (relationType: "knows" | "works-in", selectedNode: INode, id: number) => {
  return relationType === "knows" ? { 
    developerId: selectedNode.id,
    knownDeveloperId: id
  } : { 
    developerId: selectedNode.id,
    companyId: id 
  }
}

export const updateGraphDataState = (relationType: "knows" | "works-in", selectedNode: INode, id: number, availableNodes: INode[], setGraphData: Dispatch<SetStateAction<GraphData>>) => { 
  if (relationType === "knows") {
    const developerNode = availableNodes?.find(node => node.id === id) as INode

    setGraphData(prev => ({
      links: [...(prev?.links ?? []), { source: selectedNode, target: developerNode , label: relationType }],
      nodes: [...(prev?.nodes ?? [])]
    }));

    return 
  }

  if (relationType === "works-in") {
    const companyNode = availableNodes?.find(node => node.id === id) as INode

    setGraphData(prev => ({
      links: [...(prev?.links ?? []), { source: selectedNode, target: companyNode , label: relationType }],
      nodes: [...(prev?.nodes ?? [])]
    }));
    return
  }

  throw new Error("Invalid relation type");
}