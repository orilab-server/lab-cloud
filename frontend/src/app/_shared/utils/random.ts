export const getRandom = (min: number, max: number) => {
  const rMin = Math.ceil(min);
  const rMax = Math.floor(max);
  return Math.floor(Math.random() * (rMax - rMin) + rMin);
};
