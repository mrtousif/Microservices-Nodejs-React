import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@mmkgittix/common';
import { createTicketsRouter } from './routes/new';
import { showTicketRouter } from './routes/find-one';
import { indexTicketRouter } from './routes/find-all';
import { updateTicketRouter } from './routes/update';


// cookie here is for transporting jwt
const app = express();
app.set('trust proxy', true); // to trust https traffic from a proxy (ingress)
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test' // only https connections are allowed in prod and dev
}));

app.use(currentUser);

app.use(createTicketsRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);



app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };