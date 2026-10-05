"use client";

import { useActionState } from "react";
import { createCmsOwner, type CmsSetupState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CmsSetupForm() {
  const [state, action, pending] = useActionState<CmsSetupState, FormData>(
    createCmsOwner,
    {},
  );

  return (
    <form action={action} className="mt-6 max-w-md space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="cms-password" className="text-sm font-medium">
          New CMS password
        </label>
        <Input
          id="cms-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={14}
          maxLength={128}
          required
          aria-describedby="cms-password-help"
        />
        <p id="cms-password-help" className="text-muted-foreground text-xs">
          Use at least 14 characters. Save it in your password manager.
        </p>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="cms-confirmation" className="text-sm font-medium">
          Confirm CMS password
        </label>
        <Input
          id="cms-confirmation"
          name="confirmation"
          type="password"
          autoComplete="new-password"
          minLength={14}
          maxLength={128}
          required
        />
      </div>
      {state.error ? (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Creating account…" : "Create CMS account"}
      </Button>
    </form>
  );
}
