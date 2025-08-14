export function convertTo12HourFormat(isoDate: string | undefined) {
  if(!isoDate) return 
  const date = new Date(isoDate);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
}