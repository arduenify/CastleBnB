import SpotsGrid from '../spots/spotsGrid/SpotsGrid';
import './LandingPage.css';

export const LandingPage = () => {
    return (
        <div className='landing-page-container'>
            <div className='landing-page-content'>
                <SpotsGrid />
            </div>
        </div>
    );
};

export default LandingPage;
