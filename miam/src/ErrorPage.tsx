import { useRouteError } from "react-router-dom";

interface ErrorStatus {
  statusText: string;
}

export default function ErrorPage() {
  const error = useRouteError() as Error | ErrorStatus;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{"statusText" in error ? String(error.statusText) : ""}</i>
        <i>{"error" in error ? String(error.error) : ""}</i>
        <i>{"message" in error ? String(error.message) : ""}</i>
        <i>{"data" in error ? String(error.data) : ""}</i>
      </p>
    </div>
  );
}
