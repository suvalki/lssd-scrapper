import { useUser } from "@/stores/User";
import { Fields, FormElementInstance } from "@/types/templates/template";
import { Answer } from "@/types/topics/answer";
import { Topic } from "@/types/topics/topic";
import { replacer } from "@/utils/text-helpers/replacer";
import {
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export default function AnswerForm({
  children,
  topic,
}: {
  children: React.ReactNode;
  topic: Topic;
}) {
  const [opened, { open, close }] = useDisclosure();

  const match = useMediaQuery("( max-width: 992px )");

  const { user } = useUser();

  const queryClient = useQueryClient();

  const [type, setType] = useState("template");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    unregister,
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationKey: ["send-message-template"],
    mutationFn: async (data: any) =>
      await axios.post("/api/forum/topic/answer", data),
    onSuccess: () => {
      notifications.show({
        title: "Успешно",
        message: "Ответ успешно отправлен",
        color: "green",
      });
      close();
      queryClient.invalidateQueries({ queryKey: [`topic-${topic.id}`] });
    },
    onError: (data: AxiosError) => {
      if (data.response?.status == 404) {
        notifications.show({
          title: "Ошибка",
          message: "Тема не найдена",
          color: "red",
        });
      }
    },
  });

  const values = useWatch({
    control: control,
  });

  const codeReplacer = (data: Record<string, string>) => {
    const fields = {
      ...JSON.parse(
        // @ts-ignore
        user?.templates.filter(
          (template) => Number(template.id) === Number(values.template)
        )[0].elements
      )
        .map((element: FormElementInstance) => {
          const field: {} = {};
          // @ts-ignore
          field[element.uid as keyof typeof field] = Fields[
            element.type as keyof typeof Fields
          ].getValues(element, values[element.uid + "-field"]).rawValue;
          return { ...field };
        })
        .reduce((acc: any, curr: any) => ({ ...acc, ...curr })),
    };

    const code = replacer({
      // @ts-ignore
      content: user?.templates.filter(
        (template) => Number(template.id) === Number(values.template)
      )[0].code,
      data: {
        ...fields,
        date: {
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        user: {
          name: user?.name,
        },
        recipient: values.recipients,
        forum: {
          name: user?.forumAccounts.filter((account) => account.active)[0]
            .login,
        },
      },
    });

    return code;
  };

  const onSubmit = (data: Record<string, string>) => {
    if (type == "template") {
      const code = codeReplacer(data);

      mutate({
        message: code,
        topic: topic.id,
        name: data.name,
      });
    }

    if (type == "message") {
      mutate({
        message: data.message,
        topic: topic.id,
        name: data.name,
      });
    }
  };

  useEffect(() => {
    if (values.template) {
      // @ts-ignore
      Object.keys(values).forEach((key) => {
        if (
          key != "template" &&
          !JSON.parse(
            // @ts-ignore
            user?.templates.filter(
              (template) => Number(template.id) === Number(values.template)
            )[0].elements
          ).some((el: FormElementInstance) => `${el.uid}-field` == key)
        ) {
          unregister(key);
        }
      });
    }
  }, [values.template]);

  return (
    <>
      <div onClick={open}>{children}</div>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Flex w={"100%"} align={"center"}>
            <div>
              <Text>Отправить ответ</Text>
            </div>
            <div>
              <SegmentedControl
                ml={12}
                data={[
                  { label: "Шаблон", value: "template" },
                  { label: "Без шаблона", value: "message" },
                ]}
                value={type}
                onChange={(value) => setType(value)}
              />
            </div>
          </Flex>
        }
      >
        <Stack gap={10}>
          {type == "template" ? (
            <>
              <Controller
                render={({ field }) => (
                  <Select
                    label="Шаблон"
                    w={"100%"}
                    placeholder={"Выберите шаблон"}
                    data={
                      user?.templates && [
                        ...user?.templates?.map((template) => ({
                          value: String(template.id),
                          label: template.name,
                        })),
                      ]
                    }
                    searchable
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
                control={control}
                name={"template"}
                rules={{
                  required: "Выберите шаблон",
                }}
              />
              {values.template && (
                <>
                  <TextInput
                    label="Название ответа"
                    placeholder="Укажите название ответа"
                    {...register("name", {
                      required: "Укажите название ответа",
                    })}
                    // @ts-ignore
                    error={errors.name?.message}
                  />
                  <Divider mt={10} />
                  <Grid columns={!match ? 2 : 1} grow>
                    {JSON.parse(
                      // @ts-ignore
                      user?.templates.filter(
                        (template) =>
                          Number(template.id) === Number(values.template)
                      )[0].elements
                    ).map((el: FormElementInstance) => {
                      return (
                        <Grid.Col key={el.uid} span={1}>
                          <Controller
                            render={({ field }) =>
                              Fields[el.type].formElement({
                                instance: el,
                                value: field.value,
                                onChange: field.onChange,
                                // @ts-ignore
                                error: errors[el.uid + "-field"]?.message,
                              }) as ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            }
                            name={`${el.uid}-field`}
                            control={control}
                            rules={{
                              required: el.extraAttributes?.required
                                ? "Заполните поле"
                                : false,
                            }}
                          />
                        </Grid.Col>
                      );
                    })}
                  </Grid>
                </>
              )}
            </>
          ) : (
            <>
              <TextInput
                label="Название ответа"
                placeholder="Укажите название ответа"
                {...register("name", { required: "Укажите название ответа" })}
              />
              <Divider mt={10} />
              <Textarea
                label="Сообщение"
                placeholder="Укажите сообщение"
                {...register("message", { required: "Укажите сообщение" })}
                autosize
                resize={"vertical"}
              />
            </>
          )}
          <Flex justify={"space-between"} align={"center"}>
            <Button color={"red"} variant={"subtle"}>
              Отменить
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              loading={isPending}
              disabled={type == "template" && !values.template}
            >
              Отправить
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}
