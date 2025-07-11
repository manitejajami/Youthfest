import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GUPSHUP_API_KEY = process.env.GUPSHUP_API_KEY;
const GUPSHUP_SOURCE = process.env.GUPSHUP_SOURCE;
const WHATSAPP_GROUP_LINK = process.env.WHATSAPP_GROUP_LINK;

const gupshupSend = async (destination, message) => {
  return axios.post(
    'https://api.gupshup.io/sm/api/v1/msg',
    null,
    {
      params: {
        channel: 'whatsapp',
        source: GUPSHUP_SOURCE,
        destination,
        message: message,
        'src.name': 'RegistrationBot'
      },
      headers: { apikey: GUPSHUP_API_KEY }
    }
  );
};

export const sendRegistrationSuccess = async (candidate) => {
  await gupshupSend(candidate.whatsapp, `Hello ${candidate.name}, your registration is successful!`);
};

export const sendGroupJoin = async (candidate) => {
  await gupshupSend(candidate.whatsapp, `Dear ${candidate.name}, please join our event WhatsApp group: ${WHATSAPP_GROUP_LINK}`);
};

export const sendReminder = async (candidate, when) => {
  await gupshupSend(candidate.whatsapp, `Reminder: The event is in ${when}. See you soon!`);
};

export const sendDailyInspiration = async (candidate) => {
  const inspiration = "Today's inspiration: 'Success is not final, failure is not fatal: it is the courage to continue that counts.'";
  await gupshupSend(candidate.whatsapp, inspiration);
};