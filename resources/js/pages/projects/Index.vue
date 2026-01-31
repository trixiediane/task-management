<script setup lang="ts">
import { ref } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import Create from './Create.vue';
import Edit from './Edit.vue';
import projects from '@/routes/projects';
import { BreadcrumbItem } from '@/types';
import { ChevronLeft, ChevronRight, Plus, Edit as EditIcon, Calendar, Users, User, Clock } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Projects', href: projects.index().url },
];

// Modal states
const isCreateProjectOpen = ref(false);
const isEditProjectOpen = ref(false);
const selectedProject = ref(null as null | any);

function openCreateProject() { isCreateProjectOpen.value = true; }
function closeCreateProject() { isCreateProjectOpen.value = false; }

function openEditProject(project: any) {
    selectedProject.value = project;
    isEditProjectOpen.value = true;
}
function closeEditProject() {
    selectedProject.value = null;
    isEditProjectOpen.value = false;
}

// Props from Inertia
interface Team { id: number; name: string }
interface Project {
    id: number;
    team_id: number;
    owner_id: number;
    name: string;
    description: string;
    status: string;
    start_date: string;
    due_date: string;
    owner?: { id: number; name: string };
    team?: { id: number; name: string };
}
interface PaginationLink { url: string | null; label: string; active: boolean }
interface PaginatedProjects {
    data: Project[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}
interface Props {
    projects: PaginatedProjects;
    teams: Team[];
}
const props = defineProps<Props>();

// Pagination handler
function goToPage(url: string | null) {
    if (!url) return;
    router.visit(url, { preserveState: true, preserveScroll: true });
}

// Status badge color helper
function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        'planning': 'bg-blue-100 text-blue-700 border-blue-200',
        'active': 'bg-green-100 text-green-700 border-green-200',
        'on-hold': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'completed': 'bg-teal-100 text-teal-700 border-teal-200',
        'cancelled': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
}
</script>

<template>

    <Head title="Project Management" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-6 bg-slate-50 min-h-screen">

            <!-- Header -->
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Project Management</h1>
                    <p class="mt-2 text-slate-600">Create, organize, and manage your projects efficiently</p>
                </div>
                <Button @click="openCreateProject"
                    class="bg-teal-600 text-white shadow-sm hover:bg-teal-700 hover:shadow-md transition-all font-medium cursor-pointer">
                    <Plus class="mr-2 h-4 w-4" /> Create Project
                </Button>
            </div>

            <!-- Stats Header -->
            <div class="mb-6 flex items-center gap-3 rounded-lg bg-white border border-slate-200 px-5 py-4 shadow-sm">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                    <span class="text-lg font-bold text-teal-600">{{ props.projects.total }}</span>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-900">Total Projects</p>
                    <p class="text-xs text-slate-500">
                        {{ props.projects.total === 1 ? '1 project' : `${props.projects.total} projects` }} across all
                        pages
                    </p>
                </div>
            </div>

            <!-- Cards Grid -->
            <div v-if="props.projects.data.length > 0"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div v-for="project in props.projects.data" :key="project.id"
                    class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">

                    <!-- Card Header -->
                    <div class="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
                        <h3 class="text-lg font-semibold text-white tracking-wide truncate">{{ project.name }}</h3>
                        <div class="mt-2">
                            <span
                                :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize', getStatusColor(project.status)]">
                                {{ project.status }}
                            </span>
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div class="px-6 py-4 space-y-4">

                        <!-- Description -->
                        <div>
                            <p class="text-sm text-slate-600 line-clamp-3">
                                {{ project.description || 'No description provided.' }}
                            </p>
                        </div>

                        <!-- Details Grid -->
                        <div class="space-y-3 pt-2 border-t border-slate-100">

                            <!-- Owner -->
                            <div class="flex items-center gap-2">
                                <User class="h-4 w-4 text-slate-400" />
                                <span class="text-xs text-slate-500 font-medium">Owner:</span>
                                <span class="text-sm text-slate-700 font-medium">{{ project.owner?.name || '-' }}</span>
                            </div>

                            <!-- Team -->
                            <div class="flex items-center gap-2">
                                <Users class="h-4 w-4 text-slate-400" />
                                <span class="text-xs text-slate-500 font-medium">Team:</span>
                                <span class="text-sm text-slate-700 font-medium">{{ project.team?.name || '-' }}</span>
                            </div>

                            <!-- Date Range -->
                            <div class="flex items-start gap-2">
                                <Calendar class="h-4 w-4 text-slate-400 mt-0.5" />
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs text-slate-500 font-medium">Start:</span>
                                        <span class="text-sm text-slate-700">
                                            {{ project.start_date ? new Date(project.start_date).toLocaleDateString() :
                                            '-' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="text-xs text-slate-500 font-medium">Due:</span>
                                        <span class="text-sm text-slate-700">
                                            {{ project.due_date ? new Date(project.due_date).toLocaleDateString() : '-'
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- Card Footer -->
                    <div class="px-6 py-4 bg-slate-50 border-t border-slate-100">
                        <Button size="sm" @click="openEditProject(project)"
                            class="w-full bg-teal-600 text-white hover:bg-teal-700 shadow-sm font-medium transition-colors">
                            <EditIcon class="mr-2 h-4 w-4" /> Update Project
                        </Button>
                    </div>

                </div>
            </div>

            <!-- Empty State -->
            <div v-if="props.projects.data.length === 0"
                class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div class="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5">
                    <h2 class="text-lg font-semibold text-white tracking-wide">Your Projects</h2>
                </div>
                <div class="px-6 py-16 text-center">
                    <div
                        class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 border-2 border-teal-100">
                        <Plus class="h-10 w-10 text-teal-400" />
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-slate-900">No projects yet</h3>
                    <p class="mb-6 text-slate-600">Get started by creating your first project.</p>
                    <Button @click="openCreateProject"
                        class="bg-teal-600 text-white hover:bg-teal-700 shadow-sm font-medium">
                        <Plus class="mr-2 h-4 w-4" /> Create Your First Project
                    </Button>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="props.projects.data.length > 0"
                class="rounded-lg border border-slate-200 bg-white shadow-sm px-6 py-4">
                <div class="flex items-center justify-between">
                    <!-- Showing info -->
                    <div class="text-sm text-slate-600">
                        Showing
                        <span class="font-semibold text-slate-900">{{ props.projects.from }}</span>
                        to
                        <span class="font-semibold text-slate-900">{{ props.projects.to }}</span>
                        of
                        <span class="font-semibold text-slate-900">{{ props.projects.total }}</span>
                        results
                    </div>

                    <!-- Pagination buttons -->
                    <div class="flex items-center gap-2">
                        <!-- Previous button -->
                        <Button variant="outline" size="sm" @click="goToPage(props.projects.links[0].url)"
                            :disabled="!props.projects.links[0].url"
                            class="border-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium">
                            <ChevronLeft class="h-4 w-4" />
                            Previous
                        </Button>

                        <!-- Page number buttons (desktop) -->
                        <div class="hidden sm:flex items-center gap-1">
                            <template v-for="(link, index) in props.projects.links" :key="index">
                                <Button v-if="index !== 0 && index !== props.projects.links.length - 1"
                                    variant="outline" size="sm" @click="goToPage(link.url)" :disabled="!link.url"
                                    :class="[
                                        link.active
                                            ? 'bg-teal-600 text-white hover:bg-teal-700 border-teal-600 font-semibold'
                                            : 'border-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-slate-300',
                                        'min-w-[2.5rem] disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium'
                                    ]" v-html="link.label" />
                            </template>
                        </div>

                        <!-- Page info (mobile) -->
                        <div class="flex items-center gap-2 sm:hidden">
                            <span class="text-sm text-slate-600 font-medium">
                                Page {{ props.projects.current_page }} of {{ props.projects.last_page }}
                            </span>
                        </div>

                        <!-- Next button -->
                        <Button variant="outline" size="sm"
                            @click="goToPage(props.projects.links[props.projects.links.length - 1].url)"
                            :disabled="!props.projects.links[props.projects.links.length - 1].url"
                            class="border-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium">
                            Next
                            <ChevronRight class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

        </div>

        <!-- Create Modal -->
        <Create v-model:open="isCreateProjectOpen" :teams="props.teams" @close="closeCreateProject" />

        <!-- Edit Modal -->
        <Edit v-if="selectedProject" v-model:open="isEditProjectOpen" :project="selectedProject" :teams="props.teams"
            @close="closeEditProject" />
    </AppLayout>
</template>