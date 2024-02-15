import {Fields, FormElementInstance} from "@/types/templates/template";
import {useDisclosure} from "@mantine/hooks";
import {Button, Flex, Modal} from "@mantine/core";
import {useForm} from "react-hook-form";
import {useFormState} from "@/stores/FormState";

export default function EditModal({instance, children}: {instance: FormElementInstance, children: React.ReactNode}) {
    const {updateElement} = useFormState();
    const [opened, { open, close }] = useDisclosure(false);

    const {register, control, handleSubmit} = useForm({
        defaultValues: {
            ...instance.extraAttributes
        }
    })

    const onSubmit = (data: any) => {
        updateElement({...instance, extraAttributes: data}, instance.uid)
        close()
    }

    return <>
        <div onClick={open}>{children}</div>
        <Modal opened={opened} onClose={close} title={"Редактирование: " + instance.extraAttributes?.label}>
            {Fields[instance.type].propertiesElement({instance, register, control})}
            <Flex justify={"space-between"} align={"center"} mt={20}>
                <Button variant={"subtle"} color={"red"} onClick={close}>Закрыть</Button>
                <Button onClick={handleSubmit(onSubmit)}>Сохранить</Button>
            </Flex>
        </Modal>
    </>
}