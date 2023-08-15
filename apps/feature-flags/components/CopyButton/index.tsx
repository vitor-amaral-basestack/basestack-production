import React, { useState } from "react";
// Components
import {
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@basestack/design-system";

export interface Props {
  text: string;
}

const CopyButton = ({ text }: Props) => {
  const [showTooltipSuccess, setShowTooltipSuccess] = useState(false);

  return (
    <Tooltip placement="top">
      <TooltipTrigger onMouseLeave={() => setShowTooltipSuccess(false)}>
        <IconButton
          icon="content_copy"
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(text);
            setShowTooltipSuccess(true);
          }}
        />
      </TooltipTrigger>
      <TooltipContent>
        {showTooltipSuccess ? "Copied Code to Clipboard" : "Copy Code"}
      </TooltipContent>
    </Tooltip>
  );
};

export default CopyButton;