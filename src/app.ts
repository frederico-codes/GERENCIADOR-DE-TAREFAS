import express from 'express';
import { errorHandling } from './middewares/error-handling';
import "express-async-errors";
import { routes } from './routes';

const app = express();


app.use(express.json());
app.use(routes);

// app.get('/', (req, res) => {
//   res.send('API de Gerenciamento de Tarefas');
// });


app.use(errorHandling);
export {app};
