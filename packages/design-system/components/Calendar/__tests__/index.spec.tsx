import { cleanup } from "@testing-library/react";
import { renderWithTheme } from "../../../utils/testUtils";
import Calendar from "..";

describe("Calendar tests", () => {
  afterEach(cleanup);

  test("render Calendar correctly", () => {
    const { asFragment } = renderWithTheme(<Calendar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
