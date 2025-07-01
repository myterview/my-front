import { CreateForm } from "@ilokesto/sicilian";

export const { register, handleSubmit, getValues } = new CreateForm({
  initValue: { message: "" },
  clearFormOn: ["submit"],
});
