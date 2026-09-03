"use client";

import React from "react";
import HelpCentre from "@/app/Components/Dashboard/HelpCentre";

export default function CustomerHelpPage() {
  return (
    <HelpCentre backHref="/dashboard/account" supportHref="/dashboard/support" />
  );
}
