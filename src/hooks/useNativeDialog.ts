"use client";

import { RefObject, useEffect, useRef } from "react";

/**
 * Opens a native <dialog> element as a modal on mount, and closes it on
 * unmount. Returns the ref to attach to the <dialog> element.
 */
export function useNativeDialog<
  T extends HTMLDialogElement,
>(): RefObject<T | null> {
  const dialogRef = useRef<T>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => {
      dialog?.close();
    };
  }, []);

  return dialogRef;
}
