import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import UserTable from "../components/UserTable";

export default function Customers() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, pt: 1.5 }}>
        Customer Data
      </Typography>
      <Typography paragraph sx={{ mb: 4 }}>
        Manage your customer database with advanced search and filtering
        capabilities.
      </Typography>
      <UserTable />
    </Box>
  );
}
