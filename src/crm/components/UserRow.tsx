import * as React from "react";
import {
  TableRow,
  TableCell,
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

// User interface - matches the API structure
interface User {
  login: {
    uuid: string;
    username: string;
    password: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  gender: string;
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

interface UserRowProps {
  user: User;
  onUserClick: (user: User) => void;
}

export default function UserRow({ user, onUserClick }: UserRowProps) {
  // Get user initials for avatar
  const getUserInitials = (user: User) => {
    const first = user.name?.first || "";
    const last = user.name?.last || "";
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <TableRow
      hover
      sx={{ cursor: "pointer" }}
      onClick={() => onUserClick(user)}
    >
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={user.picture?.thumbnail}
            sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
          >
            {getUserInitials(user)}
          </Avatar>
          <Typography variant="body2">
            {user.name?.title || ""} {user.name?.first || ""}{" "}
            {user.name?.last || ""}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ fontWeight: 500 }}>{user.name?.first || ""}</TableCell>
      <TableCell sx={{ fontWeight: 500 }}>{user.name?.last || ""}</TableCell>
      <TableCell>{user.email || ""}</TableCell>
      <TableCell>
        {user.location?.city || ""}, {user.location?.state || ""},{" "}
        {user.location?.country || ""}
      </TableCell>
      <TableCell>{user.dob?.age || ""}</TableCell>
      <TableCell>
        <Chip
          label={user.gender || "Unknown"}
          size="small"
          variant="outlined"
          color={user.gender === "male" ? "primary" : "secondary"}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          aria-label="edit user"
          onClick={(e) => {
            e.stopPropagation();
            onUserClick(user);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
