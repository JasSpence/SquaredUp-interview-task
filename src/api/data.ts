import axios from 'axios';
import { Request, Response } from 'express';
import { SampleData } from './types';
import { RESULT_ORDERINGS } from '../constants/ordering'

const DATA_URL = 'https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=100';

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL);
    const query = req.query;
    let results = data.results;

    if(query.sort !== undefined && typeof query.sort === "string") {
        let sortParam = query.sort;
        let params = [];
        if (sortParam.includes(",")) {
            params = sortParam.split(",");
        } else {
            params = [sortParam];
        }

        for (let i = params.length - 1; i >= 0; i--) {
            let param = params[i].trim()
            switch (param) {
                case "id":
                    results.sort((a,b) => {
                        return a.id - b.id;
                    });
                    break;
                case "-id":
                    results.sort((a,b) => {
                        return b.id - a.id;
                    });
                    break;
                case "priority": // ascending by default
                    results.sort((a,b) => {
                        return RESULT_ORDERINGS.priority.indexOf(a.priority) - RESULT_ORDERINGS.priority.indexOf(b.priority);
                    });
                    break;
                case "-priority":
                    results.sort((a,b) => {
                        return RESULT_ORDERINGS.priority.indexOf(b.priority) - RESULT_ORDERINGS.priority.indexOf(a.priority);
                    });
                    break;
                default:
                    continue; // skips ordering if not valid
            }
        }
    }

    res.send({ results });
};
