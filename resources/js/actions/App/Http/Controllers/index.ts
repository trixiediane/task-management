import TeamController from './TeamController'
import Settings from './Settings'
const Controllers = {
    TeamController: Object.assign(TeamController, TeamController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers