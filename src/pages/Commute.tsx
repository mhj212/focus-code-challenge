import React, { useState, useCallback } from 'react'
import client from '../api/client'
import { gql } from '@apollo/client'

interface CommuteMethod {
    numberOfCommuters: number;
    method: string;
}

interface CommuteState {
    popularCommuteMethod: CommuteMethod | null;
    totalCommuters: number;
}

const CommutePage: React.FC = () => {
    const [searchStateOne, setSearchStateOne] = useState<string>('');
    const [searchStateTwo, setSearchStateTwo] = useState<string>('');
    const [searchYear, setSearchYear] = useState<string>('');
    const [commuteData, setCommuteData] = useState<{ stateOne: CommuteState, stateTwo: CommuteState } | null>(null);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const clearSearches = (): void => {
        setSearchStateOne('');
        setSearchStateTwo('');
        setSearchYear('');
        setCommuteData(null);
        setShowResults(false);
        setShowLoading(false);
        setError('');
    }

    const fetchData = useCallback(async (): Promise<void> => {
        if (!searchStateOne || !searchStateTwo || !searchYear) return;
        setShowLoading(true);
        setCommuteData(null);
        setError('');
        try {
            const query = gql`
                query($state: String!, $year: String!) {
                    states(name: $state) {
                        commuteMethods(year: $year) {
                            numberOfCommuters
                            method
                        }
                    }
                }
            `;

            const dataStateOne = await client.query({
                query,
                variables: { state: searchStateOne, year: searchYear },
            });
            const dataStateTwo = await client.query({
                query,
                variables: { state: searchStateTwo, year: searchYear },
            });

            const processCommuteData = (commuteMethods: CommuteMethod[]) => {
                let totalCommuters = 0;
                let maxCommuters = 0;
                let popularMethod: CommuteMethod = { numberOfCommuters: 0, method: '' };

                for (const item of commuteMethods) {
                    totalCommuters += item.numberOfCommuters;
                    if (item.numberOfCommuters > maxCommuters) {
                        maxCommuters = item.numberOfCommuters;
                        popularMethod = item;
                    }
                }

                return { popularCommuteMethod: popularMethod, totalCommuters };
            };

            const stateOneData = processCommuteData(dataStateOne.data.states[0].commuteMethods);
            const stateTwoData = processCommuteData(dataStateTwo.data.states[0].commuteMethods);

            if(!stateOneData.popularCommuteMethod.method || !stateTwoData.popularCommuteMethod.method ) {
                setError('No data');
                return;
            }
            setCommuteData({ stateOne: stateOneData, stateTwo: stateTwoData });
            setShowResults(true);
        } catch (e) {
            setError('Failed to fetch data. Please try again.');
            console.log('Error fetching data:', e);
        } finally {
            setShowLoading(false);
        }
    }, [searchStateOne, searchStateTwo, searchYear]);

    return (
        <div>
            <div className="container">
                <label htmlFor="state-one">Enter state 1</label>
                <input
                    value={searchStateOne}
                    onChange={(evt) => setSearchStateOne(evt.target.value)}
                    name="state-one"
                    type="text"
                />
                <label htmlFor="state-two">Enter state 2</label>
                <input
                    value={searchStateTwo}
                    onChange={(evt) => setSearchStateTwo(evt.target.value)}
                    name="state-two"
                    type="text"
                />
                <label htmlFor="year">Enter year</label>
                <input
                    value={searchYear}
                    onChange={(evt) => setSearchYear(evt.target.value)}
                    name="year"
                    type="text"
                />
                <button className="btn" onClick={fetchData} style={{ marginRight: '8px' }} type="submit">Search</button>
                <button className="btn" onClick={clearSearches}>Clear Search</button>
            </div>
            {showLoading && <div style={{ textAlign: 'center', marginTop: '8px' }}>Loading...</div>}
            {error && <div style={{ textAlign: 'center', marginTop: '8px', color: 'red' }}>{error}</div>}
            {showResults && commuteData && (
                <div className="container" style={{ width: '80%' }}>
                    <ul style={{ textAlign: 'center', listStyleType: 'none', padding: '0' }}>
                        {commuteData.stateOne.popularCommuteMethod && (
                            <li>Most Popular Commute Method for State 1: {commuteData.stateOne.popularCommuteMethod.method}</li>
                        )}
                        {commuteData.stateTwo.popularCommuteMethod && (
                            <li>Most Popular Commute Method for State 2: {commuteData.stateTwo.popularCommuteMethod.method}</li>
                        )}
                        <li>Total Number of Commuters for State 1: {commuteData.stateOne.totalCommuters}</li>
                        <li>Total Number of Commuters for State 2: {commuteData.stateTwo.totalCommuters}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CommutePage;
