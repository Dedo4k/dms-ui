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

import { ChevronRight, KeyboardArrowDown } from "@mui/icons-material"
import React, { FC, ReactNode } from "react"
import "../../styles/Tree.css"
import { useExpandCollapse } from "../../hooks/ExpandCollapseHook"

interface TreeProps {
  nodes: TreeNode[]
  onNodeClick: (node: TreeNode, nodeId: string) => void
  dataRenderer?: (node: any) => ReactNode
}

export interface TreeNode {
  data: any
  children: TreeNode[]
}

export const Tree: FC<TreeProps> = (props: TreeProps) => {
  const {
    nodes,
    dataRenderer,
    onNodeClick
  } = props
  const {
    expand,
    collapse,
    isExpanded
  } = useExpandCollapse()

  const toggleExpandCollapse = (nodeId: string) => {
    if (isExpanded(nodeId)) {
      collapse(nodeId)
    } else {
      expand(nodeId)
    }
  }

  const renderNode = (node: TreeNode, nodeId: string) => {
    return <React.Fragment key={nodeId}>
      <div id={nodeId} className={"tree-node"}>
        <div className={`tree-node-data ${isExpanded(nodeId) ? "expanded" : "collapsed"}`}>
          {
            node.children.length > 0 &&
              <div className={"expand-collapse"} onClick={() => toggleExpandCollapse(nodeId)}>
                {
                  isExpanded(nodeId) ? <KeyboardArrowDown fontSize={"small"}/> : <ChevronRight fontSize={"small"}/>
                }
              </div>
          }
          <div className={node.children.length === 0 ? "no-children" : ""} onClick={() => onNodeClick(node, nodeId)}>
            {
              dataRenderer ? dataRenderer(node.data) : node.data
            }
          </div>
        </div>
        {
          node.children.length > 0 && isExpanded(nodeId) &&
            <div className={"tree-node-children"}>
              {
                node.children.map((child, index) => renderNode(
                  child,
                  nodeId.concat(".").concat(index.toString())
                ))
              }
            </div>
        }
      </div>
    </React.Fragment>
  }

  return <>
    <div className="tree-container">
      {
        nodes.map((data, index) => renderNode(data, index.toString()))
      }
    </div>
  </>
}
