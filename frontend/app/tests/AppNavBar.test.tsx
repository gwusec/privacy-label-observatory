import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppNavBar from "../AppNavBar";

describe("Frontend Regression - Navbar", () => {
  test("navbar renders after changes", () => {
    render(
      <MemoryRouter>
        <AppNavBar />
      </MemoryRouter>
    );

    expect(document.body).toBeTruthy();
  });
});