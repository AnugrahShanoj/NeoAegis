const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Controller for creating an order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    // Create an order with Razorpay
    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt: `receipt_${Date.now()}`, // Unique receipt ID
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ success: false, error: 'Failed to create payment order' });
  }
};

// Controller for verifying payment
exports.verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Generate a signature using Razorpay secret
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, error: 'Invalid payment signature' });
  }
};
