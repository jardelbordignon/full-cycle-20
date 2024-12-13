"use client";

import { type PropsWithChildren, useActionState } from "react";
import { createRouteAction } from "../logic/actions";

export type ActionState = {
  error?: string;
  success?: boolean;
};

export function NewRouteForm(props: PropsWithChildren) {
  const [state, action] = useActionState<ActionState, FormData>(
    createRouteAction,
    {}
  );

  return (
    <form action={action}>
      {state?.error && (
        <div className="p-4 border rounded text-contrast bg-error">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="p-4 border rounded text-contrast bg-success">
          Rota criada com sucesso!
        </div>
      )}
      {props.children}
    </form>
  );
}
