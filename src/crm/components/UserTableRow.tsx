import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Chip from "@mui/material/Chip";

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
  onEditUser: (user: User) => void;
}

const getGenderColor = (
  gender: string,
): "default" | "primary" | "secondary" => {
  switch (gender.toLowerCase()) {
    case "male":
      return "primary";
    case "female":
      return "secondary";
    default:
      return "default";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function UserTableRow({ user, onEditUser }: UserTableRowProps) {
  const handleEditUser = () => {
    onEditUser(user);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleEditUser();
  };

  return (
    <TableRow hover sx={{ cursor: "pointer" }} onClick={handleEditUser}>
      <TableCell>
        <Avatar
          src={user.picture.thumbnail}
          alt={`${user.name.first} ${user.name.last}`}
          sx={{ width: 32, height: 32 }}
        >
          {user.name.first[0]}
          {user.name.last[0]}
        </Avatar>
      </TableCell>
      <TableCell sx={{ fontWeight: 500 }}>
        {user.name.title} {user.name.first}
      </TableCell>
      <TableCell>{user.name.last}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.location.city}</TableCell>
      <TableCell>{user.location.country}</TableCell>
      <TableCell>{user.dob.age}</TableCell>
      <TableCell>
        <Chip
          label={user.gender}
          size="small"
          color={getGenderColor(user.gender)}
          variant="outlined"
        />
      </TableCell>
      <TableCell>{formatDate(user.registered.date)}</TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          aria-label="edit user"
          onClick={handleEditClick}
        >
          <EditRoundedIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
