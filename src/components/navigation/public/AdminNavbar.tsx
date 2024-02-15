import {NavigationLink} from "@/components/navigation/helpers/NavigationLink";
import {usePathname} from "next/navigation";
import {useUser} from "@/stores/User";

export default function AdminNavbar() {

    const pathName = usePathname()
    const {can} = useUser()

    const menuItems = {
        invites: "Пригласить",
    }
    return (
        <div>
            {Object.entries(menuItems).map(([key, value]) => (
                can(`admin.${key}.read`) && <NavigationLink key={key} title={value} link={`admin/${key}`} active={pathName == `/admin/${key}`}/>
            ))}
        </div>
    )
}