<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { BreadcrumbItem } from '@/types';
import tasks from '@/routes/tasks';
import projects from '@/routes/projects';
import { Plus, GripVertical, Calendar, User, Flag } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';
import CreateTaskStatus from './CreateTaskStatus.vue';
import CreateTask from './CreateTask.vue';
import EditTask from './EditTask.vue';

interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
}

interface TeamMember {
    id: number;
    name: string;
}

interface AssignedUser {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    priority: string;
    due_date: string;
    assigned_to: number | null;
    assigned_user?: AssignedUser;
    order: number;
}

interface TaskStatus {
    id: number;
    name: string;
    color: string;
    order: number;
    tasks: Task[];
}

interface Props {
    project: Project;
    statuses: TaskStatus[];
    teamMembers: TeamMember[];
}

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Projects', href: projects.index().url },
    { title: props.project.name, href: tasks.index(props.project).url },
];

// Modals
const isCreateStatusOpen = ref(false);
const isCreateTaskOpen = ref(false);
const isEditTaskOpen = ref(false);
const selectedTask = ref<Task | null>(null);
const selectedStatusId = ref<number | null>(null);

// Drag and drop
const draggedTask = ref<Task | null>(null);
const draggedOverStatus = ref<number | null>(null);

function onDragStart(task: Task) {
    draggedTask.value = task;
}

function onDragOver(event: DragEvent, statusId: number) {
    event.preventDefault();
    draggedOverStatus.value = statusId;
}

function onDragLeave() {
    draggedOverStatus.value = null;
}

function onDrop(event: DragEvent, statusId: number) {
    event.preventDefault();

    if (!draggedTask.value) return;

    const status = props.statuses.find(s => s.id === statusId);
    if (!status) return;

    // Calculate new order (append to end)
    const newOrder = status.tasks.length;

    router.put(
        `/projects/${props.project.id}/tasks/${draggedTask.value.id}/status`,
        {
            task_status_id: statusId,
            order: newOrder,
        },
        {
            preserveScroll: true,
            onSuccess: () => {
                draggedTask.value = null;
                draggedOverStatus.value = null;
            },
        }
    );
}

function openCreateTask(statusId: number) {
    selectedStatusId.value = statusId;
    isCreateTaskOpen.value = true;
}

function openEditTask(task: Task) {
    selectedTask.value = task;
    isEditTaskOpen.value = true;
}

function getPriorityColor(priority: string) {
    const colors: Record<string, string> = {
        low: 'bg-blue-100 text-blue-700 border-blue-200',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        high: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[priority] || 'bg-slate-100 text-slate-700';
}
</script>

<template>
    <Head :title="`Tasks - ${props.project.name}`" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-6 bg-slate-50 min-h-screen">

            <!-- Header -->
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900">{{ props.project.name }}</h1>
                    <p class="mt-1 text-slate-600">{{ props.project.description }}</p>
                </div>
                <Button
                    @click="isCreateStatusOpen = true"
                    class="bg-teal-600 text-white hover:bg-teal-700 shadow-sm font-medium"
                >
                    <Plus class="mr-2 h-4 w-4" /> Add Status
                </Button>
            </div>

            <!-- Kanban Board -->
            <div class="flex gap-4 overflow-x-auto pb-4">
                <div
                    v-for="status in props.statuses"
                    :key="status.id"
                    class="flex-shrink-0 w-80"
                >
                    <!-- Status Column -->
                    <div class="bg-slate-100 rounded-lg">
                        <!-- Status Header -->
                        <div
                            class="px-4 py-3 rounded-t-lg"
                            :style="{ backgroundColor: status.color }"
                        >
                            <div class="flex items-center justify-between">
                                <h3 class="font-semibold text-white">
                                    {{ status.name }}
                                    <span class="ml-2 text-sm opacity-90">({{ status.tasks.length }})</span>
                                </h3>
                                <Button
                                    size="sm"
                                    @click="openCreateTask(status.id)"
                                    class="bg-white/20 hover:bg-white/30 text-white border-0 h-7 w-7 p-0"
                                >
                                    <Plus class="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <!-- Drop Zone -->
                        <div
                            @dragover="onDragOver($event, status.id)"
                            @dragleave="onDragLeave"
                            @drop="onDrop($event, status.id)"
                            :class="[
                                'min-h-[200px] p-3 space-y-3 rounded-b-lg transition-colors',
                                draggedOverStatus === status.id ? 'bg-teal-50 ring-2 ring-teal-400' : ''
                            ]"
                        >
                            <!-- Task Cards -->
                            <div
                                v-for="task in status.tasks"
                                :key="task.id"
                                draggable="true"
                                @dragstart="onDragStart(task)"
                                @click="openEditTask(task)"
                                class="bg-white rounded-lg border border-slate-200 p-4 cursor-move hover:shadow-md transition-shadow"
                            >
                                <!-- Task Title -->
                                <div class="flex items-start gap-2 mb-2">
                                    <GripVertical class="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                    <h4 class="font-medium text-slate-900 flex-1">{{ task.title }}</h4>
                                </div>

                                <!-- Task Description -->
                                <p v-if="task.description" class="text-sm text-slate-600 line-clamp-2 mb-3">
                                    {{ task.description }}
                                </p>

                                <!-- Task Meta -->
                                <div class="flex items-center justify-between gap-2">
                                    <!-- Priority Badge -->
                                    <span
                                        :class="[
                                            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize',
                                            getPriorityColor(task.priority)
                                        ]"
                                    >
                                        <Flag class="h-3 w-3 mr-1" />
                                        {{ task.priority }}
                                    </span>

                                    <div class="flex items-center gap-2 text-xs text-slate-500">
                                        <!-- Due Date -->
                                        <div v-if="task.due_date" class="flex items-center gap-1">
                                            <Calendar class="h-3 w-3" />
                                            {{ new Date(task.due_date).toLocaleDateString() }}
                                        </div>

                                        <!-- Assigned User -->
                                        <div v-if="task.assigned_user" class="flex items-center gap-1">
                                            <User class="h-3 w-3" />
                                            {{ task.assigned_user.name }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty State -->
                            <div
                                v-if="status.tasks.length === 0"
                                class="text-center py-8 text-slate-400 text-sm"
                            >
                                No tasks yet
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State for No Statuses -->
                <div
                    v-if="props.statuses.length === 0"
                    class="flex-1 flex items-center justify-center min-h-[400px]"
                >
                    <div class="text-center">
                        <h3 class="text-lg font-semibold text-slate-900 mb-2">No task statuses yet</h3>
                        <p class="text-slate-600 mb-4">Create your first status to get started</p>
                        <Button
                            @click="isCreateStatusOpen = true"
                            class="bg-teal-600 text-white hover:bg-teal-700"
                        >
                            <Plus class="mr-2 h-4 w-4" /> Create Status
                        </Button>
                    </div>
                </div>
            </div>

        </div>

        <!-- Modals -->
        <CreateTaskStatus
            v-model:open="isCreateStatusOpen"
            :project="props.project"
        />

        <CreateTask
            v-model:open="isCreateTaskOpen"
            :project="props.project"
            :status-id="selectedStatusId"
            :team-members="props.teamMembers"
            @close="isCreateTaskOpen = false"
        />

        <EditTask
            v-if="selectedTask"
            v-model:open="isEditTaskOpen"
            :task="selectedTask"
            :project="props.project"
            :team-members="props.teamMembers"
            @close="isEditTaskOpen = false"
        />
    </AppLayout>
</template>
