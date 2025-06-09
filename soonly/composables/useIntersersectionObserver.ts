import type { Ref } from 'vue';

export const useIntersectionObserver = (
  targetRef: Ref<HTMLElement | null>,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  const observer = ref<IntersectionObserver | null>(null);

  onMounted(() => {
    observer.value = new IntersectionObserver(callback, options);
    if (targetRef.value) observer.value.observe(targetRef.value);
  });

  onBeforeUnmount(() => {
    if (observer.value && targetRef.value) {
      observer.value.unobserve(targetRef.value);
    }
  });

  return { observer };
};