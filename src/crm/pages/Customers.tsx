import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

interface User {
  login: {
    uuid: string;
    username: string;
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
  };
  email: string;
  dob: {
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
  data: User[];
}

export default function Customers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [editedUser, setEditedUser] = React.useState<Partial<User>>({});
  const [updateLoading, setUpdateLoading] = React.useState(false);

  const fetchUsers = React.useCallback(async (search = "") => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        perPage: "100",
        ...(search && { search }),
      });

      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users?${queryParams}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: UsersResponse = await response.json();
      setUsers(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchUsers]);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedUser(params.row as User);
    setEditedUser({
      name: { ...params.row.name },
      email: params.row.email,
      location: { ...params.row.location },
      phone: params.row.phone,
      cell: params.row.cell,
      gender: params.row.gender,
    });
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
    setEditedUser({});
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setUpdateLoading(true);
      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${selectedUser.login.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUser),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Update the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.login.uuid === selectedUser.login.uuid
            ? { ...user, ...editedUser }
            : user,
        ),
      );

      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setUpdateLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Avatar
            src={params.row.picture?.thumbnail}
            alt={`${params.row.name?.first} ${params.row.name?.last}`}
            sx={{ width: 32, height: 32 }}
          >
            {params.row.name?.first?.[0]}
            {params.row.name?.last?.[0]}
          </Avatar>
        </Box>
      ),
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) =>
        `${row.name?.first || ""} ${row.name?.last || ""}`,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) =>
        `${row.location?.city || ""}, ${row.location?.country || ""}`,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "age",
      headerName: "Age",
      width: 80,
      valueGetter: (value, row) => row.dob?.age || 0,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "male" ? "primary" : "secondary"}
          variant="outlined"
        />
      ),
    },
  ];

  const rows = users.map((user) => ({
    id: user.login.uuid,
    ...user,
  }));

  if (error) {
    return (
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Customers
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => fetchUsers(searchQuery)} variant="contained">
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Customers Data
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          sx={{
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Edit User Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit User: {selectedUser?.name?.first} {selectedUser?.name?.last}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                value={editedUser.name?.first || ""}
                onChange={(e) =>
                  setEditedUser((prev) => ({
                    ...prev,
                    name: { ...prev.name, first: e.target.value },
                  }))
                }
              />
              <TextField
                fullWidth
                label="Last Name"
                value={editedUser.name?.last || ""}
                onChange={(e) =>
                  setEditedUser((prev) => ({
                    ...prev,
                    name: { ...prev.name, last: e.target.value },
                  }))
                }
              />
            </Box>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editedUser.email || ""}
              onChange={(e) =>
                setEditedUser((prev) => ({ ...prev, email: e.target.value }))
              }
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Phone"
                value={editedUser.phone || ""}
                onChange={(e) =>
                  setEditedUser((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
              <TextField
                fullWidth
                label="Cell"
                value={editedUser.cell || ""}
                onChange={(e) =>
                  setEditedUser((prev) => ({ ...prev, cell: e.target.value }))
                }
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="City"
                value={editedUser.location?.city || ""}
                onChange={(e) =>
                  setEditedUser((prev) => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value },
                  }))
                }
              />
              <TextField
                fullWidth
                label="Country"
                value={editedUser.location?.country || ""}
                onChange={(e) =>
                  setEditedUser((prev) => ({
                    ...prev,
                    location: { ...prev.location, country: e.target.value },
                  }))
                }
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={editedUser.gender || ""}
                label="Gender"
                onChange={(e) =>
                  setEditedUser((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={updateLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            disabled={updateLoading}
            startIcon={updateLoading ? <CircularProgress size={16} /> : null}
          >
            {updateLoading ? "Updating..." : "Update User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
