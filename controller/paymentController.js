const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Course = require('../model/course'); // Assuming your Course model is here

// Create a checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Fetch the course from the database
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create a new Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
            },
            unit_amount: course.price * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Handle Stripe webhook events
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Handle the checkout session
    // e.g., update your database with the payment status
    console.log('Payment succeeded:', session);
  }

  res.json({ received: true });
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
};
