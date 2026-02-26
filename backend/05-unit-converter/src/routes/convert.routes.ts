import { Router } from "express";
import { convertUnits } from "../modules/converter/converter.logic.js";

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: "Welcome!" });
})

router.post('/api/convert', (req, res) => {
    const { value, from, to, category } = req.body;

    if (value === undefined || !from || !to || !category) {
        res.status(404).json({ error: "Missing required fields." });
    }
    
    try {
        const result = convertUnits(value, from, to, category);
        res.json({
            original: value,
            from,
            to,
            result: Number(result.toFixed(4))
        });
    } catch (error: any) {
        res.status(404).json({
            error: error.message
        })
    }
})

export default router;