export interface INode { 
  id: number,
  name: string
  color: string
  type: INodeType
}

export type INodeType = "Developer" | "Company"

export interface IDeveloper  { 
  id: number,
  name: string
  location: string
  age: number
}

export interface ICompany{ 
  id: number,
  name: string
  location: string
  industry: string
  revenue: number
}

export interface ILink { 
  source: INode,
  target: INode
  label: string
}