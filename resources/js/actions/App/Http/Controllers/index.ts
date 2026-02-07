import TeamController from './TeamController'
import UserController from './UserController'
import ProjectController from './ProjectController'
import TaskStatusController from './TaskStatusController'
import TaskController from './TaskController'
import Settings from './Settings'
const Controllers = {
    TeamController: Object.assign(TeamController, TeamController),
UserController: Object.assign(UserController, UserController),
ProjectController: Object.assign(ProjectController, ProjectController),
TaskStatusController: Object.assign(TaskStatusController, TaskStatusController),
TaskController: Object.assign(TaskController, TaskController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers