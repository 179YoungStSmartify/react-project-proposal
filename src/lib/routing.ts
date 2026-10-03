import { useEffect, useState } from "react";
export function useRoute() {
  const [hash, setHash] = useState(() => location.hash || "#/");
  useEffect(() => {
    const update = () => setHash(location.hash || "#/");
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, []);
  const [path, query] = hash.slice(1).split("?");
  return {
    path: path || "/",
    section: new URLSearchParams(query).get("section"),
    hash,
  };
}
