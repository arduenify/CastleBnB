import { Route, Routes } from 'react-router-dom';
import LoginFormComponent from '../features/user/LoginFormComponent';

function App() {
    return (
        <Routes>
            <Route
                exact
                path='/'
                element={<h1>Home Page</h1>}
            />
            <Route
                exact
                path='/login'
                element={<LoginFormComponent />}
            />
        </Routes>
    );
}

export default App;
