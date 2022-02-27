const calcWinRate = (losses, total) => {
  if (total === 0) return 0;
  let percentage = ((total - losses) / total) * 100;
  return Math.round(percentage);
};

test("1 loss out of 48 = 98%", () => {
  expect(calcWinRate(1, 48)).toBe(98);
});

test("1 loss out of 8 = 88%", () => {
  expect(calcWinRate(1, 8)).toBe(88);
});

test("0 loss out of 0 = 0%", () => {
  expect(calcWinRate(0, 0)).toBe(0);
});

test("5 losses out of 5 = 0%", () => {
  expect(calcWinRate(5, 5)).toBe(0);
});

test("0 losses out of 5 = 100%", () => {
  expect(calcWinRate(0, 5)).toBe(100);
});
