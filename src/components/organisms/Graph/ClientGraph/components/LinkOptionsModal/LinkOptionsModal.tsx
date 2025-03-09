import { useGraphData } from '@/common/context/GraphData';
import { ILink } from '@/common/interfaces/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { errorToast, successToast } from '@/utils/toast';
import { apiClient } from '@/utils/utils';
import { useTransition } from 'react';
import { LinkOptionsModalProps } from './types';

const LinkOptionsModal = ({ 
  selectedLink, 
  setSelectedLink,
}: LinkOptionsModalProps) => {
  const { setGraphData } = useGraphData();
  
  const [isPendingDelete, startTransitionDelete] = useTransition();

  const handleDelete = () => {
    if (!selectedLink) return;

    startTransitionDelete(async () => {
      const response = await apiClient.delete(`/relations/${decodeURIComponent(selectedLink.label).replace(/\s+/g, "-")}`, {
        sourceId: selectedLink.source.id,
        targetId: selectedLink.target.id
      });

      if (response.error) {
        errorToast(`Error removing link`);
      } else {

        setGraphData(prev => ({
          links: prev?.links.filter((link: ILink) => link.source.id !== selectedLink.source.id || link.target.id !== selectedLink.target.id) ?? [],
          nodes: prev?.nodes ?? []
        }));
        successToast(`Link removed successfully`);
      };

      setSelectedLink(null);
    });
  };


  if (!selectedLink) return null;

  return (
    <>
      <Dialog open={!!selectedLink} onOpenChange={(open) => !open ? setSelectedLink(null) : setSelectedLink(selectedLink)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Want to remove this link? </DialogTitle>
            <DialogDescription>
              This action is not reversible
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <button 
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
            >
              {isPendingDelete ? "Removing link..." : "Remove"}
            </button>
          </div>
        </DialogContent>
      </Dialog>  
    </>
  )
}

export default LinkOptionsModal