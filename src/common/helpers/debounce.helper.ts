let timeoutId: any;

export const debounceHelper = (func: () => void, delay: number) => {
  timeoutId && clearTimeout(timeoutId);
  timeoutId = setTimeout(() => func(), delay);
};
