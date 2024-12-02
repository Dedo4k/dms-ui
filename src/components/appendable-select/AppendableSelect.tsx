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
import React, { FC, useEffect, useState } from "react"
import "../../styles/AppendableSelect.css"

interface AppendableSelectProps {
  placeholder?: string
  options: any[]
  optionRenderer: (option: any) => React.ReactNode
}

export const AppendableSelect: FC<AppendableSelectProps> = (props: AppendableSelectProps) => {
  const {
    placeholder,
    optionRenderer,
    options
  } = props

  const [activeOption, setActiveOption] = useState(options[0])
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setActiveOption(options[0])
  }, [options])

  const toggleActiveOption = () => {
    setExpanded(!expanded)
  }

  return <>
    <div className={"appendable-select"}>
      <div className={"active-option"} onClick={toggleActiveOption}>
        {
          optionRenderer(activeOption)
        }
      </div>
      {
        expanded &&
          <div className={"options-list"}>
              <div className={"option add-new-option"}>
                  <input type="text" placeholder={placeholder}/>
                  <div className={"control-btn"} title={"Add"}>
                      <Add/>
                  </div>
              </div>
            {
              options.map((option, index) =>
                            <div key={index} className={"option"}>
                              {
                                optionRenderer(option)
                              }
                              <div className={"control-btn"} title={"Remove"}>
                                <Remove/>
                              </div>
                            </div>)
            }
          </div>
      }
    </div>
  </>
}
