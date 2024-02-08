"use client"
import React from "react"
import {Button} from "@mantine/core";
import {useRouter} from "next/navigation";

type Props = {
    title: string,
    link: string,
    active: boolean
}
export const NavigationLink:React.FC<Props & typeof Button["defaultProps"]> = ({link, title, active, ...props}) => {
    const router = useRouter()
    return (
        <Button variant={"subtle"} color={active ? "green" : "white"} autoContrast style={{
            ...props.style
        }} {...props} onClick={() => router.push(link)}>
            {title}
        </Button>
    )
}