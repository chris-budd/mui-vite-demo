import * as React from "react";
import {
  TableRow,
  TableCell,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

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

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getGenderColor = (gender: string) => {
  return gender === "male"
    ? "primary"
    : gender === "female"
      ? "secondary"
      : "default";
};

export default function UserTableRow({ user, onEdit }: UserTableRowProps) {
  const handleRowClick = () => {
    onEdit(user);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(user);
  };

  return (
    <TableRow hover sx={{ cursor: "pointer" }} onClick={handleRowClick}>
      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            src={user.picture.thumbnail}
            alt={`${user.name.first} ${user.name.last}`}
            sx={{ width: 32, height: 32 }}
          >
            {user.name.first[0]}
            {user.name.last[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {user.name.title} {user.name.first} {user.name.last}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user.login.username}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{user.email}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {user.location.city}, {user.location.country}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.location.state}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{user.dob.age}</Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={user.gender}
          size="small"
          color={getGenderColor(user.gender) as any}
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {formatDate(user.registered.date)}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          onClick={handleEditClick}
          aria-label="edit user"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
