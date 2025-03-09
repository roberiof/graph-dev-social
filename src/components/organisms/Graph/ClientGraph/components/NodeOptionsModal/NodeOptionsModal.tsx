import { useGraphData } from '@/common/context/GraphData';
import { ILink, INode } from '@/common/interfaces/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { errorToast, successToast } from '@/utils/toast';
import { apiClient } from '@/utils/utils';
import { useState, useTransition } from 'react';
import { NodeOptionsModalProps } from './types';
import { AddRelationModal } from './components/AddRelationModal/AddRelationModal';


const NodeOptionsModal = ({ 
  selectedNode, 
  setSelectedNode,
}: NodeOptionsModalProps) => {
  const { setGraphData } = useGraphData();
  const [openAddRelationModal, setOpenAddRelationModal] = useState(false);
  
  const [isPendingDelete, startTransitionDelete] = useTransition();

  const handleDelete = () => {
    if (!selectedNode) return;
    startTransitionDelete(async () => {
      const baseURL = selectedNode.type === 'Company' ? 'companies' : 'developers';
      const response = await apiClient.delete(`/${baseURL}/${selectedNode.id}`);
    

      if (response.error) {
        errorToast(`Error removing ${selectedNode.type}`);
      } else {
        setGraphData(prev => ({
          links: prev?.links.filter((link: ILink) => link.source.id !== selectedNode.id && link.target.id !== selectedNode.id) ?? [],
          nodes: prev?.nodes.filter((node: INode) => node.id !== selectedNode.id) ?? []
        }));
        successToast(`${selectedNode.type} removed successfully`);
      };

      setSelectedNode(null);
    });
  };

  const canAddRelationsTypes = ["Developer"];

  if (!selectedNode) {
    if (openAddRelationModal) {
      setOpenAddRelationModal(false);
    }
    return null 
  };

  return (
    <>
      <Dialog open={!!selectedNode} onOpenChange={(open) => !open ? setSelectedNode(null) : setSelectedNode(selectedNode)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Options to node <span className='font-bold'>{selectedNode.name}</span> ({selectedNode.type})</DialogTitle>
            <DialogDescription>
              Add a relation or delete this node
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-2'>
            {canAddRelationsTypes.includes(selectedNode.type) && 
              <>
                <button
                  onClick={() => setOpenAddRelationModal(true)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                >
                  Add relation
                </button>
                <AddRelationModal 
                  open={openAddRelationModal}
                  onOpenChange={setOpenAddRelationModal}
                  selectedNode={selectedNode}
                  setSelectedNode={setSelectedNode}
                />
              </> 
            }
            <button 
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
            >
              {isPendingDelete ? "Removing node..." : "Remove"}
            </button>
          </div>
        </DialogContent>
      </Dialog>  
     
    </>
  )
}

export default NodeOptionsModal