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

import React, { FC } from "react"
import "../../styles/ContextMenu.css"

interface ContextMenuProps {
  position: {
    x: number,
    y: number
  },
  onClose: () => void
  children: React.ReactNode
}

export const ContextMenu: FC<ContextMenuProps> = (props: ContextMenuProps) => {
  const {
    position,
    onClose,
    children
  } = props

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    onClose()
  }

  return <>
    <div className={"menu-backdrop"} onClick={handleBackdrop}>
      <div className="context-menu" style={{
        position: "absolute",
        left: position.x,
        top: position.y
      }}>
        {
          children
        }
      </div>
    </div>
  </>
}
