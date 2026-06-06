const sanitize = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  }
};

export const mongoSanitize = (req, res, next) => {
  // Sanitize body and params
  sanitize(req.body);
  sanitize(req.params);

  // Sanitize query keys safely in Express 5 (mutate keys without re-assigning req.query object)
  if (req.query) {
    for (const key in req.query) {
      if (key.startsWith('$') || key.includes('.')) {
        delete req.query[key];
      } else if (typeof req.query[key] === 'object') {
        sanitize(req.query[key]);
      }
    }
  }

  next();
};
