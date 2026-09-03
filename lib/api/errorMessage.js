/**
 * Pull a human string out of an RTK Query / fetch error. The API's error
 * envelope is `{ statusCode, message, error }` where `message` is a string or an
 * array of validation strings.
 */
export function errorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (!err) return fallback;
  const data = err.data ?? err;
  const msg = data?.message ?? data?.error;
  if (Array.isArray(msg)) return msg[0] || fallback;
  if (typeof msg === "string") return msg;
  if (err.status === "FETCH_ERROR")
    return "Can't reach the server. Is the API running?";
  return fallback;
}
