import { useNavigation } from "react-router"
import { Outlet } from "react-router"
import { LoadSpinner } from "./LoadSpinner";

export const Root = () => {
    const navigation = useNavigation();

    const isNavigationLoading = navigation.state === "loading";

    return (
        <main>
            {isNavigationLoading && (
                <LoadSpinner />
            )}
            <Outlet />
        </main>
    )
}