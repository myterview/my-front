"use client";

import { FieldOutlineWrapper } from "../components/Form/DefaultTextAreaWrapper";
import { Form } from "../components/Form/Form";
import { Input } from "../components/Form/Input";
import { Popover, PopoverProps } from "../components/Popover/Popover";
import { TechQuestionClient } from "@/api/tech-question.client";
import { CreateForm } from "@ilokesto/sicilian";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import { For } from "@ilokesto/utilinent";
import { useQuery } from "@tanstack/react-query";
import { disassemble } from "es-hangul";

const { register, setValues, getValues, handleSubmit } = new CreateForm({
  initValue: {
    keyword: "",
  },
});

export function TechQuestionTagSearchBar() {
  return (
    <Popover
      position={{ mainAxis: 30, crossAxis: 0, placement: "bottom-start" }}
      anchorElement={(anchorProps) => <TagSearchBar {...anchorProps} />}
      floaterElement={(floaterProps) => <TagSelectOption {...floaterProps} />}
    />
  );
}

function TagSearchBar({ anchor, helper }: PopoverProps["anchorElement"]) {
  function handleClick() {
    helper.setIsOpen(true);
    setTimeout(() => {
      const input = document.getElementById("keyword") as HTMLInputElement;
      input?.focus();
    }, 0);
  }

  return (
    <Form onSubmit={handleSubmit(() => {})}>
      <SicilianProvider value={{ register, name: "keyword" }}>
        <FieldOutlineWrapper>
          <div {...anchor} onClick={handleClick} className="flex-1">
            <Input />
          </div>
        </FieldOutlineWrapper>
      </SicilianProvider>
    </Form>
  );
}

function TagSelectOption({ floater }: PopoverProps["floaterElement"]) {
  const { getTags } = new TechQuestionClient();
  const { data } = useQuery(getTags());
  const keyword = disassemble(getValues("keyword"));
  const filteredTags = data?.filter((tag) =>
    keyword ? disassemble(tag).includes(keyword) : true
  );

  return (
    <div
      {...floater}
      className={"bg-white w-1/2 rounded-[4px] border border-gray-200 p-2"}
    >
      <For each={filteredTags}>{(tag) => <div key={tag}>{tag}</div>}</For>
    </div>
  );
}
