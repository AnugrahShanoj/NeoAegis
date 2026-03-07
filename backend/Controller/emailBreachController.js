const logActivity = require("../Utils/activityLogger");
const axios       = require('axios');

exports.emailBreachCheck = async (req, res) => {
  console.log("Inside emailBreachController");
  const { email }  = req.query;
  const { userId } = req.payload; // ✅ extract userId

  try {
    const response = await axios.get(`https://leakcheck.io/api/public?check=${email}`);

    // ✅ derive found count from the actual API response
    const found = response.data.found || 0;

    await logActivity({
      userId,
      type:        "breach_scan",
      title:       "Email Breach Scan",
      description: "Scanned " + email + " — " + found + " breach" + (found !== 1 ? "es" : "") + " found",
    });

    res.json(response.data);

  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json("Server Error");
  }
};