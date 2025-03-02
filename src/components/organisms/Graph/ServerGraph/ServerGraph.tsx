import { companyColor, developerColor } from "@/common/constants/colors";
import { ICompany, IDeveloper, ILink, INode } from "@/common/interfaces/types";
import ClientGraph from "@/components/organisms/Graph/ClientGraph/ClientGraph";
import { apiClient } from "@/utils/utils";

const withExtraProps = <T, F>(data: T[], props: Partial<F>) => { 
  return (data?.map((item: T) => ({ ...item, ...props })) ?? []) as F[]
}

export default async function ServerGraph() {
  const [developers, companies, knowsLinks, worksLinks] = (await Promise.all([
    apiClient.get('/developers'),
    apiClient.get('/companies'),
    apiClient.get('/relations/knows'),
    apiClient.get('/relations/works-in')
  ])).map(item => item.data);


  const finalNodes = [...withExtraProps<IDeveloper, INode>(developers, {color: developerColor, type: "Developer"}), ...withExtraProps<ICompany, INode>(companies, {color: companyColor, type: "Company"})]
  const finalLinks = [...withExtraProps<ILink, ILink>(knowsLinks, {label: 'knows'}), ...withExtraProps<ILink, ILink>(worksLinks, {label: 'works in'})]

  const finalData : {nodes: INode[], links: ILink[]} = {
    nodes: finalNodes,
    links: finalLinks 
  }

  return (  
    <ClientGraph initialData={finalData}  />
  );
}
  