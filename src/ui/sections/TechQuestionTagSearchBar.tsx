"use client";

import { Clickable } from "../components/Clickable/Clickable";
import { FieldOutlineWrapper } from "../components/Form/DefaultTextAreaWrapper";
import { Form } from "../components/Form/Form";
import { Input } from "../components/Form/Input";
import { DropdownOption } from "../components/Popover/Dropdown/DropdownOption";
import { Popover, PopoverProps } from "../components/Popover/Popover";
import { TechQuestionClient } from "@/api/tech-question.client";
import { useComponentSize } from "@/shared/utils/useComponentSize";
import { useQueryParams } from "@/shared/utils/useQueryParams";
import { CreateForm } from "@ilokesto/sicilian";
import { SicilianProvider } from "@ilokesto/sicilian/provider";
import { For, Show } from "@ilokesto/utilinent";
import { useQuery } from "@tanstack/react-query";
import { disassemble } from "es-hangul";
import Image from "next/image";

const { register, getValues } = new CreateForm({
  initValue: {
    keyword: "",
  },
});

export function TechQuestionTagSearchBar() {
  const [ref, size] = useComponentSize<HTMLFormElement>();
  const { selectedQueryParams, handleClick } = useQueryParams("tag");

  return (
    <>
      <Form ref={ref} onSubmit={(e) => e.preventDefault()}>
        <SicilianProvider value={{ register, name: "keyword" }}>
          <FieldOutlineWrapper className="px-24 py-12 gap-30 items-center">
            <Image
              src="/icons/search.svg"
              alt="Search Icon"
              width={24}
              height={24}
              draggable={false}
            />

            <Popover
              position={{
                mainAxis: 24,
                crossAxis: -80,
                placement: "bottom-start",
              }}
              anchorElement={(anchorProps) => <TagSearchBar {...anchorProps} />}
              floaterElement={(floaterProps) => (
                <TagSelectOption width={size.width} {...floaterProps} />
              )}
            />

            <TagSortOptionButton />
          </FieldOutlineWrapper>
        </SicilianProvider>
      </Form>

      <TagArray
        array={selectedQueryParams}
        selectedArray={selectedQueryParams}
        handleClick={handleClick}
      />
    </>
  );
}

function TagArray({
  array,
  selectedArray,
  handleClick,
}: {
  array: string[] | undefined;
  selectedArray: string[] | undefined;
  handleClick: (tag: string) => void;
}) {
  return (
    <Show when={array && array.length > 0}>
      <div className="flex flex-row flex-wrap gap-16">
        <For each={array}>
          {(tag) => {
            const isSelected = selectedArray!.includes(tag);
            return (
              <Clickable
                types="selectable"
                data-selected={isSelected}
                key={tag}
              >
                <button type="button" onClick={() => handleClick(tag)}>
                  {tag}
                </button>
              </Clickable>
            );
          }}
        </For>
      </div>
    </Show>
  );
}

function TagSearchBar({ anchor, helper }: PopoverProps["anchorElement"]) {
  return (
    <div
      {...anchor}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => {
        helper.setIsOpen(true);
        setTimeout(() => {
          const input = document.getElementById("keyword") as HTMLInputElement;
          input?.focus();
        }, 0);
      }}
      className="flex-1"
    >
      <Input placeholder="찾고 싶은 문제가 있나요?" className="dropdown" />
    </div>
  );
}

function TagSelectOption({
  floater,
  width,
}: PopoverProps["floaterElement"] & { width: number }) {
  const { selectedQueryParams, handleClick } = useQueryParams("tag");
  const { getTags } = new TechQuestionClient();
  const { data } = useQuery(getTags());
  const keyword = disassemble(getValues("keyword"));
  const filteredTags = data?.filter((tag) =>
    keyword ? disassemble(tag).includes(keyword) : true
  );

  return (
    <div
      {...floater}
      style={{ ...floater.style, width }}
      className={
        "bg-white rounded-[4px] border border-gray-200 overflow-y-scroll p-16"
      }
    >
      <TagArray
        array={filteredTags}
        selectedArray={selectedQueryParams}
        handleClick={handleClick}
      />
    </div>
  );
}

function DropdownButton({
  anchor,
  children,
}: PopoverProps["anchorElement"] & { children: React.ReactNode }) {
  return (
    <button
      type="button"
      {...anchor}
      className="flex items-center justify-center gap-4 dropdown-input text-primary-600 bg-primary-100 rounded-xl px-12"
    >
      {children}
    </button>
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
      position={{ mainAxis: 8, crossAxis: 0, placement: "bottom-end" }}
      anchorElement={(anchorProps) => (
        <DropdownButton {...anchorProps}>
          {selectedOption}
          <Image
            src="/icons/dropdownArrow.svg"
            alt="Dropdown Icon"
            width={24}
            height={24}
            draggable={false}
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
