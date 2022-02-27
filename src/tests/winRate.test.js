const calcWinRate = (losses, total) => {
  if (total === 0) return 0;
  let percentage = (losses / total) * 100;
  return Math.round(percentage);
};

test("47/48 = 98%", () => {
  expect(calcWinRate(47, 48)).toBe(98);
});

test("7/8 = 88%", () => {
  expect(calcWinRate(7, 8)).toBe(88);
});

test("0/0 = 0%", () => {
  expect(calcWinRate(0, 0)).toBe(0);
});

test("5/5 = 100%", () => {
  expect(calcWinRate(5, 5)).toBe(100);
});
