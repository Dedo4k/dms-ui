import {DataFile} from "./DataFile";

export interface DataGroup {
  id: number
  name: string
  files: DataFile[]
}
