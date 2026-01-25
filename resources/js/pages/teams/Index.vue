<script setup lang="ts">
import AssignUsersDialog from '@/components/teams/AssignUsersDialog.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/AppLayout.vue';
import teams from '@/routes/teams';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Plus, CheckCircle2, X } from 'lucide-vue-next';
import { ref, watch } from 'vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teams',
        href: teams.index().url,
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface TeamUserAssignment {
    team_id: number;
    user_id: number;
}

interface Team {
    id: number;
    name: string;
    created_by: string;
    updated_by: string;
    updated_at?: string;
    users?: User[];
}

interface Props {
    teams: Team[];
    users: User[];
    teamUserAssignments: TeamUserAssignment[];
}

const props = defineProps<Props>();
const page = usePage();
const showAlert = ref(false);
const selectedTeam = ref<Team | null>(null);
const isDialogOpen = ref(false);
let alertTimeout: ReturnType<typeof setTimeout> | null = null;

function openAssignDialog(team: Team) {
    selectedTeam.value = team;
    isDialogOpen.value = true;
}

function closeDialog() {
    isDialogOpen.value = false;
}

watch(
    () => page.props.flash,
    (flash) => {
        if (flash?.message) {
            if (alertTimeout) clearTimeout(alertTimeout);

            showAlert.value = false;

            requestAnimationFrame(() => {
                showAlert.value = true;
                alertTimeout = setTimeout(() => {
                    showAlert.value = false;
                    alertTimeout = null;
                }, 5000);
            });
        }
    },
    { deep: true }
);


if (page.props.flash?.message) {
    showAlert.value = true;
    alertTimeout = setTimeout(() => {
        showAlert.value = false;
        alertTimeout = null;
    }, 5000);
}
</script>
<template>

    <Head title="Team Management" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-x-full opacity-0"
            enter-to-class="translate-x-0 opacity-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-x-0 opacity-100" leave-to-class="translate-x-full opacity-0">
            <Alert v-if="showAlert && page.props.flash?.message"
                class="fixed top-4 right-4 z-50 w-96 border-green-200 bg-white text-green-800 shadow-xl">
                <CheckCircle2 class="h-5 w-5 text-green-600" />
                <AlertTitle class="text-green-900">Success!</AlertTitle>
                <AlertDescription class="text-green-700">
                    {{ page.props.flash.message }}
                </AlertDescription>
                <button @click="showAlert = false"
                    class="absolute top-2 right-2 rounded-full p-1 text-green-600 transition-colors hover:bg-green-100 hover:text-green-800"
                    aria-label="Close notification">
                    <X :size="16" />
                </button>
            </Alert>
        </Transition>

        <div class="p-6">
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Team Management</h1>
                    <p class="mt-1 text-sm text-slate-600">Manage and organize your teams</p>
                </div>
                <Link :href="teams.create.url()">
                    <Button class="bg-teal-600 shadow-md hover:bg-teal-700 hover:shadow-lg">
                        <Plus class="mr-2 h-4 w-4" />
                        Create Team
                    </Button>
                </Link>
            </div>

            <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
                <div class="bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-4">
                    <h2 class="text-lg font-semibold text-white">Your Teams</h2>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow class="border-b-2 border-slate-200 bg-slate-50 hover:bg-slate-50">
                            <TableHead class="h-11 px-5 font-semibold text-slate-900">Name</TableHead>
                            <TableHead class="h-11 px-5 font-semibold text-slate-900">Created By</TableHead>
                            <TableHead class="h-11 px-5 font-semibold text-slate-900">Updated</TableHead>
                            <TableHead class="h-11 px-5 text-center font-semibold text-slate-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="team in props.teams" :key="team.id"
                            class="border-b border-slate-100 transition-all hover:bg-teal-50/50">
                            <TableCell class="px-5 py-4">
                                <span class="font-medium text-slate-900">{{ team.name }}</span>
                            </TableCell>
                            <TableCell class="px-5 py-4">
                                <span class="font-medium text-slate-900">
                                    {{ team.created_by?.name ?? 'N/A' }}
                                </span>
                            </TableCell>
                            <TableCell class="px-5 py-4">
                                <span class="text-sm text-slate-600">
                                    {{ team.updated_at ? new Date(team.updated_at).toLocaleDateString() : '-' }}
                                </span>
                            </TableCell>
                            <TableCell class="px-5 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <Link :href="teams.edit(team.id).url">
                                        <Button variant="outline" size="sm"
                                            class="hover:bg-teal-50 hover:text-teal-700">
                                            Update
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="sm" @click="openAssignDialog(team)">
                                        Assign Users
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div v-if="props.teams.length === 0" class="px-5 py-12 text-center">
                    <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <Plus class="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 class="mb-2 text-lg font-semibold text-slate-900">No teams yet</h3>
                    <p class="mb-4 text-sm text-slate-600">Get started by creating your first team.</p>
                    <Link :href="teams.create.url()">
                        <Button class="bg-teal-600 hover:bg-teal-700">
                            <Plus class="mr-2 h-4 w-4" />
                            Create Your First Team
                        </Button>
                    </Link>
                </div>
            </div>

            <div class="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3">
                <span class="text-sm text-slate-600">Total Teams:</span>
                <span class="rounded bg-teal-100 px-2 py-1 text-sm font-semibold text-teal-700">
                    {{ props.teams.length }}
                </span>
            </div>
        </div>

        <AssignUsersDialog v-model:open="isDialogOpen" :team="selectedTeam" :users="props.users"
            :team-user-assignments="props.teamUserAssignments" @close="closeDialog" />
    </AppLayout>
</template>