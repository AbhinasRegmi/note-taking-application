import { PropsWithChildren } from "react";

export function Center(props: PropsWithChildren) {
  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      {props.children}
    </div>
  );
}
