"use client";
import {FormElement, FormElementInstance} from "@/types/templates/template";
import {TextIcon} from "lucide-react";
import {Center, Checkbox, Grid, Group, TextInput} from "@mantine/core";
import React, {HTMLProps} from "react";
import {Control, UseFormRegister} from "react-hook-form";

function DesignElement ({instance}: { instance: FormElementInstance }) {
    return <>
        {instance.extraAttributes?.label}
    </>
}

function FormElement ({instance, value, onChange, ...props}: { instance: FormElementInstance } & HTMLProps<typeof TextInput>) {
    return <>
        <TextInput {...instance.extraAttributes}
                   id={instance.uid}
                   // @ts-ignore
                   onChange={onChange}
                   value={value}
                   w={"100%"}
                   {...props} />
    </>
}

function PropertiesElement ({instance, register, control}: { instance: FormElementInstance, register: UseFormRegister<any>, control: Control<any> }) {
    return <>
        <form>
            <Grid columns={2} justify={"center"} align={"baseline"}>
                <Grid.Col span={1}>
                    <TextInput label={"Название поля"} {...register("label")} required />
                </Grid.Col>
                <Grid.Col span={1}>
                    <TextInput label={"Вспомогательный текст"} {...register("description")} />
                </Grid.Col>
                <Grid.Col span={2}>
                    <TextInput label={"Значение по умолчанию"} {...register("defaultValue")} />
                </Grid.Col>
                <Grid.Col span={1}>
                    <Checkbox label={"Обязательно"} {...register("required")} />
                </Grid.Col>
                <Grid.Col span={1}>
                    <Checkbox label={"Отключено"} {...register("disabled")} />
                </Grid.Col>
            </Grid>
        </form>
    </>
}

const TextField:FormElement<typeof TextInput> = {
        type: "TextField",
        designBtnElement: {
            icon: () => <TextIcon/>,
            label: "Текст",
        },
        construct: (id: string) => {
            return {
                uid: id,
                type: "TextField",
                extraAttributes: {
                    label: "Текстовое поле",
                    defaultValue: "",
                    description: "123",
                    required: true,
                    disabled: false,
                },
            }
        },
        designElement: DesignElement,
        formElement: FormElement,
        propertiesElement: PropertiesElement,
        getValues: (instance, value) => {
            return {
                label: "TextField",
                value: () => <></>,
                rawValue: value || "",
            }
        },
    }

    export default TextField