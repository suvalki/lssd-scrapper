import {User} from "@/types/users/user";
import {create} from "zustand";
import {unstable_batchedUpdates} from "react-dom";


type Props = {
    user: User | undefined,
    login: (user: User) => void,
    logout: () => void,
    can: (name: string) => boolean
}

const UserState = create<Props>((set, get) => {
    return ({
        user: undefined,
        login: (user: User) => set(() => ({user})),
        logout: () => set(() => ({user: undefined})),
        can: (name: string) => {
            const user = get().user
            if (user) {
                return user.role.permissions.some(el => el.name === name)
            }
            return false
        }
    });
})

export const useUser = () => UserState((state) => state)