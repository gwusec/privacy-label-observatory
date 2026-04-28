import { test, expect } from "vitest";
import { render } from "@testing-library/react";
import AppSelector from "../components/AppSelector";

test("AppSelector renders", () => {
  render(<AppSelector  cacheList={{}}/>);
  expect(document.body).toBeTruthy();
});