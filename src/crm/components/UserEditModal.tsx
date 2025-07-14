import * as React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

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
  onUserUpdate: (user: User) => void;
}

interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  phone: string;
  cell: string;
  streetNumber: number;
  streetName: string;
}

const titleOptions = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"];
const genderOptions = ["male", "female", "other"];

export default function UserEditModal({
  open,
  user,
  onClose,
  onUserUpdate,
}: UserEditModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
    phone: "",
    cell: "",
    streetNumber: 0,
    streetName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        title: user.name.title,
        firstName: user.name.first,
        lastName: user.name.last,
        email: user.email,
        gender: user.gender,
        city: user.location.city,
        state: user.location.state,
        country: user.location.country,
        postcode: user.location.postcode,
        phone: user.phone,
        cell: user.cell,
        streetNumber: user.location.street.number,
        streetName: user.location.street.name,
      });
    }
  }, [user]);

  const handleInputChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "streetNumber"
          ? parseInt(event.target.value) || 0
          : event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSelectChange = (field: keyof FormData) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const updateData = {
        name: {
          title: formData.title,
          first: formData.firstName,
          last: formData.lastName,
        },
        email: formData.email,
        gender: formData.gender,
        location: {
          street: {
            number: formData.streetNumber,
            name: formData.streetName,
          },
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postcode: formData.postcode,
        },
        phone: formData.phone,
        cell: formData.cell,
      };

      const response = await fetch(
        `https://user-api.builder-io.workers.dev/api/users/${user.login.uuid}`,
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

      const result = await response.json();

      if (result.success) {
        // Create updated user object
        const updatedUser: User = {
          ...user,
          name: {
            title: formData.title,
            first: formData.firstName,
            last: formData.lastName,
          },
          email: formData.email,
          gender: formData.gender,
          location: {
            ...user.location,
            street: {
              number: formData.streetNumber,
              name: formData.streetName,
            },
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postcode: formData.postcode,
          },
          phone: formData.phone,
          cell: formData.cell,
        };

        onUserUpdate(updatedUser);
        setSuccess(true);
      } else {
        throw new Error(result.error || "Failed to update user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSnackbarClose = () => {
    setSuccess(false);
  };

  if (!user) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={user.picture.medium}
              alt={`${user.name.first} ${user.name.last}`}
              sx={{ width: 48, height: 48 }}
            >
              <PersonRoundedIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">Edit User Details</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.name.first} {user.name.last} - {user.email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Title</InputLabel>
                <Select
                  value={formData.title}
                  label="Title"
                  onChange={handleSelectChange("title")}
                >
                  {titleOptions.map((title) => (
                    <MenuItem key={title} value={title}>
                      {title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4.5}>
              <TextField
                fullWidth
                size="small"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4.5}>
              <TextField
                fullWidth
                size="small"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
                required
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={handleSelectChange("gender")}
                >
                  {genderOptions.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Address Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Street Number"
                type="number"
                value={formData.streetNumber}
                onChange={handleInputChange("streetNumber")}
              />
            </Grid>

            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                size="small"
                label="Street Name"
                value={formData.streetName}
                onChange={handleInputChange("streetName")}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="City"
                value={formData.city}
                onChange={handleInputChange("city")}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="State"
                value={formData.state}
                onChange={handleInputChange("state")}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Country"
                value={formData.country}
                onChange={handleInputChange("country")}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Postal Code"
                value={formData.postcode}
                onChange={handleInputChange("postcode")}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Contact Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange("phone")}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Cell Phone"
                value={formData.cell}
                onChange={handleInputChange("cell")}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          User updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
