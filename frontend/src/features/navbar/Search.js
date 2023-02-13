import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { searchSpots } from '../spots/spotsSlice';

import './Search.css';

const Search = () => {
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const searchInputRef = useRef(null);
    const searchResults = useSelector((state) => {
        const filteredSpots = searchSpots(state.spot.spots, searchText);

        return filteredSpots;
    });

    const [inputStyle, setInputStyle] = useState({
        position: 'relative',
        zIndex: 100,
    });

    useEffect(() => {
        if (searchText.length === 0) {
            setInputStyle({
                position: 'relative',
                zIndex: 100,
            });

            return;
        }

        setInputStyle({
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            boxShadow: '2px -2px 10px 0 rgba(0, 0, 0, 0.2)',
        });
    }, [searchText]);

    const searchItemClicked = (e, result) => {
        navigate(`/spots/${result.id}`);

        setSearchText('');
    };

    return (
        <div id='search-container'>
            <input
                id='search-input'
                type='text'
                placeholder='Search'
                value={searchText}
                style={inputStyle}
                onBlur={(e) => {
                    setTimeout(() => {
                        setSearchText('');
                    }, 250);
                }}
                onChange={(e) => setSearchText(e.target.value)}
            />

            {searchText.length > 0 && searchResults.length > 0 && (
                <div
                    id='search-results-container'
                    ref={searchInputRef}
                    onBlur={() => setSearchText('')}
                >
                    {searchResults.map((result, resultIndex) => (
                        <div
                            className='search-result-item'
                            key={resultIndex}
                            onClick={(e) => searchItemClicked(e, result)}
                        >
                            <p className='search-result-item__name'>
                                {result.name}
                            </p>

                            <div className='search-result-item__details'>
                                {result.city && result.city !== 'N/A' && (
                                    <p className='search-result-item__city'>
                                        {result.city}
                                    </p>
                                )}
                                {result.state && result.state !== 'N/A' && (
                                    <p className='search-result-item__state'>
                                        {result.state}
                                    </p>
                                )}
                                <p className='search-result-item__country'>
                                    {result.country}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
