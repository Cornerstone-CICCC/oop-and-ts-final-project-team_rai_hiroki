import { useState, type MouseEvent, type ReactNode } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ITEM_HEIGHT = 48;

export type MoreOptionsItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
};

type MoreOptionsProps = {
  items: MoreOptionsItem[];
  buttonAriaLabel?: string;
  buttonId?: string;
  menuId?: string;
  triggerIcon?: ReactNode;
  selectedItemId?: string;
  menuWidth?: string | number;
  maxVisibleItems?: number;
  closeOnItemClick?: boolean;
};

export function MoreOptions({
  items,
  buttonAriaLabel = "more options",
  buttonId = "more-options-button",
  menuId = "more-options-menu",
  triggerIcon = <MoreVertIcon />,
  selectedItemId,
  menuWidth = "20ch",
  maxVisibleItems = 6,
  closeOnItemClick = true,
}: MoreOptionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label={buttonAriaLabel}
        id={buttonId}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {triggerIcon}
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * maxVisibleItems,
              width: menuWidth,
            },
          },
          list: {
            "aria-labelledby": buttonId,
          },
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.id}
            selected={item.id === selectedItemId}
            onClick={() => {
              item.onClick?.();
              if (closeOnItemClick) {
                handleClose();
              }
            }}
            className="flex gap-2"
          >
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
