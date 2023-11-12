const Payment = require("../models/Payment");
const Plan = require("../models/Plan");
const validator = require("validator");
const config = require("../config");
const stripe = require("stripe")(config.payment_stripe.stripe_secret);

//httpStatus key words
const httpStatusText = require("../utils/httpStatusText");

// @desc     create payment order
// @route    POST api/payment/createPayment
// @access   protected/User
exports.createPayment = async (req, res) => {
  // app settings
  const taxPrice = 0;
  // console.log(req.user.id)
  // 1) Get Plan Type and Duration (1 month or 12 month)
  const planType = req.body.planType;
  const planDuration = req.body.planDuration;
  const validPlanTypes = ["basic", "premium"];
  const validPlanDurations = [1, 12];

  //****Validation****//
  if (
    !(
      validPlanTypes.includes(planType) &&
      validPlanDurations.includes(planDuration)
    )
  ) {
    return res.json({
      statsu: httpStatusText.FAIL,
      data: { title: "invalid inputs, please try again." },
    });
  }
  //********/
  // 2) Get Plan Price depending on Plan Type and Duration
  const selectedPlan = await Plan.findOne({
    where: {
      name: planType,
      duration: planDuration,
    },
  });
  const planPrice = selectedPlan.price;
  // 3) Payment Logic
};

// @desc    get checkout session from strip and send it as a response
// @route   POST /api/payment/checkout-session
// @access  protected/user
exports.checkoutSession = async (req, res) => {
  // app settings
  const taxPrice = 0;
  // console.log(req.user.id)
  // 1) Get Plan Type and Duration (1 month or 12 month)
  const planType = req.body.planType;
  const planDuration = req.body.planDuration;
  const validPlanTypes = ["basic", "premium"];
  const validPlanDurations = [1, 12];

  //****Validation****//
  if (
    !(
      validPlanTypes.includes(planType) &&
      validPlanDurations.includes(planDuration)
    )
  ) {
    return res.json({
      statsu: httpStatusText.FAIL,
      data: { title: "invalid inputs, please try again." },
    });
  }
  //********/

  // 2) Get Plan Price depending on Plan Type and Duration
  const selectedPlan = await Plan.findOne({
    where: {
      name: planType,
      duration: planDuration,
    },
  });
  const planPrice = selectedPlan.price;

  // 3) Payment Logic (Create strip checkout session)
  console.log(req.user.email);
  const userFullName = `${req.user.firstName} ${req.user.lastName}`;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1OATzTJrs5sOVzzzBRkydkj3",
        // price_data: {

        //   currency: "usd",
        //   product_data:{
        //     name:"basic",
        //   },
        //   unit_amount: planPrice * 100,
        // },
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${req.protocol}://${req.get('host')}/success`, //Here the domain address typed statically and this will make problems when deploying the app on real servers so we use dynamic domains success_url:`${req.protocol}://${req.get('host')}/success`.
    cancel_url: `${req.protocol}://${req.get('host')}/dashboard`,// Here the domain address typed statically and this will make problems when deploying the app on real servers so we use dynamic domains cancel_url:`${req.protocol}://${req.get('host')}/dashboard`.
    // customer_email:req.user.email,
    // client_reference_id:req.params.id,
    customer_email: req.user.email,
  });

  // 4) Send session to response
  res.json({
    status: httpStatusText.SUCCESS,
    data: {
      title: "",
      session: session,
    },
  });
};

// @desc
// @route
// @access
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc  
// @route
// @access
exports.webhookCheckout = async (req, res) => {
  let event = res.body;
  // Replace this endpoint secret with your endpoint's unique secret
  // If you are testing with the CLI, find the secret by running 'stripe listen'
  // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
  // at https://dashboard.stripe.com/webhooks
  const endpointSecret = config.payment_stripe.signing_secret;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }
  let subscription;
  let status;
  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      const customerSubscriptionCreated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      console.log('subscription created Bara')
      break;
    case 'customer.subscription.deleted':
      const customerSubscriptionDeleted = event.data.object;
      // Then define and call a function to handle the event customer.subscription.deleted
      console.log('subscription expired Bara')

      break;
    case 'customer.subscription.trial_will_end':
      const customerSubscriptionTrialWillEnd = event.data.object;
      // Then define and call a function to handle the event customer.subscription.trial_will_end
      console.log('subscription trial end Bara')

      break;
    case 'customer.subscription.updated':
      const customerSubscriptionUpdated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.updated
      console.log('subscription updated end Bara')

      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.send();
};