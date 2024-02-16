"use client";
import {Fields} from "@/types/templates/template";
import {Grid} from "@mantine/core";
import ElementButton from "@/components/templates/create-page/components/ElementButton";
import {useFormState} from "@/stores/FormState";

export default function ButtonsSideBar() {
    const {addElement, elements} = useFormState()

    return (
        <>
            <div>
                <Grid columns={2} style={{
                    border: "1px solid rgba(256,256,256, 0.1)",
                    borderRadius: "0.3rem",
                    paddingRight: "0.3rem",
                    paddingLeft: "0.3rem",
                    paddingTop: "0.3rem",
                    paddingBottom: "0.3rem",
                }}>
                    <Grid.Col span={2}>
                        <ElementButton element={Fields.TextField}
                                       onClick={() => addElement(Fields.TextField.construct(
                                           (Math.random() * 100000).toFixed().toString()
                                       ))}/>
                        <ElementButton element={Fields.TextArea}
                                       onClick={() => addElement(Fields.TextArea.construct(
                                           (Math.random() * 100000).toFixed().toString()
                                       ))}/>
                    </Grid.Col>
                </Grid>
            </div>
        </>
    )
}