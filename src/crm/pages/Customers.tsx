import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import UserTable from "../components/UserTable";
import Copyright from "../../dashboard/internals/components/Copyright";

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
        <Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{ mr: 1 }}
          >
            New Customer
          </Button>
          <Button variant="outlined" startIcon={<AddRoundedIcon />}>
            Import
          </Button>
        </Box>
      </Stack>

      {/* Mobile header */}
      <Box sx={{ display: { xs: "block", sm: "none" }, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Customers
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            size="small"
            fullWidth
          >
            New Customer
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            size="small"
            fullWidth
          >
            Import
          </Button>
        </Stack>
      </Box>

      {/* User Table */}
      <Box sx={{ mb: 3 }}>
        <UserTable />
      </Box>

      <Copyright sx={{ mt: 3, mb: 4 }} />
    </Box>
  );
}
