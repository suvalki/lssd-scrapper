import {MainNavbar} from "@/components/navigation/public/MainNavbar";
import {Container} from "@mantine/core";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div>
            <MainNavbar/>
            <Container>{children}</Container>

        </div>
    )
}