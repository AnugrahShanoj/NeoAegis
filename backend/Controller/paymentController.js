const Razorpay = require('razorpay');
const crypto = require('crypto');
const users = require('../Models/userSchema');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ success: false, error: 'Failed to create payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

  // Guard — userId must be present
  if (!userId) {
    console.error("verifyPayment called with no userId");
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  try {
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      {
        $set: {
          paymentStatus: true,
          paymentId: razorpay_payment_id,
        }
      },
      { new: true }
    );

    // If no user found with that userId return error
    if (!updatedUser) {
      console.error(`verifyPayment: No user found with userId: ${userId}`);
      return res.status(404).json({
        success: false,
        error: 'User not found. Payment recorded but account not activated.'
      });
    }

    console.log(`Payment verified. User: ${updatedUser._id} | paymentStatus: ${updatedUser.paymentStatus} | paymentId: ${updatedUser.paymentId}`);
    res.status(200).json({ success: true, message: 'Payment verified successfully' });

  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};