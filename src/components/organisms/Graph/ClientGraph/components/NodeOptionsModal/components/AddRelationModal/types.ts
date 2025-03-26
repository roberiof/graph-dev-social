import { INode } from "@/common/interfaces/types";

export type AddRelationModalProps = { open: boolean, onOpenChange: (open: boolean) => void, selectedNode: INode, setSelectedNode: (node: INode | null) => void   }
