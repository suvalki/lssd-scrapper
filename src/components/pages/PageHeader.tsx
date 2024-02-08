import React from "react"

export const PageHeader:React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <h2 style={{margin: "1rem 0 0 0"}}>{children}</h2>
    )
}