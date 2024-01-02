import config from '../config';

//Pages
import Home from '../pages/Home';
import History from '../pages/History';
import Login from '../pages/Login';

//public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.history, component: History },
    { path: config.routes.login, component: Login, layout: null },
];

export { publicRoutes };
