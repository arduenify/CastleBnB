import './SpotComponent.css';

const SpotComponent = ({ spot }) => {
    const spotLocation = () => {
        let location = '';

        if (spot.city !== 'N/A') location += `${spot.city}, `;
        if (spot?.state !== 'N/A') location += `${spot.state}, `;
        if (spot.country) location += `${spot.country}`;

        return location;
    };

    return (
        <div className='spot-container'>
            <div className='spot-image-container'>
                <img
                    className='spot-image'
                    src={`/images/${spot.previewImage}`}
                    alt='Spot Preview'
                />
            </div>

            <div className='spot-info-container'>
                <div className='spot-info'>
                    <h2 className='spot-name'>{spotLocation()}</h2>
                    <p className='spot-description'>{spot.description}</p>
                </div>
            </div>
        </div>
    );
};

export default SpotComponent;
