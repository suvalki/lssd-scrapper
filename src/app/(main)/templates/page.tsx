"use client";
import {Button, Flex, Grid, Pagination, Stack, Text, TextInput, ThemeIcon} from "@mantine/core";
import {PageHeader} from "@/components/pages/PageHeader";
import TemplateCard from "@/components/templates/main/TemplateCard";
import {Plus, Search, Shapes} from "lucide-react";
import {useRouter} from "next/navigation";
import {useUser} from "@/stores/User";
import {useState} from "react";
import {useInputState} from "@mantine/hooks";

export default function Page() {

    const router = useRouter()

    const {user} = useUser()

    const [page, setPage] = useState(1)
    const [search, setSearch] = useInputState("")

    return (
        <>
            <Flex mb={20} justify={"space-between"} align={"baseline"}>
                <PageHeader>Мои шаблоны</PageHeader>
                <Button leftSection={<Plus/>} variant={"subtle"}
                        onClick={() => router.push("/templates/new")}>Добавить</Button>
            </Flex>

            <TextInput placeholder={"Поиск"} value={search} onChange={setSearch} leftSection={<Search/>}/>

            <Grid columns={2} mt={20}>

                {user?.templatesCreated.length == 0 &&
                    <Flex justify={"center"} w={"100%"} mt={20}>
                        <Stack gap={2} align={"center"}>
                            <ThemeIcon variant={"transparent"} opacity={0.5} color={"white"} size={60}><Shapes
                                size={60}/></ThemeIcon>
                            <Text opacity={0.5}>Вы еще не создали ни одного шаблона</Text>
                        </Stack>
                    </Flex>}


                {user?.templatesCreated.filter((template) => template.name.toLowerCase().includes(search.toLowerCase()) || template.description.toLowerCase().includes(search.toLowerCase())).slice((page - 1) * 10, page * 10).map((template) => (
                    <Grid.Col key={template.id} span={{
                        base: 2,
                        md: 1,
                    }}>
                        <TemplateCard name={template.name} description={template.description}
                                      link={`/templates/${template.id}`}/>
                    </Grid.Col>
                ))}

            </Grid>
            {!(user?.templatesCreated.length == 0) &&
                <Flex justify={"center"} mt={40}>
                    <Pagination total={Math.ceil((user?.templatesCreated.filter((template) => template.name.toLowerCase().includes(search.toLowerCase()) || template.description.toLowerCase().includes(search.toLowerCase())).length || 10) / 10)} value={page}
                                onChange={setPage}
                                size={"sm"}/>
                </Flex>
            }
        </>
    )
}