"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { UserCog, Plus, Trash2 } from "lucide-react";
import { TEAM_ROLES } from "@/lib/admin-data";

const SUPER_ALIASES = ["super_admin", "Super Admin", "SUPER_ADMIN", "superadmin"];
const isSuperRole = (r) => SUPER_ALIASES.includes((r ?? "").trim());
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { useConfirm } from "@/app/Components/Admin/ConfirmDialog";
import { SkeletonRows } from "@/components/ui/skeleton";
import {
  useGetAdminTeamQuery,
  useSetTeamRoleMutation,
  useInviteTeamMemberMutation,
  useRemoveTeamMemberMutation,
} from "@/lib/api/adminApi";
import { errorMessage } from "@/lib/api/errorMessage";

function roleLabel(id) {
  return TEAM_ROLES.find((r) => r.id === id)?.label || id;
}

const FIELD =
  "w-full rounded-[8px] border border-shop-border px-3 py-2.5 text-[12.5px] text-shop-heading outline-none focus:border-shop-accent-1";

export default function AdminTeamPage() {
  const showToast = useToast();
  const confirm = useConfirm();
  const { data, isLoading } = useGetAdminTeamQuery();
  const [setRole] = useSetTeamRoleMutation();
  const [invite, inviteState] = useInviteTeamMemberMutation();
  const [remove] = useRemoveTeamMemberMutation();

  const members = data ?? [];
  const amSuper = isSuperRole(useSelector((s) => s.auth.profile?.teamRole));
  const assignableRoles = amSuper
    ? TEAM_ROLES
    : TEAM_ROLES.filter((r) => !isSuperRole(r.id));
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole_] = useState("administrator");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await invite({ fullName: name.trim(), email: email.trim(), teamRole: role }).unwrap();
      showToast(`${name.trim()} invited to the team`);
      setName("");
      setEmail("");
      setRole_("administrator");
      setFormOpen(false);
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  const handleRemove = async (member) => {
    const res = await confirm({
      title: `Remove ${member.user.fullName} from the team?`,
      message: "They lose all admin access immediately.",
      confirmLabel: "Remove",
      tone: "danger",
    });
    if (!res) return;
    try {
      await remove(member.id).unwrap();
      showToast(`${member.user.fullName} removed from the team`);
    } catch (err) {
      showToast(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[900px]">
      <AppHeader
        title="Access Control"
        backHref="/admin"
        right={
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-shop-accent-1-light px-3 py-1.5 text-[11.5px] font-semibold text-shop-accent-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Staff
          </button>
        }
      />
      <p className="px-4 text-[11.5px] text-shop-text/60 lg:px-8">
        Super Admin, Administrator, Operations, Finance, Marketing, Support and Content access levels.
      </p>

      {formOpen && (
        <form
          onSubmit={handleAdd}
          className="mx-4 flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-3.5 lg:mx-8"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className={FIELD}
            autoFocus
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            className={FIELD}
          />
          <select value={role} onChange={(e) => setRole_(e.target.value)} className={FIELD}>
            {assignableRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!name.trim() || !email.trim() || inviteState.isLoading}
            className="rounded-[8px] bg-shop-accent-1 py-2.5 text-[12.5px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-shop-accent-1/40"
          >
            {inviteState.isLoading ? "Sending invite…" : "Add to Team"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="px-4 lg:px-8">
          <SkeletonRows count={3} />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 px-4 lg:px-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-2.5 rounded-[14px] border border-shop-border bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-shop-accent-1-light">
                  <UserCog className="h-4 w-4 text-shop-accent-1" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-shop-heading">
                    {member.user.fullName}
                  </p>
                  <p className="text-[11.5px] text-shop-text/70">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={member.teamRole}
                  disabled={!amSuper && isSuperRole(member.teamRole)}
                  onChange={(e) => {
                    setRole({ id: member.id, teamRole: e.target.value })
                      .unwrap()
                      .then(() =>
                        showToast(`${member.user.fullName} is now ${roleLabel(e.target.value)}`),
                      )
                      .catch((err) => showToast(errorMessage(err)));
                  }}
                  className="rounded-[8px] border border-shop-border bg-white px-3 py-2 text-[12.5px] text-shop-heading outline-none focus:border-shop-accent-1 disabled:opacity-60"
                >
                  {assignableRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                  {!assignableRoles.some((r) => r.id === member.teamRole) && (
                    <option value={member.teamRole}>
                      {roleLabel(member.teamRole)}
                    </option>
                  )}
                </select>
                {amSuper && (
                  <button
                    type="button"
                    aria-label="Remove from team"
                    onClick={() => handleRemove(member)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
