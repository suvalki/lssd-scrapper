import { useFormState } from "@/stores/FormState";
import { Controller, useForm } from "react-hook-form";
import {
  Checkbox,
  Divider,
  Flex,
  Grid,
  Group,
  Kbd,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { TemplateSettingsFormSchema } from "@/schemas/templates-forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import SettingsStats from "@/components/templates/create-page/components/SettingsStats";
import { useUser } from "@/stores/User";

export default function TemplateSetting() {
  const { updateSettings, templateSettings, elements } = useFormState();

  const { can } = useUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    values: {
      ...templateSettings,
    },
    mode: "onBlur",
    resolver: yupResolver(TemplateSettingsFormSchema),
  });

  const onSubmit = (data: InferType<typeof TemplateSettingsFormSchema>) => {
    updateSettings(data);
  };

  return (
    <>
      <form onBlur={handleSubmit(onSubmit)}>
        {can("templates.forAll") && (

           <Controller 
                name={"forAll"}
                control={control}
                render={({field: {
                    onChange,
                    value
                }}) => 
                    (<Checkbox label={"Шаблон для всех"} checked={value} onChange={onChange} mb={20} />)
                }
            /> 
        )}

        <Grid columns={2}>
          <Grid.Col span={1}>
            <TextInput
              label={"Название шаблона"}
              {...register("name")}
              error={errors.name?.message}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <TextInput
              label={"Описание шаблона"}
              {...register("description")}
              error={errors.description?.message}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Flex>
              <Textarea
                label={"Код шаблона"}
                {...register("code")}
                error={errors.code?.message}
                w={"100%"}
                autosize
                resize={"vertical"}
                h={"100%"}
              />
              <Grid w={"fit-content"} mx={20} columns={2} align={"center"}>
                {elements.map((element) => (
                  <Grid.Col key={element.uid} span={1}>
                    <SettingsStats
                      title={element.extraAttributes?.label}
                      value={element.uid}
                    />
                  </Grid.Col>
                ))}
                <Grid.Col span={2}>
                  <Divider />
                </Grid.Col>
                <Grid.Col span={1}>
                  <SettingsStats
                    title={"Имя форумного аккаунта"}
                    value={"forum.name"}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <SettingsStats title={"Имя аккаунта"} value={"user.name"} />
                </Grid.Col>
                <Grid.Col span={1}>
                  <SettingsStats title={"Дата отправки"} value={"date.date"} />
                </Grid.Col>
                <Grid.Col span={1}>
                  <SettingsStats title={"Время отправки"} value={"date.time"} />
                </Grid.Col>
                <Grid.Col span={2}>
                  <Divider />
                </Grid.Col>
                <Grid.Col span={2}>
                  <SettingsStats
                    title={"Функция верхнего регистра"}
                    value={"upperCase(значение)"}
                  />
                </Grid.Col>
              </Grid>
            </Flex>
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
}
