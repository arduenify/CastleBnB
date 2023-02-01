import SpotsGridComponent from '../spots/SpotsGridComponent';
import './LandingPageComponent.css';

export const LandingPageComponent = () => {
    return (
        <div className='landing-page-container'>
            <div className='landing-page-content'>
                <SpotsGridComponent />
            </div>
        </div>
    );
};

export default LandingPageComponent;
