"use client";

import { patchUserRoleAction } from "@/apis/user.action";

export default function TestPage() {

  return <button onClick={patchUserRoleAction}>test</button>
}