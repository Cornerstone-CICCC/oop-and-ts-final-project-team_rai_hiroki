import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpIcon from "@mui/icons-material/Help";
import { IconButton, Input } from "@mui/material";
import { MoreOptions } from "./MoreOptions";

export function SearchBar() {
  const iconSize = 36;
  const [inputValue, setInputValue] = useState<string>("");

  const handleSearch = () => {
    console.log(inputValue);
    setInputValue("")
  };

  const mobileMenuItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: <NotificationsNoneIcon sx={{ fontSize: 22 }} />,
    },
    {
      id: "help",
      label: "Help",
      icon: <HelpIcon sx={{ fontSize: 22 }} />,
    },
  ];

  return (
    <div className="h-16 sm:h-20 w-full flex items-center sm:px-4">
      <div className="h-full flex-10 flex items-center gap-2 px-2">
        <IconButton aria-label="search" onClick={handleSearch}>
          <SearchIcon sx={{ fontSize: iconSize }} />
        </IconButton>
        <Input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Search..."
          className="w-full"
        />
      </div>

      <div className="ml-2 h-full flex items-center px-2">
        <div className="sm:hidden">
          <MoreOptions
            buttonAriaLabel="open utility menu"
            buttonId="searchbar-mobile-options-button"
            menuId="searchbar-mobile-options-menu"
            triggerIcon={<MoreVertIcon sx={{ fontSize: iconSize }} />}
            items={mobileMenuItems}
            menuWidth={180}
            maxVisibleItems={4}
          />
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <IconButton aria-label="notifications">
            <NotificationsNoneIcon sx={{ fontSize: iconSize }} />
          </IconButton>
          <IconButton aria-label="help">
            <HelpIcon sx={{ fontSize: iconSize }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
