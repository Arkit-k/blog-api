import express from 'express';
import { setupRoutes } from './routes'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

setupRoutes(app);

app.listen(PORT, () =.{
      console.log(`server running on port ${PORT}`);
})