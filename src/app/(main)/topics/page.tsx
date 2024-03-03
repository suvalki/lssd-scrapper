"use client";
import {PageHeader} from "@/components/pages/PageHeader";
import {Button, Flex, Grid, Loader, TextInput} from "@mantine/core";
import AddTopicForm from "@/blocks/forms/topics-forms/TopicForm";
import {Plus, Search} from "lucide-react";
import {useState} from "react";
import {useInputState} from "@mantine/hooks";
import TemplateCard from "@/components/templates/main/TemplateCard";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {Topic} from "@/types/topics/topic";

export default function Page() {

    const [page, setPage] = useState(1)
    const [search, setSearch] = useInputState("")

    const {data, isLoading} = useQuery({
        queryKey: ["get-topics"],
        queryFn: async () => await axios.get<Topic[]>("/api/forum/topic")
    })

    return (
        <>
            <Flex justify={"space-between"} align={"baseline"} mb={20}>
                <PageHeader>Отслеживаемые темы</PageHeader>
                <AddTopicForm type="create">
                    <Button variant={"subtle"} leftSection={<Plus/>}>Отслеживать</Button>
                </AddTopicForm>
            </Flex>
            {isLoading && !data ? <Flex w={"100%"} justify={"center"} mt={20}><Loader/></Flex> : <>
                <TextInput placeholder={"Поиск"} value={search} onChange={setSearch} leftSection={<Search/>}/>
                <Grid columns={2} mt={20}>
                    {data && data.data.map((topic) => (
                        <Grid.Col key={topic.id} span={{
                            base: 2,
                            md: 1,
                        }}>
                            <TemplateCard name={topic.name} description={`Создано ${topic.forumUserCreated}`} link={`/topics/${topic.id}`}/>
                        </Grid.Col>
                    ))}
                </Grid>
            </>}
        </>
    )
}