import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import UsersTable from "../components/UsersTable";

export default function Customers() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header with action buttons */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3, display: { xs: "none", sm: "flex" } }}
      >
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
        <Button variant="contained" startIcon={<AddRoundedIcon />}>
          Add Customer
        </Button>
      </Stack>

      {/* Mobile header */}
      <Stack sx={{ mb: 3, display: { xs: "flex", sm: "none" } }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Customers
        </Typography>
        <Button variant="contained" startIcon={<AddRoundedIcon />} fullWidth>
          Add Customer
        </Button>
      </Stack>

      {/* Users Table */}
      <UsersTable />
    </Box>
  );
}
