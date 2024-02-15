"use client";
import {useFormState} from "@/stores/FormState";
import {Fields} from "@/types/templates/template";
import {ActionIcon, Card, Flex, Group} from "@mantine/core";
import {Delete, Pen, Trash} from "lucide-react";
import EditModal from "@/components/templates/create-page/components/EditModal";

export default function WorkZone() {
    const {elements, deleteElement} = useFormState()
    return (
        <>
            {elements.map(element =>
                <Card key={element.uid} mb={20}>
                    <Flex align={"center"} gap={40}>
                        {Fields[element.type].formElement({instance: element})}
                        <Group w={"20%"}>
                            <ActionIcon variant={"subtle"} color={"red"} onClick={() => deleteElement(element)}><Trash/></ActionIcon>
                            <ActionIcon variant={"subtle"}><EditModal instance={element}><Pen/></EditModal></ActionIcon>
                        </Group>
                    </Flex>
                </Card>
            )}
        </>
    )
}