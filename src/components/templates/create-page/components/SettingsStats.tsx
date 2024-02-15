import {Kbd, Stack, Text} from "@mantine/core";
import {FormElementInstance} from "@/types/templates/template";

export default function SettingsStats({title, value}: { title: string, value: string}) {

    return (
        <>
                <Stack gap={2} justify={"center"} align={"start"}>
                    <Text opacity={0.5}>{title}</Text>
                    <Kbd style={{
                        cursor: "pointer"
                    }} onClick={() => window.navigator.clipboard.writeText(`{${value}}`)}>{value}</Kbd>
                </Stack>
        </>
    )
}