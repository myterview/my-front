import { CreateForm } from "@ilokesto/sicilian";

export const { register, handleSubmit, getValues, setValues } = new CreateForm({
  initValue: { message: "" },
  clearFormOn: ["submit"],
});
