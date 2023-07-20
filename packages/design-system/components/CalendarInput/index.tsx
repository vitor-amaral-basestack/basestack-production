import React, { forwardRef, memo } from "react";
import { SpaceProps } from "styled-system";
// Calendar
// @ts-ignore
import { CalendarProps } from "react-calendar";
// Components
import { Container } from "./styles";
import Icon from "../Icon";
import { InputProps } from "../Input";
import InputGroup from "../InputGroup";

import Calendar from "../Calendar";

export interface CalendarInputProps extends SpaceProps {
  isCalenderOpen: boolean;
  calendarProps: CalendarProps;
  inputTitle: string;
  inputProps: InputProps;
}

const CalendarInput = forwardRef<HTMLDivElement, CalendarInputProps>(
  (
    { inputTitle, inputProps, isCalenderOpen, calendarProps, ...props },
    ref,
  ) => (
    <Container ref={ref} {...props}>
      <InputGroup title={inputTitle} inputProps={inputProps} />
      {isCalenderOpen && (
        <Calendar
          {...calendarProps}
          prevLabel={<Icon icon="chevron_left" size="small" />}
          prev2Label={<Icon icon="keyboard_double_arrow_left" size="small" />}
          nextLabel={<Icon icon="chevron_right" size="small" />}
          next2Label={<Icon icon="keyboard_double_arrow_right" size="small" />}
        />
      )}
    </Container>
  ),
);

CalendarInput.displayName = "CalendarInput";

export default memo(CalendarInput);