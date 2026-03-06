import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';

import guessRoutes from './modules/guess/guess.routes.js'
import adminRoutes from './modules/admin/admin.routes.js';


// auth middleware
const requireAuth = async (req: any, res: any, next: any) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});

	if (!session) {
        console.log('Unauthorized access');
		return res.status(401).json({ error: "Unauthorized" });
	}

	// Attach session to request for use in route handlers
	req.session = session;
	next();
};

const app = express();

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());
app.use(cors({
    // origin: "http://localhost:5173",
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // credentials: true,
}));
app.use('/', guessRoutes);
app.use('/admin', requireAuth, adminRoutes);

app.get('/api/me', async(req, res) => {
    const result = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!result || !result.session) {
        return res.json({message: 'not authenticated'});
    }

    return res.json(result);
});
app.post('/sign-in', async(req, res) => {
    const { email, password } = req.body;

    const session = await auth.api.signInEmail({
        body: {
            email,
            password
        },
        asResponse: true
    });

    session.headers.forEach((value, key) => {
        res.setHeader(key, value);
    });

    return res.json(await session.json());
})
app.post('/sign-up', async(req, res) => {
    const { name, email, password } = req.body;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        },
    });

    return res.send(data);
})
app.post('/sign-out', async(req, res) => {
    try {
        const authResponse = await auth.api.signOut({
            headers: fromNodeHeaders(req.headers),
            asResponse: true,
        });

        authResponse.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        res.send("sign out success");
    } catch (error) {
        console.error(error);
        res.send("failed to logout");
    }
})
app.get('/api/protected', requireAuth, (req: any, res) => {
    res.json({
        message: "this is a protected route",
        user: req.session
    })
})

// app.get('/', (req, res) => {
//     // res.json({ message: "Welcome!" });
// });

export { app };