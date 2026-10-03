import { useEffect, useState } from "react";
export function useRoute() {
  const [navigation, setNavigation] = useState(() => ({
    hash: location.hash || "#/",
    id: 0,
  }));
  useEffect(() => {
    const update = () =>
      setNavigation((previous) => ({
        hash: location.hash || "#/",
        id: previous.id + 1,
      }));
    // A repeated hash link does not emit hashchange, but must still scroll.
    const repeat = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor =
        event.target instanceof Element ? event.target.closest("a") : null;
      const href = anchor?.getAttribute("href");
      if (
        href?.startsWith("#/") &&
        href === location.hash &&
        !anchor?.hasAttribute("download") &&
        (!anchor?.target || anchor.target === "_self")
      ) {
        event.preventDefault();
        update();
      }
    };
    addEventListener("hashchange", update);
    document.addEventListener("click", repeat);
    return () => {
      removeEventListener("hashchange", update);
      document.removeEventListener("click", repeat);
    };
  }, []);
  const [path, query] = navigation.hash.slice(1).split("?");
  return {
    path: path || "/",
    section: new URLSearchParams(query).get("section"),
    hash: navigation.hash,
    navigationId: navigation.id,
  };
}
