import express from 'express';


const makeAsyncMiddleware = (fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>): express.RequestHandler => async (req, res, next) => {
  try {
    await fn(req, res, next);
  }
  catch (err) {
    next(err);
  }
};

export default makeAsyncMiddleware;
