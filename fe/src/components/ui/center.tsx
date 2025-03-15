import { PropsWithChildren } from "react";

export function Center(props: PropsWithChildren) {

  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
      {props.children}
    </div>
  );
}
