import React from "react"
import {Text} from "@mantine/core";

export const PageHeader:React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <Text fz={25} fw={700} style={{margin: "1rem 0 0 0"}}>{children}</Text>
    )
}