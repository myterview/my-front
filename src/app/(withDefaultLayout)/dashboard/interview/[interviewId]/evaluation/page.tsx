"use client";

import { grunfeld } from "grunfeld";
import { useEffect } from "react";

export default function NotInter() {
  useEffect(() => {
    grunfeld.add(<>asdf</>);

    return () => {
      grunfeld.remove();
    };
  }, []);

  return <>not inter</>;
}
