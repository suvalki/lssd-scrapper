"use client";
import {ActionIcon, Card, Flex, Stack, Text} from "@mantine/core";
import {ChevronRight} from "lucide-react";
import {useRouter} from "next/navigation";

export default function TemplateCard({name, description, link}: { name: string, description: string, link: string }) {

    const router = useRouter()


    return (
        <Card onClick={() => router.push(link)} style={{
            cursor: "pointer"
        }}>
            <Flex justify={"space-between"} align={"center"}>
                <Stack gap={0} style={{
                    maxWidth: "90%"
                }}>
                    <Text fz={20} fw={600}>{name}</Text>
                    <Text opacity={0.5} style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>{description}</Text>
                </Stack>
                <ActionIcon variant={"subtle"} onClick={() => router.push(link)}>
                    <ChevronRight/>
                </ActionIcon>
            </Flex>
        </Card>
    )
}