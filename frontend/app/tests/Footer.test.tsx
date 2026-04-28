import { test, expect } from "vitest";
import { render } from "@testing-library/react";
import Footer from "../components/Footer";

test("footer renders", () => {
  render(<Footer />);
  expect(document.body).toBeTruthy();
});