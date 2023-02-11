import CreateSpotForm from './CreateSpotForm';

import './CreateSpotPage.css';

const CreateSpotPage = () => {
    return (
        <div>
            <div className='create-spot-page-container'>
                <div className='create-spot-page-header'>
                    <h1>Host your Castle</h1>

                    <p>Tell us all about your Castle!</p>
                </div>

                <div className='create-spot-page-form-container'>
                    <CreateSpotForm />
                </div>

                <div className='create-spot-page-content'></div>
            </div>
        </div>
    );
};

export default CreateSpotPage;
