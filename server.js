const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG_JSON))
});
const db = admin.firestore();

app.use(cors());
app.use(bodyParser.json());

app.post('/locatie', async (req, res) => {
  const { userId, lat, lon } = req.body;
  if (!userId || !lat || !lon) return res.status(400).send('Invalid payload');

  await db.collection('locations').doc(userId).set({
    lat, lon,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  res.send({ success: true });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});