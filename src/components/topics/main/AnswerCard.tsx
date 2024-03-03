import { ActionIcon, Card, Flex, Group, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Pen, Trash } from "lucide-react";
import EditTopicForm from "@/blocks/forms/topics-forms/TopicForm";
import { Topic } from "@/types/topics/topic";
import { Answer } from "@/types/topics/answer";
import { modals } from "@mantine/modals";

export default function AnswerCard({
  data,
  index,
}: {
  data: Answer;
  index: number;
}) {
  const { id, name, createdAt } = data;

  const createdDate = new Date(createdAt);

  return (
    <>
      <Card>
        <Flex justify={"space-between"} align={"center"}>
          <Stack gap={2}>
            <Text>
              № {index} | {name}
            </Text>
            <Text opacity={0.5}>
              Создано {createdDate.toLocaleDateString()}
            </Text>
          </Stack>
          <Group>
            {/* @ts-ignore */}
            <DeleteIcon id={id} topicId={data.topicId} />
          </Group>
        </Flex>
      </Card>
    </>
  );
}

function DeleteIcon({ id, topicId }: { id: number; topicId: number }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: [`delete-answer-${id}`],
    mutationFn: async () => await axios.delete(`/api/forum/topic/answer/${id}`),
    onSuccess: () => {
      notifications.show({
        title: "Успешно",
        message: "Ответ удален",
        color: "green",
      });
      queryClient.invalidateQueries({
        queryKey: [`topic-${topicId}`],
      });
    },
  });

  const showConfirm = () =>
    modals.openConfirmModal({
      title: "Удаление ответа",
      children: (
        <Text>
          Вы уверены, что хотите удалить этот ответ? (Ответ также удалиться на
          форуме)
        </Text>
      ),
      labels: {
        confirm: "Удалить",
        cancel: "Отмена",
      },
      confirmProps: {
        color: "red",
      },
      onConfirm: () => mutate(),
    });

  return (
    <ActionIcon
      variant={"subtle"}
      color={"red"}
      loading={isPending}
      onClick={showConfirm}
    >
      <Trash />
    </ActionIcon>
  );
}
