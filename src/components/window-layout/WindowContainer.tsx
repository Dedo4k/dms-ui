/*
 * Copyright (c) 2025 Uladzislau Lailo.
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

import React, { ReactNode, useState } from "react"
import "../../styles/WindowContainer.css"

interface WindowContainerProps {
  orientation?: "horizontal" | "vertical";
  children: ReactNode[];
}

const WindowContainer: React.FC<WindowContainerProps> = ({
                                                           orientation = "horizontal",
                                                           children
                                                         }: WindowContainerProps) => {
  const [sizes, setSizes] = useState<number[]>(Array(children.length).fill(100 / children.length))

  const isHorizontal = orientation === "horizontal"

  const handleResize = (index: number, delta: number) => {
    const total = sizes[index] + sizes[index + 1]
    const newSizes = [...sizes]
    newSizes[index] = Math.max(10, sizes[index] + delta)
    newSizes[index + 1] = total - newSizes[index]
    setSizes(newSizes)
  }

  const onMouseDown = (index: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    const startPos = isHorizontal ? e.clientX : e.clientY

    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY
      const delta =
        ((currentPos - startPos) / (isHorizontal ? window.innerWidth : window.innerHeight)) * 100
      handleResize(index, delta)
    }

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <div
      className={`window-container ${isHorizontal ? "horizontal" : "vertical"}`}
      style={{
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column"
      }}
    >
      {React.Children.map(children, (child, index) => (
        <>
          <div
            className="window-pane"
            style={{
              flex: `${sizes[index]}%`
            }}
          >
            {child}
          </div>
          {index < children.length - 1 && (
            <div
              className={`resizer ${isHorizontal ? "horizontal" : "vertical"}`}
              onMouseDown={onMouseDown(index)}
            />
          )}
        </>
      ))}
    </div>
  )
}

export default WindowContainer
