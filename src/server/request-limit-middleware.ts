
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import type { NextApiRequest, NextApiResponse } from 'next';
import requestIp from 'request-ip';

const getIP = ({ headers }: NextApiRequest) => (
  requestIp.getClientIp({ headers })
)

const limit = 20
const windowMs = 300 * 1_000
const delayAfter = Math.round(limit / 2)
const delayMs = 400

const middlewares = [
  // @ts-expect-error request mismatch
  slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  // @ts-expect-error request mismatch
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
]

const applyMiddleware = (middleware: typeof middlewares[number]) => (request: NextApiRequest, response: NextApiResponse) =>
  new Promise((resolve, reject) => {
    // @ts-expect-error type mismatch
    middleware(request, response, (result: unknown) =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  })


async function applyRateLimit(request: NextApiRequest, response: NextApiResponse) {
  await Promise.all(
    middlewares
      .map(applyMiddleware)
      .map(middleware => middleware(request, response))
  )
}

export default applyRateLimit
