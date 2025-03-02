import { INode } from "@/common/interfaces/types";

export interface NodeOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: INode | null;
  setSelectedNode: (node: INode | null) => void;
  availableNodes?: INode[];
  onAddRelation?: (targetNodeId: string) => void;
}