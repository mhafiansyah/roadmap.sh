import { type UnitCategory } from "./converter.types.js";

const RATIOS: Record<string, number> = {
  // Length (Base: meters)
    meters: 1,
    kilometers: 1000,
    miles: 1609.34,
    feet: 0.3048,
    centimeters: 0.01,
    millimeters: 0.001,
    inches: 0.0254,
    yards: 0.9144,

    // Weight (Base: grams)
    grams: 1,
    kilograms: 1000,
    pounds: 453.592,
    ounces: 28.3495,
    milligrams: 0.001,
};

export const convertUnits = (
    value: number,
    from: string,
    to: string,
    category: UnitCategory
):number => {
    if (category === 'temperature') {
        return convertTemperature(value, from, to);
    }

    const fromRatio = RATIOS[from.toLowerCase()];
    const toRatio = RATIOS[to.toLowerCase()];

    if (!fromRatio || !toRatio) throw new Error("Unsupported unit to convert");

    return (value * fromRatio) / toRatio;
}

const convertTemperature = (
    value: number,
    from: string,
    to: string
):number => {
    let celsius:number;
    const f = from.toLowerCase();
    const t = to.toLowerCase();

    if (f === t) return value;

    switch (f) {
        case 'celsius': celsius = value; break;
        case 'fahrenheit': celsius = (value - 32) * (5 / 9); break;
        case 'kelvin': celsius = value - 273.15; break;
        default: throw new Error ('Unsupported unit to convert from');
    }

    switch (t) {
        case 'celsius': return celsius;
        case 'fahrenheit': return (celsius * 9) / 5 + 32;
        case 'kelvin': return celsius + 273.15;
        default: throw new Error ('Unsupported unit to convert to');
    }
}