import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAssetPath } from "../utils/paths";

function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardActionArea
                onClick={() => navigate("/statistics")}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "75%", // 4:3 aspect ratio
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={getAssetPath("/images/image1.png")}
                    alt="Food Statistics"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      bgcolor: "background.paper",
                    }}
                  />
                </Box>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    align="center"
                  >
                    Food Tasting Statistics
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    View detailed statistics about our food tasting experiments
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardActionArea
                onClick={() => navigate("/battle")}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "75%", // 4:3 aspect ratio
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={getAssetPath("/images/image2.png")}
                    alt="Battle Statistics"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      bgcolor: "background.paper",
                    }}
                  />
                </Box>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    align="center"
                  >
                    Battle Statistics
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Compare statistics between different groups
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default HomePage;
