import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Agrega tus credenciales (esto está bien)
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-5809958438707351-110315-30d6c0e161f6f1ecb73bbb0c12a6e723-2964223083' });

app.get('/ping', (req, res) => {
    res.send('pong');
});

// --- RUTA MODIFICADA ---
// Ahora lee los 'items' que envía el frontend desde req.body
app.post('/create_preference', (req, res) => {
    
    const { items } = req.body; // Recibimos los items del frontend

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Faltan items para crear la preferencia' });
    }

    const mpItems = items.map(item => ({
        title: item.title,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.price),
        currency_id: 'ARS' 
    }));

    const preference = new Preference(client);

    preference.create({
        body: {
            items: mpItems,
            back_urls: {
                 // Puedes dejar estas URLs de ejemplo o poner las de tu sitio real si las tienes
                 success: "http://www.tusitio.com/success", // (Ejemplo)
                 failure: "http://www.tusitio.com/failure", // (Ejemplo)
                 pending: "http://www.tusitio.com/pending"  // (Ejemplo)
            },
            // auto_return: "approved", // <-- LÍNEA ELIMINADA O COMENTADA
        }
    })
        .then((data) => {
            console.log("Preferencia creada:", data.id);
            res.status(200).json({
                preference_id: data.id,
            });
        })
        .catch((error) => {
            // Ahora veremos este error en la consola del server.js
            console.error('Error creando la preferencia:', error); 
            res.status(500).json({ error: 'Error creando la preferencia' });
        });
            
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});