import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Avatar,
  Box,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

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

interface UserEditModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUserUpdated: () => void;
}

const API_BASE_URL = "https://user-api.builder-io.workers.dev/api";

const titles = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"];
const genders = ["male", "female", "other"];

export default function UserEditModal({
  open,
  user,
  onClose,
  onUserUpdated,
}: UserEditModalProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    gender: "",
    phone: "",
    cell: "",
    streetNumber: "",
    streetName: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        title: user.name.title,
        firstName: user.name.first,
        lastName: user.name.last,
        email: user.email,
        username: user.login.username,
        gender: user.gender,
        phone: user.phone,
        cell: user.cell,
        streetNumber: user.location.street.number.toString(),
        streetName: user.location.street.name,
        city: user.location.city,
        state: user.location.state,
        country: user.location.country,
        postcode: user.location.postcode,
      });
      setError(null);
      setSuccess(false);
    }
  }, [user]);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const updateData = {
        name: {
          title: formData.title,
          first: formData.firstName,
          last: formData.lastName,
        },
        email: formData.email,
        login: {
          username: formData.username,
        },
        gender: formData.gender,
        phone: formData.phone,
        cell: formData.cell,
        location: {
          street: {
            number: parseInt(formData.streetNumber) || 0,
            name: formData.streetName,
          },
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postcode: formData.postcode,
        },
      };

      const response = await fetch(`${API_BASE_URL}/users/${user.login.uuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`,
        );
      }

      setSuccess(true);
      setTimeout(() => {
        onUserUpdated();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.username.trim() &&
      formData.city.trim() &&
      formData.country.trim()
    );
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "70vh" },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={user.picture.medium}
            alt={`${user.name.first} ${user.name.last}`}
            sx={{ width: 48, height: 48 }}
          >
            {user.name.first[0]}
            {user.name.last[0]}
          </Avatar>
          <Box>
            <Typography variant="h6">Edit User Details</Typography>
            <Typography variant="body2" color="text.secondary">
              Update information for {user.name.first} {user.name.last}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            User updated successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Title"
              value={formData.title}
              onChange={handleInputChange("title")}
              disabled={loading}
            >
              {titles.map((title) => (
                <MenuItem key={title} value={title}>
                  {title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4.5}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange("firstName")}
              required
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={4.5}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange("lastName")}
              required
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              required
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={handleInputChange("username")}
              required
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Gender"
              value={formData.gender}
              onChange={handleInputChange("gender")}
              disabled={loading}
            >
              {genders.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Contact Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cell Phone"
              value={formData.cell}
              onChange={handleInputChange("cell")}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Address Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Street Number"
              value={formData.streetNumber}
              onChange={handleInputChange("streetNumber")}
              type="number"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label="Street Name"
              value={formData.streetName}
              onChange={handleInputChange("streetName")}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={handleInputChange("city")}
              required
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State/Province"
              value={formData.state}
              onChange={handleInputChange("state")}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={handleInputChange("country")}
              required
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              value={formData.postcode}
              onChange={handleInputChange("postcode")}
              disabled={loading}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !isFormValid() || success}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? "Updating..." : "Update User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
