import { useState, Fragment } from 'react';
import { VALID_SORT_PARAMS } from "../constants/ordering";

type Props = {
    url: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
};

export default function SortSelector({ url, setUrl }: Props) {
    const [selected, setSelected] = useState<string>("id"); // sorts by id by default

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value);
        if (url.includes('sort')) {
            console.log("1");
            let newUrlArr = url.split("sort");
            if (newUrlArr[1].includes('&')) {
                setUrl(newUrlArr[0] + `sort=${e.target.value}` + newUrlArr[1].slice(newUrlArr[1].indexOf('&') + 1));
            } else {
                setUrl(newUrlArr[0] + `sort=${e.target.value}`);
            }
        } else {
            if (url.includes("?")) { // other queries
                console.log("2");
                setUrl(`${url}&sort=${e.target.value}`);
            } else {
                console.log("3");
                setUrl(`${url}?sort=${e.target.value}`);
            }
        }
    };

    return (
        <div>
            <label htmlFor='sort'>Sort By:</label>
            <select id='sort' value={selected} onChange={handleChange}>
                {VALID_SORT_PARAMS.map((param) => (
                    <Fragment key={param}>
                        <option value={`+${param}`}>
                            {param.toUpperCase()}: Low to High
                        </option>
                        <option value={`-${param}`}>
                            {param.toUpperCase()}: High to Low
                        </option>
                    </Fragment>
                ))}
            </select>
        </div>
    )
}