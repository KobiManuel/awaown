"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "./baseApi";
import { useGetMeQuery } from "./authApi";
import { markSignedIn, markSignedOut } from "@/lib/session-cookie";
import {
  authLoading,
  clearAuth,
  setAccessToken,
  setMe,
  setRole,
} from "@/lib/store/authSlice";

/**
 * Re-establishes the session for a given dashboard on load:
 *  1. if we already hold an access token for this role, skip straight to /auth/me
 *  2. otherwise POST /auth/:role/refresh (sends the httpOnly cookie) to mint one
 *  3. with a token, fetch /auth/me and populate the auth slice
 *
 * Returns { resolving, authed, unauth, onboardingComplete } for a guard to act on.
 */
export function useAuthBootstrap(role) {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const accessToken = useSelector((s) => s.auth.accessToken);
  const storedRole = useSelector((s) => s.auth.role);
  const onboardingComplete = useSelector((s) => s.auth.onboardingComplete);
  const started = useRef(false);

  useEffect(() => {
    if (role && storedRole !== role) dispatch(setRole(role));
  }, [role, storedRole, dispatch]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (accessToken && storedRole === role) return; // session already in memory

    dispatch(authLoading());
    fetch(`${API_URL}/auth/${role}/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => {
        if (d?.accessToken) dispatch(setAccessToken(d.accessToken));
        else {
          dispatch(clearAuth());
          markSignedOut(role);
        }
      })
      .catch(() => {
        dispatch(clearAuth());
        markSignedOut(role);
      });
  }, [role, accessToken, storedRole, dispatch]);

  const {
    data: me,
    isLoading: meLoading,
    isError: meError,
    isSuccess: meSuccess,
  } = useGetMeQuery(undefined, { skip: !accessToken });

  useEffect(() => {
    if (meSuccess && me) {
      dispatch(setMe(me));
      markSignedIn(role);
    }
  }, [meSuccess, me, role, dispatch]);

  useEffect(() => {
    if (meError) markSignedOut(role);
  }, [meError, role]);

  const resolving =
    status === "idle" ||
    status === "loading" ||
    (!!accessToken && meLoading && status !== "authenticated");

  return {
    resolving,
    authed: status === "authenticated",
    unauth: status === "unauthenticated" || meError,
    onboardingComplete,
  };
}
