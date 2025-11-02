import SOS from "../models/SOS.js";
import Family from "../models/Family.js";
import twilio from "twilio";

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const TWILIO_FROM = process.env.TWILIO_FROM; // optional

let twilioClient = null;
if (TWILIO_SID && TWILIO_TOKEN) {
  twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);
}

export const sendSOS = async (req, res) => {
  try {
    const userId = req.user._id;
    const { location, hospitals = [], targetHospital = null, note = "" } = req.body;

    // Save SOS log
    const sos = await SOS.create({
      family: userId,
      location,
      hospitals,
      targetHospital,
      note,
    });

    // Fetch family contacts (example: extend Family model to include contacts)
    const family = await Family.findById(userId);
    const contacts = family?.emergencyContacts || []; // array of {name, phone, email}

    // Send SMS if Twilio configured
    if (twilioClient && TWILIO_FROM && contacts.length) {
      const text = `SOS from ${family.familyName || "A family"} at https://www.google.com/maps?q=${location.lat},${location.lon} — ${ note || "No note" }`;
      await Promise.all(contacts.map(async (c) => {
        if (!c.phone) return;
        try {
          await twilioClient.messages.create({
            body: text,
            from: TWILIO_FROM,
            to: c.phone,
          });
        } catch (err) {
          console.error("Twilio send error for", c.phone, err.message);
        }
      }));
    }

    // Response
    res.json({ message: "SOS recorded and notifications queued", sos });
  } catch (err) {
    console.error("sendSOS error:", err);
    res.status(500).json({ message: "Failed to send SOS" });
  }
};
