import express from 'express';
import path from 'path';

import './config/config';
import './util/helpers';

import * as viewController from './controllers/view.controller';

const app = express();

const staticDirectory = path.join(__dirname, '..', 'public');
app.use(express.static(staticDirectory));
app.set('view engine', 'hbs');

app.get('/', viewController.get);
app.get('/gallery/:id', viewController.getImage);

export default app;
