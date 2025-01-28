/*
 * Copyright (c) 2024-2025 Uladzislau Lailo.
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
import React, { FC, ReactNode, useState } from "react"
import "../../styles/Tree.css"
import { useExpandCollapse } from "../../hooks/ExpandCollapseHook"
import { ContextMenu } from "../context-menu/ContextMenu"

interface TreeProps {
  nodes: TreeNode[]
  onNodeClick: (node: TreeNode, nodeId: string) => void
  dataRenderer?: (data: any) => ReactNode
  isActive?: (node: TreeNode) => boolean
  contextMenuRenderer?: (node: TreeNode) => ReactNode
}

export interface TreeNode {
  data: any
  children: TreeNode[]
}

export const Tree: FC<TreeProps> = (props: TreeProps) => {
  const {
    nodes,
    dataRenderer,
    onNodeClick,
    isActive,
    contextMenuRenderer
  } = props
  const {
    expand,
    collapse,
    isExpanded
  } = useExpandCollapse()
  const [contextMenuTarget, setContextMenuTarget] = useState<TreeNode | null>(null)
  const [menuPosition, setMenuPosition] = useState<{
    x: number,
    y: number
  } | null>(null)

  const toggleExpandCollapse = (nodeId: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    if (isExpanded(nodeId)) {
      collapse(nodeId)
    } else {
      expand(nodeId)
    }
  }

  const toggleContextMenu = (node: TreeNode, nodeId: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    const {
      pageX,
      pageY
    } = e

    setContextMenuTarget(node)
    setMenuPosition({
                      x: pageX,
                      y: pageY
                    })
  }

  const closeContextMenu = () => {
    setContextMenuTarget(null)
    setMenuPosition(null)
  }

  const handleOnNodeClick = (node: TreeNode, nodeId: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    onNodeClick && onNodeClick(node, nodeId)
  }

  const renderNode = (node: TreeNode, nodeId: string) => {
    return <React.Fragment key={nodeId}>
      <div id={nodeId} className={"tree-node"}>
        <div className={`tree-node-data ${isExpanded(nodeId) ? "expanded" : "collapsed"} ${isActive && isActive(node) ? " active" : ""}`}
             onClick={(e) => handleOnNodeClick(node, nodeId, e)}
             onContextMenu={(e) => toggleContextMenu(node, nodeId, e)}>
          {
            node
              .children.length > 0 &&
              <div className={"expand-collapse"} onClick={(e) => toggleExpandCollapse(nodeId, e)}>
                {
                  isExpanded(nodeId) ? <KeyboardArrowDown fontSize={"small"}/> :
                    <ChevronRight fontSize={"small"}/>
                }
              </div>
          }
          <div className={node.children.length === 0 ? "no-children" : ""}>
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
      {
        contextMenuTarget && menuPosition &&
          <ContextMenu position={menuPosition} onClose={closeContextMenu}>
            {
              contextMenuRenderer && contextMenuRenderer(contextMenuTarget)
            }
          </ContextMenu>
      }
    </div>
  </>
}
