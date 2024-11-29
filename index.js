const { Hono } = require('hono');
const axios = require('axios');

const app = new Hono();
const PORT = 3000;

// Funktion zum Abrufen der UUID von Mojang
async function getUUID(username) {
  try {
    const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    if (response.data && response.data.id) {
      return response.data.id;
    }
    return null;
  } catch (error) {
    console.error('Fehler beim Abrufen der UUID:', error);
    return null;
  }
}

// Middleware zum Umleiten von Username zu UUID, falls nötig
const resolveUUID = async (c, next) => {
  const identifier = c.req.param('uuidOrUsername');
  if (identifier.length <= 16) {
    const uuid = await getUUID(identifier);
    if (uuid) {
      c.req.param('uuidOrUsername', uuid); // Dies könnte ggf. ein Fehler sein, falls es nicht so funktioniert
    } else {
      return c.json({ error: 'User not found' }, 404);
    }
  }
  await next();
};

// Route für Avatars
app.get('/avatars/:uuidOrUsername', resolveUUID, (c) => {
  const uuidOrUsername = c.req.param('uuidOrUsername');
  return c.redirect(`https://crafatar.com/avatars/${uuidOrUsername}`);
});

// Route für Head Render
app.get('/renders/head/:uuidOrUsername', resolveUUID, (c) => {
  const uuidOrUsername = c.req.param('uuidOrUsername');
  return c.redirect(`https://crafatar.com/renders/head/${uuidOrUsername}`);
});

// Route für Body Render
app.get('/renders/body/:uuidOrUsername', resolveUUID, (c) => {
  const uuidOrUsername = c.req.param('uuidOrUsername');
  return c.redirect(`https://crafatar.com/renders/body/${uuidOrUsername}`);
});

// Route für Skins
app.get('/skins/:uuidOrUsername', resolveUUID, (c) => {
  const uuidOrUsername = c.req.param('uuidOrUsername');
  return c.redirect(`https://crafatar.com/skins/${uuidOrUsername}`);
});

// Route für Capes
app.get('/capes/:uuidOrUsername', resolveUUID, (c) => {
  const uuidOrUsername = c.req.param('uuidOrUsername');
  return c.redirect(`https://crafatar.com/capes/${uuidOrUsername}`);
});

// Server starten
app.fire();  // Verwende `app.fire()` anstelle von `app.listen()` für Bun
console.log(`Server running on http://localhost:${PORT}`);
