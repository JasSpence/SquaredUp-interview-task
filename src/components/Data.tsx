import { SampleData } from "api/types";
import axios from 'axios';
import { useEffect, useState } from "react";

type Props = {
  url: string;
};

function Data({ url }: Props) {
    const [data, setData] = useState<SampleData | undefined>(undefined);

    /**
     * Gets the data.
     * Hint: consider using the react-query library that is ready to go!
     * */
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            const { data: allData } = await axios.get<SampleData>(url);

            if (mounted) {
                setData(allData)
            }
        }

        fetchData();

        return () => { mounted = false; }
    }, [url])

    if (!data) {
        return 'loading data...';
    }

    return (
        <div className='border p-4'>
            <pre className='text-sm'>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export default Data
