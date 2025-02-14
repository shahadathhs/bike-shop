import { isRouteErrorResponse, redirect, useLoaderData } from "react-router";
import type { Route } from "../routes/+types/about";

export function meta() {
  return [{ title: "About" }, { name: "description", content: "About page" }];
}

export default function About() {
  const loaderData = useLoaderData();
  console.log("loaderData", loaderData);
  return <div>About</div>;
}

export const clientLoader = async () => {
  // return {
  //   message: "Hello from client loader",
  // };
  if (true) {
    return redirect("/");
  } else {
    return {
      message: "Hello from client loader",
    };
  }
};

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
