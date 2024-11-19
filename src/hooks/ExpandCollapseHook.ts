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

import { useState } from "react"

interface ExpandCollapseState {
  activeNodes: string[]
}

const initialState: ExpandCollapseState = {
  activeNodes: []
}

export const useExpandCollapse = () => {
  const [activeNodes, setActiveNodes] = useState(initialState.activeNodes)

  const expand = (nodeId: string) => {
    if (!isExpanded(nodeId)) {
      setActiveNodes([...activeNodes, nodeId])
    }
  }

  const collapse = (nodeId: string) => {
    setActiveNodes(activeNodes.filter(id => id !== nodeId))
  }

  const isExpanded = (nodeId: string) => {
    return activeNodes.includes(nodeId)
  }

  return {
    activeNodes,
    expand,
    collapse,
    isExpanded
  }
}
