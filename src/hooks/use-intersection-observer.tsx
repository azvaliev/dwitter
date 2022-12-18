import type { DependencyList} from "react";
import { useCallback, useEffect, useRef } from "react";

const defaultOpts: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px",
  threshold: 1,
}

/**
 * Attaches an intersection observer to the ref returned from this hook
 * Fires passed in callback upon intersection
 *
 * additionalDep is when the intersection ref gets attached to a new element,
 * like in infinite scroll
 * */
function useIntersectionObserver<TElementType extends HTMLElement>(
  cb: IntersectionObserverCallback,
  additonalDep: DependencyList[number],
) {
  const elementRef = useRef<TElementType>(null);

  const wrappedCallback = useCallback<IntersectionObserverCallback>((entries, ...params) => {
    const [entry] = entries;
    if (entry?.isIntersecting) {
      cb(entries, ...params);
    }
  }, [cb]);

  useEffect(() => {
    const observer = new IntersectionObserver(wrappedCallback, defaultOpts);

    const observedElement = elementRef.current;
    if (observedElement) {
      observer.observe(observedElement)
    }

    return () => {
      if (observedElement) {
        observer.unobserve(observedElement)
      }
    }
  }, [wrappedCallback, elementRef, additonalDep]);

  return elementRef;
}

export default useIntersectionObserver;
