"use client";
import Quill from "quill";
import { useRef, useState } from "react";
import Editor from "./Editor";

const Delta = Quill.import("delta");

const QuillTextBox = ({ onChange, value }) => {
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();

  // Use a ref to access the quill instance directly
  const quillRef = useRef();
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline"],
    ["link", "image"],
    [{ list: "ordered" }, { list: "bullet" }],
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],
  ];
  return (
    <div>
      <Editor
        ref={quillRef}
        defaultValue={new Delta()}
        onSelectionChange={setRange}
        onTextChange={setLastChange}
        toolbarOptions={toolbarOptions}
        wrapperclassName="quill-wrapper"
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default QuillTextBox;
