### Notes

- `serverSelectionTimeoutMS` -> prevent function timeout issues on Vercel while connecting to the MongoDB

- `req.headers['x-forwarded-for']` can be used to get the client ip address if its behind a proxy else use `req.ip`

- `req.headers['sec-ch-ua-platform']` is used to get the client platform
- `req.headers['sec-ch-ua']` is used to get the client browser

- `extended: true` in urlencoded middleware is used to allow parsing the nested objects (uses qs lib)
  if `false` it will only allow parsing one level of nesting (uses querystring lib)

- `saveUninitialized: true` -> session will be created even if there is no data being stored
- `resave: false` -> session will not be saved if there is no change
