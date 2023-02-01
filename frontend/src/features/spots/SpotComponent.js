import './SpotComponent.css';

const SpotComponent = ({ spot }) => {
    const spotLocation = `${spot.city}, ${spot.state}`;

    return (
        <div className='spot-container'>
            <div className='spot-image-container'>
                <img
                    className='spot-image'
                    // src={spot.previewImage}
                    src={
                        'https://a0.muscache.com/im/pictures/miso/Hosting-749996089802009824/original/8fefceb0-da83-461c-9441-1dc5ce1c0174.jpeg'
                    }
                    alt='Spot Preview'
                />
            </div>
            <div className='spot-info-container'>
                <div className='spot-info'>
                    <h2 className='spot-name'>{spotLocation}</h2>
                    <p className='spot-description'>{spot.description}</p>
                </div>
            </div>
        </div>
    );
};

export default SpotComponent;
