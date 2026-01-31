import TeamController from './TeamController'
import UserController from './UserController'
import ProjectController from './ProjectController'
import TaskController from './TaskController'
import Settings from './Settings'
const Controllers = {
    TeamController: Object.assign(TeamController, TeamController),
UserController: Object.assign(UserController, UserController),
ProjectController: Object.assign(ProjectController, ProjectController),
TaskController: Object.assign(TaskController, TaskController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers