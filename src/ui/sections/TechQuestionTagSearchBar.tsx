"use client";

import { Clickable } from "../components/Clickable/Clickable";
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
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const { register, setValues, getValues, handleSubmit } = new CreateForm({
  initValue: {
    keyword: "",
  },
});

export function TechQuestionTagSearchBar() {
  return (
    <Popover
      position={{ mainAxis: 25, crossAxis: 25, placement: "bottom-start" }}
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
        <FieldOutlineWrapper className="px-24 py-12 gap-30 items-center">
          <Image
            src="/icons/search.svg"
            alt="Search Icon"
            width={24}
            height={24}
          />
          <div {...anchor} onClick={handleClick} className="flex-1">
            <Input
              placeholder="찾고 싶은 문제가 있나요?"
              className="dropdown"
            />
          </div>
        </FieldOutlineWrapper>
      </SicilianProvider>
    </Form>
  );
}

function TagSelectOption({ floater, helper }: PopoverProps["floaterElement"]) {
  const { getTags } = new TechQuestionClient();
  const { data } = useQuery(getTags());
  const keyword = disassemble(getValues("keyword"));
  const filteredTags = data?.filter((tag) =>
    keyword ? disassemble(tag).includes(keyword) : true
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  // 여러 태그 지원: tag=foo&tag=bar 형태
  const selectedTags = searchParams.getAll("tags");

  const handleTagClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const tag = e.currentTarget.textContent!;
    console.log(tag);

    const params = new URLSearchParams(searchParams.toString());
    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      // 이미 선택된 태그면 모두 삭제 후 나머지만 append
      params.delete("tags");
      selectedTags
        .filter((t) => t !== tag)
        .forEach((t) => params.append("tags", t));
    } else {
      params.append("tags", tag);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div
      {...floater}
      style={{ width: (helper.anchorWidth as number) + 104, ...floater.style }}
      className={
        "bg-white rounded-[4px] flex border border-gray-200 overflow-y-scroll p-16 gap-16 flex-row flex-wrap"
      }
    >
      <For each={filteredTags}>
        {(tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Clickable types="selectable" data-selected={isSelected} key={tag}>
              <button type="button" onClick={handleTagClick}>
                {tag}
              </button>
            </Clickable>
          );
        }}
      </For>
    </div>
  );
}
