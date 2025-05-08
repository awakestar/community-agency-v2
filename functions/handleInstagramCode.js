const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
admin.initializeApp();

const FB_APP_ID = "YOUR_INSTAGRAM_CLIENT_ID";
const FB_APP_SECRET = "YOUR_INSTAGRAM_CLIENT_SECRET";
const REDIRECT_URI = "https://yourdomain.com/ig-callback.html";

exports.handleInstagramCode = functions.https.onRequest(async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Missing auth code." });

    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${FB_APP_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("Token exchange failed");

    const longRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${tokenData.access_token}`
    );
    const longData = await longRes.json();
    if (!longData.access_token) throw new Error("Long-lived token fetch failed");

    await admin.firestore().collection("instagram_tokens").add({
      token: longData.access_token,
      expires_in: longData.expires_in,
      created: Date.now()
    });

    res.status(200).json({ message: "Instagram connected successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
