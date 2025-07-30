"use client";

import { Clickable } from "../components/Clickable/Clickable";
import { FieldOutlineWrapper } from "../components/Form/DefaultTextAreaWrapper";
import { Form } from "../components/Form/Form";
import { Input } from "../components/Form/Input";
import { DropdownOption } from "../components/Popover/Dropdown/DropdownOption";
import { Popover, PopoverProps } from "../components/Popover/Popover";
import { TechQuestionClient } from "@/api/tech-question.client";
import { useQueryParams } from "@/shared/utils/useQueryParams";
import { CreateForm } from "@ilokesto/sicilian";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import { For } from "@ilokesto/utilinent";
import { useQuery } from "@tanstack/react-query";
import { disassemble } from "es-hangul";
import Image from "next/image";

const { register, getValues, handleSubmit } = new CreateForm({
  initValue: {
    keyword: "",
  },
});

function TechQuestionTagSearchBar() {
  return (
    <Popover
      position={{ mainAxis: 24, crossAxis: 79, placement: "bottom-start" }}
      anchorElement={(anchorProps) => (
        <div
          {...anchorProps.anchor}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            anchorProps.helper.setIsOpen(true);
            setTimeout(() => {
              const input = document.getElementById(
                "keyword"
              ) as HTMLInputElement;
              input?.focus();
            }, 0);
          }}
          className="flex-1"
        >
          <Input placeholder="찾고 싶은 문제가 있나요?" className="dropdown" />
        </div>
      )}
      floaterElement={(floaterProps) => <TagSelectOption {...floaterProps} />}
    />
  );
}

export function TagSearchBar() {
  return (
    <Form onSubmit={handleSubmit(() => {})}>
      <SicilianProvider value={{ register, name: "keyword" }}>
        <FieldOutlineWrapper className="px-24 py-12 gap-30 items-center">
          <Image
            src="/icons/search.svg"
            alt="Search Icon"
            width={24}
            height={24}
          />
          <TechQuestionTagSearchBar />
          <TagSortOptionButton />
        </FieldOutlineWrapper>
      </SicilianProvider>
    </Form>
  );
}

function DropdownButton({
  anchor,
  children,
}: PopoverProps["anchorElement"] & { children: React.ReactNode }) {
  return (
    <div
      {...anchor}
      className="flex items-center justify-center gap-4 dropdown-input text-primary-600 bg-primary-100 rounded-xl px-12"
    >
      {children}
    </div>
  );
}

function TagSortOptionButton() {
  const { selectedQueryParams, handleClick } = useQueryParams(
    "tq-option",
    true
  );
  const selectedOption = selectedQueryParams[0] || "전체 질문";
  return (
    <Popover
      position={{ mainAxis: 8, crossAxis: 10, placement: "bottom-end" }}
      anchorElement={(anchorProps) => (
        <DropdownButton {...anchorProps}>
          {selectedOption}
          <Image
            src="/icons/dropdownArrow.svg"
            alt="Dropdown Icon"
            width={24}
            height={24}
          />
        </DropdownButton>
      )}
      floaterElement={(floaterProps) => (
        <DropdownOption
          {...floaterProps}
          options={["전체 질문", "북마크", "답변한 질문"]}
          selectedOption={selectedOption}
          setSelectedOption={handleClick}
        />
      )}
    />
  );
}

function TagSelectOption({ floater, helper }: PopoverProps["floaterElement"]) {
  const { getTags } = new TechQuestionClient();
  const { data } = useQuery(getTags());
  const keyword = disassemble(getValues("keyword"));
  const filteredTags = data?.filter((tag) =>
    keyword ? disassemble(tag).includes(keyword) : true
  );
  const { selectedQueryParams, handleClick } = useQueryParams("tag");

  return (
    <div
      {...floater}
      style={{ ...floater.style, width: (helper.anchorWidth as number) + 158 }}
      className={
        "bg-white rounded-[4px] flex border border-gray-200 overflow-y-scroll p-16 gap-16 flex-row flex-wrap"
      }
    >
      <For each={filteredTags}>
        {(tag) => {
          const isSelected = selectedQueryParams.includes(tag);
          return (
            <Clickable types="selectable" data-selected={isSelected} key={tag}>
              <button type="button" onClick={() => handleClick(tag)}>
                {tag}
              </button>
            </Clickable>
          );
        }}
      </For>
    </div>
  );
}
