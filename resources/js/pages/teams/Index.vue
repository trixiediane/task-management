<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import AssignUsersDialog from '@/components/teams/AssignUsersDialog.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import AppLayout from '@/layouts/AppLayout.vue';
import teams from '@/routes/teams';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { Plus, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, watch } from 'vue';

// breadcrumbs lang para sa header 
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teams',
        href: teams.index().url,
    },
];

// basic types 
interface Team {
    id: number;
    name: string;
    created_by: {
        id: number;
        name: string;
    } | null;
    updated_at?: string;
    users?: { id: number }[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTeams {
    data: Team[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface Props {
    teams: PaginatedTeams;
}

const props = defineProps<Props>();
const page = usePage();

// flash message state 
const showAlert = ref(false);
let alertTimeout: ReturnType<typeof setTimeout> | null = null;

// assign users dialog state 
const selectedTeam = ref<Team | null>(null);
const isDialogOpen = ref(false);

// delete confirmation 
const teamToDelete = ref<number | null>(null);

// open assign users modal 
function openAssignDialog(team: Team) {
    selectedTeam.value = team;
    isDialogOpen.value = true;
}

// close modal + reset 
function closeDialog() {
    isDialogOpen.value = false;
    selectedTeam.value = null;
}

// pagination handler 
function goToPage(url: string | null) {
    if (!url) return;

    router.visit(url, {
        preserveState: true,
        preserveScroll: true,
    });
}

// actual delete after confirm 
function confirmDelete() {
    if (!teamToDelete.value) return;

    router.delete(teams.destroy(teamToDelete.value).url);
    teamToDelete.value = null;
}

// auto show/hide flash message 
watch(
    () => page.props.flash,
    (flash) => {
        if (!flash?.message) return;

        if (alertTimeout) clearTimeout(alertTimeout);

        showAlert.value = false;
        requestAnimationFrame(() => {
            showAlert.value = true;
            alertTimeout = setTimeout(() => {
                showAlert.value = false;
                alertTimeout = null;
            }, 5000);
        });
    },
    { deep: true }
);

// pag may flash agad pag load 
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
            <Alert v-show="showAlert && page.props.flash?.message"
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
                        <TableRow v-for="team in props.teams.data" :key="team.id"
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
                                    <!-- <Button @click="router.delete(teams.destroy(team.id).url)">Delete</Button> -->
                                    <AlertDialog>
                                        <AlertDialogTrigger as-child>
                                            <Button class="bg-red-700 text-white hover:bg-red-800" @click="
                                                teamToDelete = team.id
                                                ">
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you absolutely sure?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone.
                                                    This will permanently delete the
                                                    product from the database.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction @click="confirmDelete"
                                                    class="bg-red-600 hover:bg-red-700">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div v-if="props.teams.data.length === 0" class="px-5 py-12 text-center">
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

                <div v-if="props.teams.data.length > 0" class="border-t border-slate-200 bg-slate-50 px-5 py-4">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-slate-600">
                            Showing
                            <span class="font-medium text-slate-900">{{ props.teams.from }}</span>
                            to
                            <span class="font-medium text-slate-900">{{ props.teams.to }}</span>
                            of
                            <span class="font-medium text-slate-900">{{ props.teams.total }}</span>
                            results
                        </div>

                        <div class="flex items-center gap-2">
                            <Button variant="outline" size="sm" @click="goToPage(props.teams.links[0].url)"
                                :disabled="!props.teams.links[0].url"
                                class="hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50">
                                <ChevronLeft class="h-4 w-4" />
                                Previous
                            </Button>

                            <div class="hidden items-center gap-1 sm:flex">
                                <template v-for="(link, index) in props.teams.links" :key="index">
                                    <Button v-if="index !== 0 && index !== props.teams.links.length - 1"
                                        variant="outline" size="sm" @click="goToPage(link.url)" :disabled="!link.url"
                                        :class="[
                                            link.active
                                                ? 'bg-teal-600 text-white hover:bg-teal-700'
                                                : 'hover:bg-teal-50 hover:text-teal-700',
                                            'min-w-[2.5rem] disabled:cursor-not-allowed disabled:opacity-50'
                                        ]" v-html="link.label" />
                                </template>
                            </div>

                            <div class="flex items-center gap-2 sm:hidden">
                                <span class="text-sm text-slate-600">
                                    Page {{ props.teams.current_page }} of {{ props.teams.last_page }}
                                </span>
                            </div>

                            <Button variant="outline" size="sm"
                                @click="goToPage(props.teams.links[props.teams.links.length - 1].url)"
                                :disabled="!props.teams.links[props.teams.links.length - 1].url"
                                class="hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50">
                                Next
                                <ChevronRight class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3">
                <span class="text-sm text-slate-600">Total Teams:</span>
                <span class="rounded bg-teal-100 px-2 py-1 text-sm font-semibold text-teal-700">
                    {{ props.teams.total }}
                </span>
            </div>
        </div>

        <AssignUsersDialog v-model:open="isDialogOpen" :team="selectedTeam" @close="closeDialog" />
    </AppLayout>
</template>