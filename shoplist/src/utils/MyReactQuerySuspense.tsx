import { PropsWithChildren } from "react";

const MyReactQuerySuspense = ({
  children,
  isPending,
  error,
}: PropsWithChildren<{ isPending: boolean; error: Error | null }>) => {
  if (isPending) {
    return "Loading...";
  }

  if (error) {
    return "An error has occurred: " + error.message;
  }

  return <div>{children}</div>;
};

export default MyReactQuerySuspense;
