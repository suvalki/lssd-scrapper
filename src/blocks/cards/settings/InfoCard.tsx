"use client";
import {useUser} from "@/stores/User";
import {Card, Flex, Stack, Text, ThemeIcon} from "@mantine/core";
import React from "react";

export default function InfoCard({icon, title, value} : {icon: React.ReactNode, title: string, value: any}) {


    return (
        <>
            <Card w={"100%"}>
                <Flex align={"center"} h={"100%"}>
                    <Flex gap={20} align={"center"}>
                        <ThemeIcon variant={"light"}>
                            {icon}
                        </ThemeIcon>
                        <Stack gap={0}>
                            <Text>{title}</Text>
                            <Text fz={12} opacity={0.5}>{value}</Text>
                        </Stack>
                    </Flex>
                </Flex>
            </Card>
        </>
    )
}