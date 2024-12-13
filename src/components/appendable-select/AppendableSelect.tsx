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

import { Add, Remove } from "@mui/icons-material"
import React, { FC, useState } from "react"
import "../../styles/AppendableSelect.css"

interface AppendableSelectProps {
  placeholder?: string
  options: Option[]
  activeOption: string | null
  optionRenderer: (option: any) => React.ReactNode
  onSelect?: (option: Option) => void
  onAdd?: (option: string) => void
  onRemove?: (option: Option) => void
}

export interface Option {
  data: any
  editable: boolean
}

export const AppendableSelect: FC<AppendableSelectProps> = (props: AppendableSelectProps) => {
  const {
    placeholder,
    optionRenderer,
    options,
    activeOption,
    onSelect,
    onAdd,
    onRemove
  } = props

  const [expanded, setExpanded] = useState(false)
  const [newOption, setNewOption] = useState<string>("")

  const toggleActiveOption = () => {
    setExpanded(!expanded)
  }

  const handleOptionClick = (option: Option) => {
    onSelect && onSelect(option)
  }

  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewOption(event.currentTarget.value.trim())
  }

  const handleAddOption = () => {
    if (newOption?.length) {
      onAdd && onAdd(newOption)
      setNewOption("")
    }
  }

  const handleRemoveOption = (event: React.MouseEvent<HTMLDivElement>, option: Option) => {
    event.stopPropagation()

    onRemove && onRemove(option)
  }

  return <>
    <div className={"appendable-select"}>
      <div className={"active-option"} onClick={toggleActiveOption}>
        {activeOption}
      </div>
      {
        expanded &&
          <>
              <div className={"options-list-backdrop"} onClick={toggleActiveOption}/>
              <div className={"options-list"}>
                  <div className={"option add-new-option"}>
                      <input type="text" placeholder={placeholder} value={newOption} onChange={handleOnInputChange}/>
                      <div className={"icon-btn control-btn"} title={"Add"}>
                          <Add onClick={handleAddOption}/>
                      </div>
                  </div>
                {
                  options.map((option, index) =>
                                <div key={index}
                                     className={`option ${activeOption === option.data && "active"}`}
                                     onClick={() => handleOptionClick(option)}>
                                  {
                                    optionRenderer(option)
                                  }
                                  {
                                    option.editable &&
                                      <div className={"icon-btn control-btn"}
                                           title={"Remove"}
                                           onClick={(e) => handleRemoveOption(e, option)}>
                                          <Remove/>
                                      </div>
                                  }
                                </div>)
                }
              </div>
          </>
      }
    </div>
  </>
}
