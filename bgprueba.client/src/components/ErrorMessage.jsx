import { ExclamationCircle } from "react-bootstrap-icons";

export function ErrorMessage({ errors }) {
    return (
        <>
            {errors && (<div className="text-danger align-middle"><ExclamationCircle /> {errors.message ?? errors}</div>)}
        </>
    );
}