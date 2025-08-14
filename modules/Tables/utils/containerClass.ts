export const containerClass = (isActive: boolean) => {
  return isActive
    ? "opacity-100 pointer-events-auto scale-100"
    : "opacity-0 pointer-events-none scale-95";
};
