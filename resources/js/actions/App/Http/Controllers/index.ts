import TeamController from './TeamController'
import UserController from './UserController'
import ProjectController from './ProjectController'
import Settings from './Settings'
const Controllers = {
    TeamController: Object.assign(TeamController, TeamController),
UserController: Object.assign(UserController, UserController),
ProjectController: Object.assign(ProjectController, ProjectController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers