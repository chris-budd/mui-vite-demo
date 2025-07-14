import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import TablePagination from "@mui/material/TablePagination";
import UserEditModal from "./UserEditModal";
import UserTableRow from "./UserTableRow";

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

interface ApiResponse {
  page: number;
  perPage: number;
  total: number;
  span: string;
  effectivePage: number;
  data: User[];
}

type SortField =
  | "name.first"
  | "name.last"
  | "location.city"
  | "location.country"
  | "dob.age"
  | "registered.date";

interface UserTableProps {
  title?: string;
}

export default function UserTable({
  title = "Customer Management",
}: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("name.first");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        perPage: rowsPerPage.toString(),
        sortBy: sortBy,
        ...(search && { search }),
      });

      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?${params}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setUsers(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, sortBy]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field: SortField) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.login.uuid === updatedUser.login.uuid ? updatedUser : user,
      ),
    );
    handleCloseModal();
  };

  if (error) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography color="error" align="center">
            Error loading users: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <CardContent sx={{ pb: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
            <TextField
              size="small"
              placeholder="Search users..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
          </Stack>
        </CardContent>

        <TableContainer sx={{ flexGrow: 1 }}>
          <Table size="small" aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "name.first"}
                    direction={sortBy === "name.first" ? sortDirection : "asc"}
                    onClick={() => handleSort("name.first")}
                  >
                    First Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "name.last"}
                    direction={sortBy === "name.last" ? sortDirection : "asc"}
                    onClick={() => handleSort("name.last")}
                  >
                    Last Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "location.city"}
                    direction={
                      sortBy === "location.city" ? sortDirection : "asc"
                    }
                    onClick={() => handleSort("location.city")}
                  >
                    City
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "location.country"}
                    direction={
                      sortBy === "location.country" ? sortDirection : "asc"
                    }
                    onClick={() => handleSort("location.country")}
                  >
                    Country
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "dob.age"}
                    direction={sortBy === "dob.age" ? sortDirection : "asc"}
                    onClick={() => handleSort("dob.age")}
                  >
                    Age
                  </TableSortLabel>
                </TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "registered.date"}
                    direction={
                      sortBy === "registered.date" ? sortDirection : "asc"
                    }
                    onClick={() => handleSort("registered.date")}
                  >
                    Registered
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {search
                        ? "No users found matching your search."
                        : "No users found."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <UserTableRow
                    key={user.login.uuid}
                    user={user}
                    onEditUser={handleEditUser}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>

      <UserEditModal
        open={modalOpen}
        user={selectedUser}
        onClose={handleCloseModal}
        onUserUpdate={handleUserUpdate}
      />
    </>
  );
}
