"use client";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";

// Editor is an uncontrolled React component
const Editor = forwardRef(
  (
    {
      defaultValue,
      onTextChange,
      onSelectionChange,
      toolbarOptions,
      wrapperClass,
      onChange,
      value,
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
        placeholder: "Type something",
      });

      ref.current = quill;
      if (defaultValueRef.current) {
        quill.setContents();
      }
      if (!!value) {
        quill.clipboard.dangerouslyPasteHTML(0, value);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
        if (onChange) {
          onChange(containerRef.current.querySelector(".ql-editor").innerHTML);
        }
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
        if (onChange) {
          onChange(containerRef.current.querySelector(".ql-editor").innerHTML);
        }
      });

      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref, value]);

    return <div className={wrapperClass} ref={containerRef}></div>;
  }
);

Editor.displayName = "Editor";

export default Editor;
