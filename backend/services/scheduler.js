import cron from "node-cron";
import Candidate from "../models/Candidate.js";
import { sendReminder, sendDailyInspiration } from "./gupshup.js";

const EVENT_DATE = new Date(process.env.EVENT_DATE);

export const start = () => {
  cron.schedule('0 * * * *', async () => {
    const now = new Date();
    const diffHrs = (EVENT_DATE - now) / 1000 / 3600;
    let when = null;
    if (Math.abs(diffHrs - 48) < 0.5) when = "2 days";
    if (Math.abs(diffHrs - 24) < 0.5) when = "1 day";
    if (Math.abs(diffHrs - 2) < 0.5) when = "2 hours";
    if (when) {
      const candidates = await Candidate.find();
      for (const c of candidates) {
        try {
          await sendReminder(c, when);
        } catch (e) {
          console.error("Failed to send reminder to", c.whatsapp, e?.message);
        }
      }
    }
  });
  cron.schedule('0 8 * * *', async () => {
    const candidates = await Candidate.find();
    for (const c of candidates) {
      try {
        await sendDailyInspiration(c);
      } catch (e) {
        console.error("Failed to send inspiration to", c.whatsapp, e?.message);
      }
    }
  });
};