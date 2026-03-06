import { isRouteErrorResponse, Link, useRouteError } from "react-router"

export const ErrorPage = () => {
    const error = useRouteError();
    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        errorMessage = error.statusText || "Route Error";
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else {
        errorMessage = "Unknown error occured";
    }

    return (
        <div style={{ padding: '2rem', textAlign: 'center', border: '2px solid red', margin: '1rem' }}>
            <h1>Oops! Something went wrong</h1>
            <p>{errorMessage}</p>
            <Link to='/home'>back to blog list</Link>
        </div>
    )
}