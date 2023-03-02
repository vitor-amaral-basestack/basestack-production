import styled, { keyframes, css } from "styled-components";
import { rem } from "polished";

const pulsate = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

const flexRow = css`
  display: flex;
  flex-direction: row;
`;

export const Container = styled.div<{
  backgroundColor?: string;
  padding?: number;
  hasShadow?: boolean;
}>`
  ${flexColumn};
  background-color: ${({ theme, backgroundColor }) =>
    backgroundColor || theme.colors.white};
  border-radius: ${rem("4px")};
  padding: ${({ theme, padding }) =>
    padding ? rem(`${padding}px`) : theme.spacing.s5};

  ${({ hasShadow, theme }) =>
    hasShadow &&
    css`
      box-shadow: ${theme.shadow.elevation2};
    `}
`;

export const Wrapper = styled.div<{ displayInline?: boolean }>`
  ${({ displayInline }) => (displayInline ? flexRow : flexColumn)};
  animation: ${pulsate} 1.2s infinite linear;
`;

const getValue = (value: number | string) =>
  typeof value === "string" ? value : rem(`${value}px`);

export const Item = styled.div<{
  height: number;
  width: number | string;
  marginBottom?: number | string;
  marginRight?: number | string;
  marginLeft?: number | string;
}>`
  ${flexColumn};
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${rem("6px")};
  height: ${({ height }) => rem(`${height}px`)};
  width: ${({ width }) => getValue(width || 0)};
  margin-bottom: ${({ marginBottom }) => getValue(marginBottom || 0)};
  margin-right: ${({ marginRight }) => getValue(marginRight || 0)};
  margin-left: ${({ marginLeft }) => getValue(marginLeft || 0)};
`;