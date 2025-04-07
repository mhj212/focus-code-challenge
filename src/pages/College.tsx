import React, { useState, useCallback } from 'react';
import client from '../api/client';
import { gql } from '@apollo/client';

interface CollegeConcentration {
    year: number;
    numberAwarded: number;
    area: string;
}

interface State {
    id: string;
    name: string;
    collegeConcentrations: CollegeConcentration[];
}

interface Data {
    states: State[];
}

const CollegePage: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [apiData, setApiData] = useState<CollegeConcentration[]>([]);
    const [showTable, setShowTable] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const clearSearch = (): void => {
        setSearch('');
        setApiData([]);
        setShowTable(false);
        setShowLoading(false);
    };

    const fetchData = useCallback(async (stateName: string): Promise<void> => {
        if (!stateName) return;
        setShowLoading(true);
        setApiData([]);
        setShowTable(false);

        try {
            const { data } = await client.query<Data>({
                query: gql`
          query {
            states(name: "${stateName}") {
              id
              name
              collegeConcentrations {
                year
                numberAwarded
                area
              }
            }
          }
        `,
            });
            if (data.states.length > 0) {
                setApiData(data.states[0].collegeConcentrations);
                setShowTable(true);
            } else {
                setApiData([]);
                setShowTable(false);
            }
        } catch (error) {
            console.error('Error fetching', error);
        } finally {
            setShowLoading(false);
        }
    }, []);

    return (
        <div>
            <div className="container">
                <label htmlFor="state">Enter a state</label>
                <input
                    value={search}
                    onChange={(evt) => setSearch(evt.target.value)}
                    name="state"
                    type="text"
                />
                <button
                    className="btn"
                    onClick={() => fetchData(search)}
                    style={{ marginRight: '8px' }}
                    type="button"
                >
                    Search
        </button>
                <button className="btn" onClick={clearSearch}>
                    Clear Search
        </button>
            </div>

            <div className="table-div">
                {showLoading && <div>Loading...</div>}
                {showTable && (
                    <table>
                        <thead>
                            <tr>
                                <th>College Concentration</th>
                                <th>Number of People Awarded</th>
                                <th>Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiData.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.area}</td>
                                    <td>{item.numberAwarded}</td>
                                    <td>{item.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CollegePage;
