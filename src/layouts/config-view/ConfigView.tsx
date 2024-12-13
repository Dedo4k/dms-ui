/*
 * Copyright (c) 2024 Uladzislau Lailo.
 *
 * All rights reserved.
 *
 * This source code, and any associated documentation, is the intellectual property of Uladzislau Lailo.
 * Unauthorized copying, modification, distribution, or any form of reuse of this code, in whole or in part,
 * without explicit permission from the copyright holder is strictly prohibited, except where explicitly permitted
 * under applicable open-source licenses (if any).
 *
 * Licensed use:
 * If the code is provided under an open-source license, you must follow the terms of that license, which can be found in the LICENSE file.
 * For any permissions not covered by the license or any inquiries about usage, please contact: [lailo.vlad@gmail.com]
 */

import { Add } from "@mui/icons-material"
import { FC } from "react"
import "../../styles/ConfigView.css"
import { useDispatch, useSelector } from "react-redux"
import { AppendableSelect, Option } from "../../components/appendable-select/AppendableSelect"
import { Spinner } from "../../components/spinner/Spinner"
import { addClass, removeClass, setActiveClass } from "../../store/ConfigStore"
import { RootState } from "../../store/Store"

export const ConfigView: FC = () => {
  const dispatch = useDispatch()
  const configStoreState = useSelector((state: RootState) => state.configStoreState)

  const defaultClassOptions = configStoreState.defaultConfig?.classes || []
  const customClassOptions = configStoreState.customConfig.classes

  const options = [
    ...defaultClassOptions.map(option => ({
      data: option,
      editable: false
    } as Option)),
    ...customClassOptions.map(option => ({
      data: option,
      editable: true
    } as Option))
  ]

  const optionRenderer = (option: Option) => option?.data

  const handleOptionSelect = (option: Option) => {
    dispatch(setActiveClass(option.data))
  }

  const handleAddOption = (option: string) => {
    dispatch(addClass(option))
  }

  const handleRemoveOption = (option: Option) => {
    dispatch(removeClass(option.data))
  }

  return <>
    <div className={"config-view"}>
      <div className={"title"}>Dataset config</div>
      <div className={"config-container"}>
        {
          configStoreState.status === "loading" && <Spinner/>
        }
        {
          configStoreState.defaultConfig === null &&
            <div className={"no-config"}>
              {
                //TODO for dataset owner
                false ?
                  <div className={"btn add-config-btn"}>
                    <Add/>
                    Add Config
                  </div>
                  :
                  <div>No default config</div>
              }
            </div>
        }
        <div className={"annotation-class-view"}>
          <div className={"classes"}>Class:</div>
          <div className={"class-selector"}>
            <AppendableSelect options={options}
                              activeOption={configStoreState.activeClass}
                              optionRenderer={optionRenderer}
                              placeholder={"New Class"}
                              onSelect={handleOptionSelect}
                              onAdd={handleAddOption}
                              onRemove={handleRemoveOption}/>
          </div>
        </div>
      </div>
    </div>
  </>
}
