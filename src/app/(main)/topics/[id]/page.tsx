"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Topic } from "@/types/topics/topic";
import { useRouter } from "next/navigation";
import {
  ActionIcon,
  Button,
  Combobox,
  Flex,
  Grid,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { PageHeader } from "@/components/pages/PageHeader";
import { Pen, Plus, Trash } from "lucide-react";
import AnswerCard from "@/components/topics/main/AnswerCard";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import AnswerForm from "@/blocks/forms/topics-forms/AnswerForm";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: [`topic-${id}`],
    queryFn: async () => await axios.get<Topic>(`/api/forum/topic/${id}`),
  });

  const router = useRouter();

  if (!data?.data && !isLoading) {
    return router.push("/topics");
  }

  return (
    <>
      {isLoading && !data ? (
        <Flex w={"100%"} justify={"center"} mt={20}>
          <Loader />
        </Flex>
      ) : (
        data && (
          <>
            <Flex mb={20} justify={"space-between"} align={"baseline"}>
              <Stack gap={2}>
                <PageHeader>{data.data.name}</PageHeader>
                <Text opacity={0.5}>
                  Автор темы: {data.data.forumUserCreated}
                </Text>
                <Text opacity={0.5}>
                  Всего ответов: {data.data.answers}{" "}
                  {data.data.pages - 1 > 0 && `(страниц: ${data.data.pages})`}
                </Text>
              </Stack>

              <Group gap={20}>
                <DeleteIcon id={data.data.id} />
                <AnswerForm topic={data.data}>
                  <Button variant={"subtle"} leftSection={<Plus />}>
                    Добавить ответ
                  </Button>
                </AnswerForm>
              </Group>
            </Flex>

            {data.data.topicAnswers.length < 1 && (
              <Flex w={"100%"} justify={"center"} mt={20}>
                <Text opacity={0.5}>Вы не отправили ни одного ответа</Text>
              </Flex>
            )}

            <Grid columns={2}>
              {data.data.topicAnswers.map((answer, index) => (
                <Grid.Col
                  key={answer.id}
                  span={{
                    base: 2,
                    sm: 1,
                  }}
                >
                  <AnswerCard index={index+1} data={answer} />
                </Grid.Col>
              ))}
            </Grid>
          </>
        )
      )}
    </>
  );
}

function DeleteIcon({ id }: { id: number }) {
  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: [`delete-topic-${id}`],
    mutationFn: async () => await axios.delete(`/api/forum/topic/${id}`),
    onSuccess: () => {
      notifications.show({
        title: "Успешно",
        message: "Топик удален",
        color: "green",
      });
      queryClient.invalidateQueries({
        queryKey: ["topic"],
      });
      return router.push("/topics");
    },
  });

  const showConfirm = () =>
    modals.openConfirmModal({
      title: "Удалить топик?",
      children: <Text>Вы уверены, что хотите удалить этот топик?</Text>,
      labels: {
        confirm: "Удалить",
        cancel: "Отмена",
      },
      onConfirm: () => mutate(),
      confirmProps: { color: "red" },
    });

  return (
    <ActionIcon
      variant={"subtle"}
      color={"red"}
      loading={isPending}
      onClick={() => showConfirm()}
    >
      <Trash />
    </ActionIcon>
  );
}
