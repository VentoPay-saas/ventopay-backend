import SmsPayload from "../models/smsPayloadModel.js";

export const createSmsPayload = async (req, res) => {
  try {
    const { type, default: isDefault, payload } = req.body;

    if (!["twilio", "firebase"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Invalid type. Must be 'twilio' or 'firebase'." });
    }

    const newPayload = new SmsPayload({
      type,
      default: isDefault,
      payload,
    });

    await newPayload.save();
    res
      .status(201)
      .json({ message: "SMS Payload saved successfully", data: newPayload });
  } catch (error) {
    res.status(500).json({ message: "Error saving SMS payload", error });
  }
};

export const getSmsPayloads = async (req, res) => {
  try {
    let { page, per_page } = req.query;
    page = parseInt(page) || 1;
    per_page = parseInt(per_page) || 10;

    const total = await SmsPayload.countDocuments();
    const smsPayloads = await SmsPayload.find()
      .skip((page - 1) * per_page)
      .limit(per_page);

    const totalPages = Math.ceil(total / per_page);

    const baseUrl = "http://localhost:5000/api/v1/dashboard/admin/sms-payloads";
    const links = {
      first: `${baseUrl}?page=1`,
      last: `${baseUrl}?page=${totalPages}`,
      prev: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
      next: page < totalPages ? `${baseUrl}?page=${page + 1}` : null,
    };

    // Construct meta information
    const meta = {
      current_page: page,
      from: (page - 1) * per_page + 1,
      last_page: totalPages,
      links: [
        {
          url: page > 1 ? links.prev : null,
          label: "&laquo; Previous",
          active: false,
        },
        { url: `${baseUrl}?page=${page}`, label: `${page}`, active: true },
        {
          url: page < totalPages ? links.next : null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      path: baseUrl,
      per_page,
      to: Math.min(page * per_page, total),
      total,
    };

    res.status(200).json({ data: smsPayloads, links, meta });
  } catch (error) {
    res.status(500).json({ message: "Error fetching SMS payloads", error });
  }
};

export const getByTypeTwilio = async (req, res) => {
  try {
    const twilioPayloads = await SmsPayload.find({ type: "twilio" });

    res.status(200).json({
      data: twilioPayloads,
      count: twilioPayloads.length,
      message: "Twilio SMS payloads retrieved successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Twilio SMS payloads", error });
  }
};

export const getByTypeFirebase = async (req, res) => {
  try {
    const firebasePayloads = await SmsPayload.find({ type: "firebase" });

    res.status(200).json({
      data: firebasePayloads,
      count: firebasePayloads.length,
      message: "Firebase SMS payloads retrieved successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Firebase SMS payloads", error });
  }
};

export const updateTwilioPayload = async (req, res) => {
  try {
    const { payload, default: isDefault } = req.body;

    const existingPayload = await SmsPayload.findOne({ type: "twilio" });
    if (!existingPayload) {
      return res.status(404).json({ message: "Twilio SMS payload not found" });
    }

    const updatedPayload = await SmsPayload.findOneAndUpdate(
      { type: "twilio" },
      { payload, default: isDefault },
      { new: true }
    );

    res.status(200).json({
      message: "Twilio SMS payload updated successfully",
      data: updatedPayload,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Twilio SMS payload", error });
  }
};

export const updateFirebasePayload = async (req, res) => {
  try {
    const { payload, default: isDefault } = req.body;

    const existingPayload = await SmsPayload.findOne({ type: "firebase" });
    if (!existingPayload) {
      return res
        .status(404)
        .json({ message: "Firebase SMS payload not found" });
    }

    const updatedPayload = await SmsPayload.findOneAndUpdate(
      { type: "firebase" },
      { payload, default: isDefault },
      { new: true }
    );

    res.status(200).json({
      message: "Firebase SMS payload updated successfully",
      data: updatedPayload,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Firebase SMS payload", error });
  }
};
