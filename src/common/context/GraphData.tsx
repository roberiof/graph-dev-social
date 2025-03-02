"use client"; 

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { ILink, INode } from "../interfaces/types";

export type GraphData = {
  nodes: INode[];
  links: ILink[];
}; 
  
type GraphDataContextType = {
  graphData: GraphData | null;
  setGraphData: Dispatch<SetStateAction<GraphDataContextType["graphData"]>>;
};

const GraphDataContext = createContext<GraphDataContextType | undefined>(undefined);

export function GraphDataProvider({ children }: { children: ReactNode }) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  return (
    <GraphDataContext.Provider value={{ graphData, setGraphData }}>
      {children}
    </GraphDataContext.Provider>
  );
}

export function useGraphData() {
  const context = useContext(GraphDataContext);
  if (!context) throw new Error("useGraphData must be used within a GraphProvider");
  return context;
}
