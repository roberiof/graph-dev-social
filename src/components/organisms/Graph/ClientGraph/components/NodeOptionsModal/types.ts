import { INode } from "@/common/interfaces/types";

export interface NodeOptionsModalProps {
  selectedNode: INode | null;
  setSelectedNode: (node: INode | null) => void;
}