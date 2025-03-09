import { ILink } from "@/common/interfaces/types";

export interface LinkOptionsModalProps {
  selectedLink: ILink | null;
  setSelectedLink: (link: ILink | null) => void;
}