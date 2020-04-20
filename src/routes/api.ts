import { getApi, getJwtToken } from '../controller/api';

export class APIRoute {
  public routes(app): void {
    app.route('/api').get(getApi);
    app.route('/api/jwtToken').get(getJwtToken);
  }
}