const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
admin.initializeApp();

const CLIENT_KEY = "YOUR_TIKTOK_CLIENT_KEY";
const CLIENT_SECRET = "YOUR_TIKTOK_CLIENT_SECRET";
const REDIRECT_URI = "https://your-community-app.web.app/tiktok_callback.html";

exports.handleTikTokCode = functions.https.onRequest(async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Missing TikTok code." });

    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error(JSON.stringify(tokenData));

    await admin.firestore().collection("tiktok_tokens").add({
      token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      open_id: tokenData.open_id,
      scope: tokenData.scope,
      created: Date.now()
    });

    res.status(200).json({ message: "TikTok connected successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
