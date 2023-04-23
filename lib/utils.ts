export function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  wait = wait || 200;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

