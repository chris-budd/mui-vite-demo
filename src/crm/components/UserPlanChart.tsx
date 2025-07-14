import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

// Mock data for user plan segmentation
const planData = [
  {
    id: 0,
    value: 45,
    label: "Free",
    color: "#e3f2fd",
  },
  {
    id: 1,
    value: 30,
    label: "Pro",
    color: "#1976d2",
  },
  {
    id: 2,
    value: 20,
    label: "Enterprise",
    color: "#0d47a1",
  },
  {
    id: 3,
    value: 5,
    label: "Custom",
    color: "#ff9800",
  },
];

const totalUsers = planData.reduce((sum, plan) => sum + plan.value, 0);

export default function UserPlanChart() {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          Users by Plan
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", height: 300 }}>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <PieChart
              series={[
                {
                  data: planData,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  innerRadius: 40,
                  outerRadius: 120,
                  paddingAngle: 2,
                  cornerRadius: 5,
                },
              ]}
              width={300}
              height={250}
              slotProps={{
                legend: { hidden: true },
              }}
            />
          </Box>

          <Box sx={{ flex: 1, pl: 2 }}>
            <Stack spacing={2}>
              {planData.map((plan) => (
                <Box
                  key={plan.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: plan.color,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {plan.label}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={`${plan.value}%`}
                      size="small"
                      variant="outlined"
                      sx={{ minWidth: 60 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({Math.round((plan.value / 100) * totalUsers * 25.43)}{" "}
                      users)
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Box
              sx={{ mt: 3, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Active Users
              </Typography>
              <Typography variant="h5" fontWeight="600">
                2,543
              </Typography>
              <Typography variant="body2" color="success.main">
                +12% from last month
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
