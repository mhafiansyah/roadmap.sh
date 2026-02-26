export type UnitCategory = 'length' | 'mass' | 'temperature';

export interface ConvertRequest {
    value: number;
    from: string;
    to: string;
    category: UnitCategory;
}