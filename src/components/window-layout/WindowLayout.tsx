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

import { Folder } from "@mui/icons-material"
import React, { FC, useState } from "react"
import "../../styles/WindowLayout.css"
import { v4 as uuidv4 } from "uuid"
import { Tree, TreeNode } from "../tree/Tree"
import WindowContainer from "./WindowContainer"

interface WindowLayoutProps {

}

interface Window {
  windowName: string
  layoutType: WindowLayoutType
  windowIcon: React.ReactElement
  component: React.ReactNode
}

interface WindowState extends Window {
  id: string
  size: WindowSize
}

interface WindowSize {
  width: number
  height: number
}

type WindowLayoutType =
  "left-top"
  | "left-bottom"
  | "right-top"
  | "right-bottom"
  | "bottom-left"
  | "bottom-right"
  | "main"

export const WindowLayout: FC<WindowLayoutProps> = (props: WindowLayoutProps) => {
  const treeData: TreeNode[] = [
    {
      data: "filename1",
      children: [
        {
          data: "filename1.1",
          children: []
        }
      ]
    },
    {
      data: "filename2",
      children: [
        {
          data: "filename2.1",
          children: []
        }
      ]
    }
  ]

  const [windows, setWindows] = useState<WindowState[]>([
                                                          {
                                                            id: uuidv4(),
                                                            windowName: "Annotations Groups",
                                                            layoutType: "left-top",
                                                            windowIcon: <Folder/>,
                                                            component: <Tree nodes={treeData}
                                                                             onNodeClick={() => null}
                                                                             dataRenderer={nodeData => nodeData}/>,
                                                            size: {
                                                              width: 300,
                                                              height: 400
                                                            }
                                                          },
                                                          {
                                                            id: uuidv4(),
                                                            windowName: "Annotations Groups",
                                                            layoutType: "left-bottom",
                                                            windowIcon: <Folder/>,
                                                            component: <div style={{
                                                              backgroundColor: "red",
                                                              width: "100%",
                                                              height: "100%"
                                                            }}>1</div>,
                                                            size: {
                                                              width: 300,
                                                              height: 400
                                                            }
                                                          },
                                                          {
                                                            id: uuidv4(),
                                                            windowName: "Annotations Groups",
                                                            layoutType: "right-top",
                                                            windowIcon: <Folder/>,
                                                            component: <div style={{
                                                              backgroundColor: "green",
                                                              width: "100%",
                                                              height: "100%"
                                                            }}>2</div>,
                                                            size: {
                                                              width: 300,
                                                              height: 400
                                                            }
                                                          },
                                                          {
                                                            id: uuidv4(),
                                                            windowName: "Annotations Groups",
                                                            layoutType: "right-bottom",
                                                            windowIcon: <Folder/>,
                                                            component: <div style={{
                                                              backgroundColor: "blue",
                                                              width: "100%",
                                                              height: "100%"
                                                            }}>3</div>,
                                                            size: {
                                                              width: 300,
                                                              height: 400
                                                            }
                                                          },
                                                          {
                                                            id: uuidv4(),
                                                            windowName: "Annotations Groups",
                                                            layoutType: "bottom-left",
                                                            windowIcon: <Folder/>,
                                                            component: <div style={{
                                                              backgroundColor: "blue",
                                                              width: "100%",
                                                              height: "100%"
                                                            }}>3</div>,
                                                            size: {
                                                              width: 300,
                                                              height: 400
                                                            }
                                                          },
                                                          {
                                                            id: uuidv4(),
                                                            windowName: "Annotations Groups",
                                                            layoutType: "bottom-right",
                                                            windowIcon: <Folder/>,
                                                            component: <div style={{
                                                              backgroundColor: "blue",
                                                              width: "100%",
                                                              height: "100%"
                                                            }}>3</div>,
                                                            size: {
                                                              width: 300,
                                                              height: 400
                                                            }
                                                          }
                                                        ])
  const [activeWindows, setActiveWindows] = useState<string[]>([])

  const onWindowToggle = () => {

  }

  const onWindowHeaderMouseDown = () => {

  }

  const onMouseMove = () => {

  }

  const onMouseUp = () => {

  }

  const renderWindow = (layoutType: WindowLayoutType): React.ReactNode => {
    return <>
      {
        windows.map((window, index) => window.layoutType === layoutType ? (
          <React.Fragment key={index.toString()}>
            <div className="window" style={{
              width: `${window.size.width}px`,
              height: `${window.size.height}px`
            }}>
              <div className="window-header">
                {
                  window.windowName
                }
              </div>
              <div className="window-body">
                {
                  window.component
                }
              </div>
            </div>
          </React.Fragment>
        ) : null)
      }
    </>
  }

  const renderWindowIcon = (window: WindowState, id: string): React.ReactNode => {
    return <React.Fragment key={id}>
      <div className="window-btn" title={window.windowName}>
        {
          window.windowIcon
        }
      </div>
    </React.Fragment>
  }

  const renderSidebarIcons = (layoutType: WindowLayoutType): React.ReactNode => {
    return <>
      {
        windows.map((window, index) => window.layoutType === layoutType ? renderWindowIcon(
          window,
          index.toString()
        ) : null)
      }
    </>
  }

  return <>
    <div className={"window-layout-container"}>
      <div className={"window-layout-sidebar left-sidebar"}>
        <div className="top-sidebar-section">
          <div className="sidebar-section-subsection">
            {
              renderSidebarIcons("left-top")
            }
          </div>
          <div className="sidebar-section-subsection">
            {
              renderSidebarIcons("left-bottom")
            }
          </div>
        </div>
        <div className="bottom-sidebar-section">
          {
            renderSidebarIcons("bottom-left")
          }
        </div>
      </div>
      {/*<div className={"window-layout"}>*/}
      {/*  <div className={"top-container"}>*/}
      {/*    <div className={"left-container"}>*/}
      {/*      <div className={"left-top-container"}>*/}
      {/*        {*/}
      {/*          renderWindow("left-top")*/}
      {/*        }*/}
      {/*      </div>*/}
      {/*      <div className={"vertical-resizer"}></div>*/}
      {/*      <div className={"left-bottom-container"}>*/}
      {/*        {*/}
      {/*          renderWindow("left-bottom")*/}
      {/*        }*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="horizontal-resizer"></div>*/}
      {/*    <div className={"main-container"}></div>*/}
      {/*    <div className="horizontal-resizer"></div>*/}
      {/*    <div className={"right-container"}>*/}
      {/*      <div className={"right-top-container"}>*/}
      {/*        {*/}
      {/*          renderWindow("right-top")*/}
      {/*        }*/}
      {/*      </div>*/}
      {/*      <div className={"vertical-resizer"}></div>*/}
      {/*      <div className={"right-bottom-container"}>*/}
      {/*        {*/}
      {/*          renderWindow("right-bottom")*/}
      {/*        }*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className={"vertical-resizer"}></div>*/}
      {/*  <div className="bottom-container">*/}
      {/*    <div className={"bottom-left-container"}>*/}
      {/*      {*/}
      {/*        renderWindow("bottom-left")*/}
      {/*      }*/}
      {/*    </div>*/}
      {/*    <div className="horizontal-resizer"></div>*/}
      {/*    <div className={"bottom-right-container"}>*/}
      {/*      {*/}
      {/*        renderWindow("bottom-right")*/}
      {/*      }*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <WindowContainer orientation={"vertical"}>
        <WindowContainer orientation={"horizontal"}>
          <div>Top left section</div>
          <div>Main</div>
          <div>Top right section</div>
        </WindowContainer>
        <WindowContainer orientation={"horizontal"}>
          <div>Bottom left section</div>
          <div>Bottom right section</div>
        </WindowContainer>
      </WindowContainer>

      <div className={"window-layout-sidebar right-sidebar"}>
        <div className="top-sidebar-section">
          <div className="sidebar-section-subsection">
            {
              renderSidebarIcons("right-top")
            }
          </div>
          <div className="sidebar-section-subsection">
            {
              renderSidebarIcons("right-bottom")
            }
          </div>
        </div>
        <div className="bottom-sidebar-section">
          {
            renderSidebarIcons("bottom-right")
          }
        </div>
      </div>
    </div>
  </>
}
