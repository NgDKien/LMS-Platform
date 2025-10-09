/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    api: {
        projectId: '1dxjkk6e',
        dataset: 'production'
    },
    deployment: {
        appId: 'i35w7obqkpnn0kxyc623wt05'
    }
})
