import {DataGroup} from "./DataGroup";

export interface Dataset {
  id: number
  name: string
  description: string
  ownerId: number
  creationDate: string
  modificationDate: string
  groups: DataGroup[]
  _links: any
}
