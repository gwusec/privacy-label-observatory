import { test, expect } from "vitest";
import { render } from "@testing-library/react";
import { ThemeSwitcher } from "../ThemeSwitcher";

test("ThemeSwitcher renders", () => {
  render(<ThemeSwitcher />);
  expect(document.body).toBeTruthy();
});