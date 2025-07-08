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
  TableSortLabel,
  Typography,
  TextField,
  Stack,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";

// User interface based on the API documentation
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
type SortDirection = "asc" | "desc";

interface EditUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  gender: string;
}

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

export default function UsersTable() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("name.first");
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("asc");
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [perPage] = React.useState(20);

  // Modal state
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [editFormData, setEditFormData] = React.useState<EditUserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    gender: "",
  });
  const [updateLoading, setUpdateLoading] = React.useState(false);

  // Fetch users function
  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        sortBy: sortField,
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`${API_BASE_URL}/users?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setUsers(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, sortField, searchTerm]);

  // Effect to fetch users when dependencies change
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search with debouncing
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle sort
  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
    setPage(1);
  };

  // Handle user click to open edit modal
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.name.first,
      lastName: user.name.last,
      email: user.email,
      city: user.location.city,
      state: user.location.state,
      country: user.location.country,
      phone: user.phone,
      gender: user.gender,
    });
    setEditModalOpen(true);
  };

  // Handle form input changes
  const handleFormChange = (field: keyof EditUserFormData, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle user update
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setUpdateLoading(true);

      const updateData = {
        name: {
          first: editFormData.firstName,
          last: editFormData.lastName,
        },
        email: editFormData.email,
        location: {
          city: editFormData.city,
          state: editFormData.state,
          country: editFormData.country,
        },
        phone: editFormData.phone,
        gender: editFormData.gender,
      };

      const response = await fetch(
        `${API_BASE_URL}/users/${selectedUser.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the users list
      await fetchUsers();
      setEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get user initials for avatar
  const getUserInitials = (user: User) => {
    const first = user.name?.first || "";
    const last = user.name?.last || "";
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  if (error) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button onClick={fetchUsers} variant="outlined">
            Retry
          </Button>
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
              Users ({total})
            </Typography>
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
          </Stack>
        </CardContent>

        <TableContainer sx={{ flexGrow: 1 }}>
          <Table size="small" aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "name.first"}
                    direction={
                      sortField === "name.first" ? sortDirection : "asc"
                    }
                    onClick={() => handleSort("name.first")}
                  >
                    First Name
                    {sortField === "name.first" && (
                      <Box component="span" sx={visuallyHidden}>
                        {sortDirection === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    )}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "name.last"}
                    direction={
                      sortField === "name.last" ? sortDirection : "asc"
                    }
                    onClick={() => handleSort("name.last")}
                  >
                    Last Name
                    {sortField === "name.last" && (
                      <Box component="span" sx={visuallyHidden}>
                        {sortDirection === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    )}
                  </TableSortLabel>
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "location.city"}
                    direction={
                      sortField === "location.city" ? sortDirection : "asc"
                    }
                    onClick={() => handleSort("location.city")}
                  >
                    Location
                    {sortField === "location.city" && (
                      <Box component="span" sx={visuallyHidden}>
                        {sortDirection === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    )}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "dob.age"}
                    direction={sortField === "dob.age" ? sortDirection : "asc"}
                    onClick={() => handleSort("dob.age")}
                  >
                    Age
                    {sortField === "dob.age" && (
                      <Box component="span" sx={visuallyHidden}>
                        {sortDirection === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    )}
                  </TableSortLabel>
                </TableCell>
                <TableCell>Gender</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {searchTerm
                        ? "No users found matching your search."
                        : "No users found."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.login.uuid}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleUserClick(user)}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                    <TableCell sx={{ fontWeight: 500 }}>
                      {user.name?.first || ""}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {user.name?.last || ""}
                    </TableCell>
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
                          handleUserClick(user);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination controls */}
        <CardContent sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              Showing {Math.min((page - 1) * perPage + 1, total)} -{" "}
              {Math.min(page * perPage, total)} of {total} users
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={page * perPage >= total}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Edit User: {selectedUser?.name.first} {selectedUser?.name.last}
            </Typography>
            <IconButton onClick={() => setEditModalOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={editFormData.firstName}
                onChange={(e) => handleFormChange("firstName", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={editFormData.lastName}
                onChange={(e) => handleFormChange("lastName", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editFormData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={editFormData.city}
                onChange={(e) => handleFormChange("city", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={editFormData.state}
                onChange={(e) => handleFormChange("state", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country"
                value={editFormData.country}
                onChange={(e) => handleFormChange("country", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={editFormData.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                value={editFormData.gender}
                onChange={(e) => handleFormChange("gender", e.target.value)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setEditModalOpen(false)}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            disabled={updateLoading}
            startIcon={updateLoading ? <CircularProgress size={16} /> : null}
          >
            {updateLoading ? "Updating..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
