import app from "./app";
import config from "./config/app.config";

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});
