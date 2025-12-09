import axios from 'axios';
import { Request, Response } from 'express';
import { SampleData } from './types';
import { getPercents } from './utils';

// Want 500 datapoints of type problem for priority percentages
const DATA_URL = 'https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=500&type=problem';

export interface Parameter {
    parameter: keyof SampleData['results'][0];
    types: {
        label: string;
        categories: string[];
    }[];
}

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL);
    const types = [
        {label: "high", categories: ["high"]},
        {label: "medium", categories: ["normal"]},
        {label: "low", categories: ["low"]}
    ]
    const parameter = {
        parameter: "priority" as keyof SampleData['results'][0],
        types
    }
    const percentages = getPercents(data, parameter);
    res.json(percentages);
};