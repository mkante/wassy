import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const { log } = console;

let app;
const PORT = 6666;
let server;

global.API_HOST = `http://127.0.0.1:${PORT}`;

beforeAll((done) => {
  app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  app.get('/document', (req, res) => {
    res.status(202).send('<div>Hello</div>');
  });

  app.get('/users', (req, res) => {
    res.status(200).json(['DMX', 'HOV', 'RAKIM']);
  });
  app.post('/users', (req, res) => {
    res.status(201).json(req.body);
  });
  app.put('/users', (req, res) => {
    res.status(201).json(req.body);
  });
  app.get('/users/100', (req, res) => {
    res.status(400).json({ id: 100 });
  });
  app.get('/users/200', (req, res) => {
    res.status(500).json({ id: 200 });
  });
  app.get('/users/500', (req, res) => {
    res.status(200).json({
      id: 500,
      name: 'wassy',
      likes: '2k',
    });
  });

  app.get('/friends', (req, res) => {
    res.status(200).json({
      products: [
        {
          id: 1,
          name: 'product_1',
        },
        {
          id: 2,
          name: 'product_2',
        },
      ],
    });
  });

  app.use('OPTIONS', (req, res) => {
    res.status(200).send();
  });

  server = app.listen(PORT, () => {
    // PORT = server.address().port;
    log(`Server listening on ${API_HOST}`);
    done();
  });
});

afterAll(() => {
  server.close();
  log('Server stopped.');
});
