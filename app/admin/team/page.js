"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserCog } from "lucide-react";
import { TEAM_ROLES } from "@/lib/admin-data";
import { setTeamMemberRole } from "@/lib/store/adminSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

function roleLabel(id) {
  return TEAM_ROLES.find((r) => r.id === id)?.label || id;
}

export default function AdminTeamPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const team = useSelector((s) => s.admin.team);

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader title="Access Control" />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Super Admin, Operations, Finance, Marketing, Support and Content access levels.
      </p>

      <div className="flex flex-col gap-2.5 px-4 lg:px-8">
        {team.map((member) => (
          <div key={member.id} className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-accent-1-light">
                <UserCog className="h-4 w-4 text-shop-accent-1" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-shop-heading">{member.name}</p>
                <p className="text-[11.5px] text-shop-text/70">{member.email}</p>
              </div>
            </div>
            <select
              value={member.role}
              onChange={(e) => {
                dispatch(setTeamMemberRole({ id: member.id, role: e.target.value }));
                showToast(`${member.name} is now ${roleLabel(e.target.value)}`);
              }}
              className="rounded-[8px] border border-shop-border bg-white px-3 py-2 text-[12.5px] text-shop-heading outline-none focus:border-shop-accent-1"
            >
              {TEAM_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4 lg:px-8">
        <p className="text-[13px] font-semibold text-shop-heading">Access Levels</p>
        {TEAM_ROLES.map((r) => (
          <div key={r.id} className="rounded-[10px] bg-shop-bg p-3">
            <p className="text-[12.5px] font-semibold text-shop-heading">{r.label}</p>
            <p className="text-[11.5px] text-shop-text">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
