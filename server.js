import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-5809958438707351-110315-30d6c0e161f6f1ecb73bbb0c12a6e723-2964223083' });

app.get('/ping', (req, res) => {
    res.send('pong');
});


//ruta para preferencia meradopago
app.post('/create_preference', (req, res) => {
    const preference = new Preference(client);

    preference.create({
        body: {
            items: [
                {
                    title: 'Mi producto',
                    quantity: 1,
                    unit_price: 2000
                }
            ],
        }
    })
        .then((data) => {
            console.log(data);
            res.status(200).json({
                preference_id: data.id,
                preference_url: data.init_point,
            });
        })
        .catch(() => {
            res.status(500).json({ error: 'Error creando la preferencia' });
        });
            
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

