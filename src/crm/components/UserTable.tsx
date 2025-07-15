import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  TableSortLabel,
  Chip,
  Stack,
  Pagination,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import UserEditModal from "./UserEditModal";
import UserTableRow from "./UserTableRow";

// Types
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

interface UsersResponse {
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
type SortOrder = "asc" | "desc";

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export default function UserTable() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortField>("name.first");
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("asc");
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [perPage] = React.useState(10);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        sortBy: sortBy,
        ...(search && { search }),
      });

      const response = await fetch(`${API_BASE_URL}/users?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UsersResponse = await response.json();
      setUsers(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, sortBy, search]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  React.useEffect(() => {
    setPage(1);
  }, [search, sortBy]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    fetchUsers();
    handleCloseModal();
  };

  const totalPages = Math.ceil(total / perPage);

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" component="h2">
              Users ({total})
            </Typography>
            <TextField
              size="small"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
          </Stack>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "name.first"}
                          direction={
                            sortBy === "name.first" ? sortOrder : "asc"
                          }
                          onClick={() => handleSort("name.first")}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "location.city"}
                          direction={
                            sortBy === "location.city" ? sortOrder : "asc"
                          }
                          onClick={() => handleSort("location.city")}
                        >
                          Location
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "dob.age"}
                          direction={sortBy === "dob.age" ? sortOrder : "asc"}
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
                            sortBy === "registered.date" ? sortOrder : "asc"
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
                    {users.map((user) => (
                      <UserTableRow
                        key={user.login.uuid}
                        user={user}
                        onEdit={handleEditUser}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UserEditModal
        open={editModalOpen}
        user={selectedUser}
        onClose={handleCloseModal}
        onUserUpdated={handleUserUpdated}
      />
    </>
  );
}
