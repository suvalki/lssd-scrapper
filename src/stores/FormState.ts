import {create} from "zustand";
import {FormElementInstance} from "@/types/templates/template";

type Props = {
    elements: FormElementInstance[],
    templateSettings: {
        name: string,
        description?: string,
        code: string
    }
    addElement: (element: FormElementInstance) => void
    deleteElement: (element: FormElementInstance) => void
    updateElement: (element: FormElementInstance, uid: string) => void,
    updateSettings: (settings: Props["templateSettings"]) => void,
    init: (elements: FormElementInstance[], settings: Props["templateSettings"]) => void,
    clear: () => void
}

const FormState = create<Props>((set) => ({
    elements: [],
    templateSettings: {
        name: "",
        description: undefined,
        code: ""
    },
    addElement: (element: FormElementInstance) => set((state: {
        elements: FormElementInstance[]
    }) => ({elements: [...state.elements, element]})),
    deleteElement: (element: FormElementInstance) => set((state: {
        elements: FormElementInstance[]
    }) => ({elements: state.elements.filter(el => el.uid !== element.uid)})),
    updateElement: (element: FormElementInstance, uid: string) => set((state: {
        elements: FormElementInstance[]
    }) => {
        const index = state.elements.findIndex(el => el.uid === uid)
        return {elements: state.elements.map((el, i) => i === index ? element : el)}
    }),
    updateSettings: (settings: Props["templateSettings"]) => set(() => ({templateSettings: settings})),
    init: (elements: FormElementInstance[], settings: Props["templateSettings"]) => set(() => ({elements, templateSettings: settings})),
    clear: () => set(() => ({elements: [], templateSettings: {name: "", description: "", code: ""}}))
}))

export const useFormState = () => FormState((state) => state)