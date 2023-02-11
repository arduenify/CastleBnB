import './ErrorPage.css';

const ErrorPage = ({ status, message }) => {
    return (
        <div className='error-page'>
            <div className='error-page-content'>
                {status && <h1 className='error-page-status'>{status}</h1>}

                <p className='error-page-message'>
                    {message || 'Something went wrong.'}
                </p>
            </div>
        </div>
    );
};

export default ErrorPage;
