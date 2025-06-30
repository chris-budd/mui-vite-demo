import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";

// Customer data interface
interface Customer {
  id: string;
  name: {
    first: string;
    last: string;
    title: string;
  };
  email: string;
  phone: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  plan: string;
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
  avatar: string;
  totalSpent: number;
}

// Plan segmentation data
const planSegmentationData = [
  { id: 0, value: 45, label: "Enterprise", color: "#3f51b5" },
  { id: 1, value: 30, label: "Professional", color: "#2196f3" },
  { id: 2, value: 20, label: "Standard", color: "#4caf50" },
  { id: 3, value: 5, label: "Basic", color: "#ff9800" },
];

// Customer growth data by location
const locationGrowthData = [
  { location: "North America", customers: 1543, growth: 12 },
  { location: "Europe", customers: 892, growth: 8 },
  { location: "Asia Pacific", customers: 654, growth: 25 },
  { location: "Latin America", customers: 321, growth: 15 },
  { location: "Africa", customers: 156, growth: 18 },
  { location: "Middle East", customers: 134, growth: 22 },
];

export default function Customers() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);

  // Fetch customers from API
  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://user-api.builder-io.workers.dev/api/users?page=${page + 1}&perPage=${pageSize}&search=${searchQuery}`,
        );
        const data = await response.json();

        // Transform API data to match our Customer interface
        const transformedCustomers: Customer[] = data.data.map((user: any) => ({
          id: user.login.uuid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: {
            city: user.location.city,
            state: user.location.state,
            country: user.location.country,
          },
          plan: ["Basic", "Standard", "Professional", "Enterprise"][
            Math.floor(Math.random() * 4)
          ],
          status: ["Active", "Inactive", "Pending"][
            Math.floor(Math.random() * 3)
          ] as "Active" | "Inactive" | "Pending",
          joinDate: user.registered.date,
          avatar: user.picture.thumbnail,
          totalSpent: Math.floor(Math.random() * 50000) + 1000,
        }));

        setCustomers(transformedCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [page, pageSize, searchQuery]);

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Get status chip color
  const getStatusColor = (
    status: string,
  ): "success" | "warning" | "default" => {
    switch (status) {
      case "Active":
        return "success";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "customer",
      headerName: "Customer",
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={params.row.avatar} sx={{ width: 32, height: 32 }}>
            {params.row.name.first[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {params.row.name.title} {params.row.name.first}{" "}
              {params.row.name.last}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
      sortable: false,
    },
    {
      field: "location",
      headerName: "Location",
      width: 180,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {params.row.location.city}, {params.row.location.state}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.location.country}
          </Typography>
        </Box>
      ),
      sortable: false,
    },
    {
      field: "plan",
      headerName: "Plan",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color={
            params.value === "Enterprise"
              ? "primary"
              : params.value === "Professional"
                ? "secondary"
                : "default"
          }
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={getStatusColor(params.value)}
          variant="filled"
        />
      ),
    },
    {
      field: "totalSpent",
      headerName: "Total Spent",
      width: 120,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: "joinDate",
      headerName: "Join Date",
      width: 120,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EmailRoundedIcon />}
          label="Email"
          onClick={() => window.open(`mailto:${params.row.email}`)}
        />,
        <GridActionsCellItem
          icon={<PhoneRoundedIcon />}
          label="Call"
          onClick={() => window.open(`tel:${params.row.phone}`)}
        />,
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => console.log("Edit customer:", params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => console.log("Delete customer:", params.id)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header */}
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
            Add Customer
          </Button>
          <Button variant="outlined">Import Customers</Button>
        </Box>
      </Stack>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Customer Plan Distribution
              </Typography>
              <Box
                sx={{
                  height: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PieChart
                  series={[
                    {
                      data: planSegmentationData,
                      arcLabel: (item) => `${item.value}%`,
                      arcLabelMinAngle: 20,
                      innerRadius: 60,
                      paddingAngle: 2,
                      cornerRadius: 4,
                      valueFormatter: (value) => `${value}%`,
                    },
                  ]}
                  height={300}
                  slotProps={{
                    legend: {
                      position: { vertical: "middle", horizontal: "right" },
                      direction: "column",
                      itemMarkWidth: 10,
                      itemMarkHeight: 10,
                      markGap: 5,
                      itemGap: 8,
                    },
                  }}
                  margin={{ right: 120 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Customer Growth by Region
              </Typography>
              <Box sx={{ height: 320 }}>
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: locationGrowthData.map((item) => item.location),
                      tickLabelStyle: {
                        angle: -45,
                        textAnchor: "end",
                        fontSize: 10,
                      },
                    },
                  ]}
                  series={[
                    {
                      data: locationGrowthData.map((item) => item.customers),
                      label: "Total Customers",
                      color: "#3f51b5",
                    },
                    {
                      data: locationGrowthData.map((item) => item.growth),
                      label: "Growth %",
                      color: "#4caf50",
                      yAxisKey: "rightAxis",
                    },
                  ]}
                  yAxis={[
                    { id: "leftAxis", label: "Customers" },
                    { id: "rightAxis", label: "Growth %", position: "right" },
                  ]}
                  height={300}
                  margin={{ top: 10, bottom: 80, left: 60, right: 60 }}
                  slotProps={{
                    legend: {
                      position: { vertical: "top", horizontal: "middle" },
                      itemMarkWidth: 10,
                      itemMarkHeight: 10,
                      markGap: 5,
                      itemGap: 10,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            placeholder="Search customers by name, email, or location..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card variant="outlined">
        <DataGrid
          rows={customers}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: 1,
              borderColor: "divider",
            },
          }}
        />
      </Card>
    </Box>
  );
}
