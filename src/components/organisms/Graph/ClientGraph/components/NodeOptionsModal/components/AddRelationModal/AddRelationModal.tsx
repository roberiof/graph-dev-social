import { useGraphData } from "@/common/context/GraphData";
import SearchSelect from "@/components/atoms/SearchSelect/SearchSelect";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { errorToast, successToast } from "@/utils/toast";
import { apiClient } from "@/utils/utils";
import { useMemo, useState, useTransition } from "react";
import { AddRelationModalProps } from "./types";
import { getBody, updateGraphDataState } from "./utils";

export const AddRelationModal = ({ open, onOpenChange, selectedNode, setSelectedNode }: AddRelationModalProps) => {
  const { graphData, setGraphData } = useGraphData();

  const [selectedTargetNode, setSelectedTargetNode] = useState<string>("");
  const [selectRelationType, setSelectRelationType] = useState<string>("");
  const [isPendingAddRelation, startTransitionAddRelation] = useTransition();

  const relations = [
    "Conhece (knows)",
    "Trabalha em (works-in)"
  ]

  const availableNodes = useMemo(() => {

    
    if (selectRelationType.includes("knows")) {
      const alreadyKnownsDevelopersIds = graphData?.links.filter(link => (link.source.id === selectedNode.id || link.target.id === selectedNode.id) && link.label === "knows").map(relation => relation.source.id === selectedNode.id ? relation.target.id : relation.source.id)

      return graphData?.nodes.filter(node => node.type === "Developer" && node.id !== selectedNode.id && !alreadyKnownsDevelopersIds?.includes(node.id))
    }

    if (selectRelationType.includes("works-in")) {
      const alreadyWorksInCompaniesIds = graphData?.links.filter(link => (link.source.id === selectedNode.id || link.target.id === selectedNode.id) && link.label === "works-in").map(relation => relation.source.id === selectedNode.id ? relation.target.id : relation.source.id)

      return graphData?.nodes.filter(node => node.type === "Company" && !alreadyWorksInCompaniesIds?.includes(node.id))
    }
  }, [graphData, selectRelationType, selectedNode.id]);

  const selectedTargetNodeId = availableNodes?.find(node => node.name === selectedTargetNode)?.id as number;


  const handleAddRelation = (id: number, relationType: "knows" | "works-in") => {
    if (!selectedNode) return;

    startTransitionAddRelation(async () => {
      const body = getBody(relationType, selectedNode, id)

      const response = await apiClient.post(`/developers/${relationType}`, body);

      if (response.error) {
        errorToast(`Erro ao adicionar relação`);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateGraphDataState(relationType, selectedNode, id, availableNodes ?? [], setGraphData as any)
        onOpenChange(false);
        successToast(`Relação adicionada com sucesso`);  
        setSelectedNode(null);
      };
    });  
  }
   
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Options to node <span className='font-bold'>{selectedNode.name}</span> ({selectedNode.type})</DialogTitle>
        <DialogDescription>
          Add a relation or delete this node
        </DialogDescription>
      </DialogHeader>

      <div className='space-y-4 h-[200px]'>
        <SearchSelect
          options={relations}
          placeholder="Selecione um tipo de relação"
          onChange={setSelectRelationType}
          value={selectRelationType}
        />
        {selectRelationType && (
          <SearchSelect
            options={availableNodes?.map(node => node.name) ?? []}
            placeholder="Selecione um nó para relacionar"
            onChange={setSelectedTargetNode}
            value={selectedTargetNode}
            ></SearchSelect>
        )}
      </div>
      <DialogFooter>
        <button className='bg-gray-500 text-white px-4 py-2 rounded-md w-full' onClick={() => onOpenChange(false)}>Cancelar</button>
        <button
          onClick={() => handleAddRelation(selectedTargetNodeId, selectRelationType.includes("knows") ? "knows" : "works-in")}
          className=" bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          disabled={isPendingAddRelation}
        >
            {isPendingAddRelation ? "Adicionando..." : "Adicionar Relação"}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog> 
  )
}