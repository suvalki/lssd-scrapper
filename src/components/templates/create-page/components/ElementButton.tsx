"use client";
import {FormElement} from "@/types/templates/template";
import {Button, Stack, Text} from "@mantine/core";
import {HTMLProps} from "react";

export default function ElementButton({element:{designBtnElement: {label, icon:Icon}}, ...props}:{element: FormElement<any>} & HTMLProps<HTMLDivElement>) {
    return (
        <div {...props}>
            <Button w={"100%"} leftSection={<Icon/>} variant={"subtle"} color={"gray"}>
                    {label}
            </Button>
        </div>
    )
}