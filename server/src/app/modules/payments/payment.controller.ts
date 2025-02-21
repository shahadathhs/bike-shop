import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'

import { configuration } from '../../config/config'
import sendError from '../../errorHandling/sendError'
import simplifyError from '../../errorHandling/simplifyError'

const secretKey = configuration.stripe.secretKey
const clientURl = configuration.client.url

const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quantity, price, productName, email, productId } = req.body

    // * step 1: create a stripe instance
    const stripe = new Stripe(secretKey)

    // * step 2: generate a random 32 byte string
    const randomString = crypto.randomUUID()

    // * step 2: create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName
            },
            unit_amount: Math.round(price * 100)
          },
          quantity: quantity
        }
      ],
      metadata: { productId, email },
      mode: 'payment',
      success_url: `${clientURl}/checkout/success?${randomString}=${randomString}&productId=${productId}&${randomString}2=${randomString}&email=${email}&quantity=${quantity}&${randomString}3=${randomString}&price=${price}`,
      cancel_url: `${clientURl}/checkout/cancel?productId=${productId}`
    })

    // * step 3: send the session id to the client
    res.json({ success: true, session, message: 'Checkout session created successfully.' })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

export const paymentController = {
  createCheckoutSession: createCheckoutSession
}
