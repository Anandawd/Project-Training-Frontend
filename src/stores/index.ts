import {createStore} from 'vuex';

import authModule from './auth';
import uiModule from './ui';
import configModule from './config';

export default createStore({
    modules: {
        auth: authModule,
        ui: uiModule,
        // config: configModule
    }
});
