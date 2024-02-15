import {HTMLProps} from "react";
import {Control, UseFormRegister} from "react-hook-form";
import TextField from "@/components/templates/elements/TextField";
import {User} from "@/types/users/user";

export type FieldTypes = "TextField"

export type Template = {
    id: string,
    name: string,
    description: string,
    created: User,
    elements: [],
    createdAt: Date,
    code: string
}


export type FormElement<T extends any> = {
    type: FieldTypes;

    designBtnElement: {
        icon: React.FC;
        label: string;
    };

    construct: (id: string) => FormElementInstance;
    designElement: React.FC<{ instance: FormElementInstance }>;
    formElement: React.FC<{ instance: FormElementInstance } & HTMLProps<T>>;
    propertiesElement: React.FC<{
        instance: FormElementInstance;
        register: UseFormRegister<any>;
        control: Control<any>;
    }>;

    getValues: (
        instance: FormElementInstance,
        value: any
    ) => {
        label: string;
        value: React.FC | any;
        rawValue: string;
    };
};

export type FormElementInstance = {
    uid: string;
    type: FieldTypes;
    extraAttributes?: Record<string, any>;
};

type FormElementsType = Record<FieldTypes, FormElement<any>>;

export const Fields: FormElementsType = {
    TextField: TextField,
    // TextAreaField: TextAreaField,
    // SelectField: SelectField,
};