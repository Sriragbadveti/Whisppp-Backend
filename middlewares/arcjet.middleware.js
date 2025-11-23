import aj from "../lib/arcjet.js";

export async function arcjetProtection(req, res, next) {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded . Please try again" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied" });
      } else {
        return res
          .status(403)
          .json({ message: "Access denied by security policy" });
      }
    }

    next();
  } catch (error) {
    res.status(400).send({ message: "Arc jet protection error" });
  }
}
