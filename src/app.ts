import * as bodyParser from "body-parser";
import * as express from 'express';
import * as expressWinston from 'express-winston';
import * as swaggerUI from 'swagger-ui-express';
import * as winston from 'winston';
import { APIRoute} from "./routes/api";
import { CartRoute } from './routes/cart';
import { errorHandler } from "./lib/errorHandler";
import * as swaggerDoc from '../swagger.json';
export class App {
  public app: express.Application;
  public apiRoutes: APIRoute = new APIRoute();
  public cartRoutes: CartRoute = new CartRoute();

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.apiRoutes.routes(this.app);
    this.cartRoutes.routes(this.app);
    this.app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
    this.app.use(expressWinston.errorLogger({transports: [new winston.transports.Console()]}));
    this.app.use(errorHandler);
  }

  public async listen() {
    const PORT = parseInt(process.env.PORT || '3000');
    this.app.listen(PORT, () => {
        console.log(`App is listening on ${PORT}`);
    })
  }
}

export default new App().app;