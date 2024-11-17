import {FC, useEffect} from "react";
import "../styles/DatasetEditor.css";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store/Store";
import {fetchDataset, fetchGroups} from "../services/DatasetService";
import {downloadFile} from "../services/DatasetApi";

export const DatasetEditor: FC = () => {
  const {id} = useParams();

  if (!id) {
    throw new Error("Dataset ID was not provided")
  }

  const datasetId = Number.parseInt(id);

  const dataset = useSelector((state: RootState) => state.datasetsState.datasets.find(dataset => dataset.id === datasetId));

  if (!dataset) {
    fetchDataset(datasetId)
  }

  useEffect(() => {
    fetchGroups(datasetId)
  }, []);

  return <>
    <div className="dataset-editor">
      <div className={"groups"}>
        <div className="dataset-info">
          <div>{dataset?.name}</div>
          <div>{dataset?.description}</div>
        </div>
        <div className="groups-list">
          {
            dataset?.groups?.map(group => <>
              <div key={group.id} className={"group-item"}>
                <div>{group.name}</div>
                <div className={"files-list"}>
                  {
                    group.files.map(file => <>
                      <div key={`${group.id}.${file.id}`} className={"file-item"} onClick={() => downloadFile(file)}>{file.fileName}</div>
                    </>)
                  }
                </div>
              </div>
            </>)
          }
        </div>
      </div>
      <div className={"editor"}>

      </div>
      <div className={"annotations"}>

      </div>
    </div>
  </>
}
