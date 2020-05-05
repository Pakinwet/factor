/* eslint-disable @typescript-eslint/camelcase */
import { addEndpoint, addFilter } from "@factor/api"
import Stripe from "stripe"
import { savePost } from "@factor/api/server"
import { EndpointMeta } from "@factor/endpoint/types"
import { SubscriptionResult, SubscriptionCustomerData, PlanInfo } from "./types"

const getStripe = (): Stripe => {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

  if (!STRIPE_SECRET_KEY) {
    throw new Error("Stripe private key is missing.")
  }

  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2020-03-02" })
}

export const createSubscription = async (
  { paymentMethodId, subscriptionPlanId }: SubscriptionCustomerData,
  { bearer }: EndpointMeta
): Promise<SubscriptionResult> => {
  if (!bearer) {
    throw new Error("Bearer user is not defined")
  }
  const stripe = getStripe()

  let stripeCustomerId = bearer.stripeCustomerId
  let stripeCustomer: Stripe.Customer

  if (!stripeCustomerId) {
    // This creates a new Customer and attaches the PaymentMethod in one API call.
    stripeCustomer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: bearer.email,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    stripeCustomerId = stripeCustomer.id

    await savePost(
      {
        data: { _id: bearer._id, stripeCustomerId: stripeCustomer.id },
        postType: "user",
      },
      { bearer }
    )
  } else {
    stripeCustomer = (await stripe.customers.retrieve(
      stripeCustomerId
    )) as Stripe.Customer
  }

  const stripeSubscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ plan: subscriptionPlanId as string }],
    expand: ["latest_invoice.payment_intent"],
  })

  return {
    status: "success",
    customer: stripeCustomer,
    subscription: stripeSubscription,
  }
}

/**
 * Retrieve Stripe plan by Id
 * @reference https://stripe.com/docs/api/plans/retrieve?lang=node
 * @param id - Stripe plan ID
 */
export const retrievePlan = async ({ id }: { id: string }): Promise<PlanInfo> => {
  const stripe = getStripe()

  const plan = await stripe.plans.retrieve(id)
  let product = {}
  if (typeof plan.product == "string") {
    product = await stripe.products.retrieve(plan.product)
  }
  return { plan, product }
}

const setup = (): void => {
  addEndpoint({ id: "pluginCheckout", handler: { createSubscription, retrievePlan } })

  addFilter({
    key: "addStripeInfo",
    hook: "schema-definition-user",
    callback: (definition) => {
      definition.stripeCustomerId = {
        type: String,
      }
      return definition
    },
  })
}

setup()
