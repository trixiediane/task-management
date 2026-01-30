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
                class="fixed top-4 right-4 z-50 w-96 border-teal-200 bg-white text-teal-800 shadow-xl">
                <CheckCircle2 class="h-5 w-5 text-teal-600" />
                <AlertTitle class="text-teal-900 font-semibold">Success!</AlertTitle>
                <AlertDescription class="text-teal-700">
                    {{ page.props.flash.message }}
                </AlertDescription>
                <button @click="showAlert = false"
                    class="absolute top-2 right-2 rounded-full p-1 text-teal-600 transition-colors hover:bg-teal-100 hover:text-teal-800"
                    aria-label="Close notification">
                    <X :size="16" />
                </button>
            </Alert>
        </Transition>

        <div class="p-6 bg-slate-50 min-h-screen">
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Team Management</h1>
                    <p class="mt-2 text-slate-600">Create, organize, and manage your teams efficiently</p>
                </div>
                <Link :href="teams.create.url()">
                    <Button
                        class="bg-teal-600 text-white shadow-sm hover:bg-teal-700 hover:shadow-md transition-all font-medium cursor-pointer">
                        <Plus class="mr-2 h-4 w-4" />
                        Create Team
                    </Button>
                </Link>
            </div>

            <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div class="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5">
                    <h2 class="text-lg font-semibold text-white tracking-wide">Your Teams</h2>
                    <p class="text-teal-100 text-sm mt-1">{{ props.teams.total }} {{ props.teams.total === 1 ? 'team' :
                        'teams' }} total</p>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow class="border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Name</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Created By</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Updated</TableHead>
                            <TableHead
                                class="h-12 px-6 text-center font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="team in props.teams.data" :key="team.id"
                            class="border-b border-slate-100 transition-colors hover:bg-teal-50/30">
                            <TableCell class="px-6 py-4">
                                <span class="font-semibold text-slate-900">{{ team.name }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-slate-700">
                                    {{ team.created_by?.name ?? 'N/A' }}
                                </span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-sm text-slate-600">
                                    {{ team.updated_at ? new Date(team.updated_at).toLocaleDateString() : '-' }}
                                </span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <Link :href="teams.edit(team.id).url">
                                        <Button variant="outline" size="sm"
                                            class="border-teal-300 bg-white text-teal-700 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all font-medium cursor-pointer">
                                            Update
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="sm" @click="openAssignDialog(team)"
                                        class="border-slate-300 bg-white text-slate-700 hover:bg-slate-600 hover:text-white hover:border-slate-600 transition-all font-medium cursor-pointer">
                                        Assign Users
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger as-child>
                                            <Button size="sm"
                                                class="bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-all font-medium cursor-pointer"
                                                @click="
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
                                                    class="bg-rose-600 hover:bg-rose-700">
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

                <div v-if="props.teams.data.length === 0" class="px-6 py-16 text-center">
                    <div
                        class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 border-2 border-teal-100">
                        <Plus class="h-10 w-10 text-teal-400" />
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-slate-900">No teams yet</h3>
                    <p class="mb-6 text-slate-600">Get started by creating your first team.</p>
                    <Link :href="teams.create.url()">
                        <Button class="bg-teal-600 text-white hover:bg-teal-700 shadow-sm font-medium">
                            <Plus class="mr-2 h-4 w-4" />
                            Create Your First Team
                        </Button>
                    </Link>
                </div>

                <div v-if="props.teams.data.length > 0" class="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-slate-600">
                            Showing
                            <span class="font-semibold text-slate-900">{{ props.teams.from }}</span>
                            to
                            <span class="font-semibold text-slate-900">{{ props.teams.to }}</span>
                            of
                            <span class="font-semibold text-slate-900">{{ props.teams.total }}</span>
                            results
                        </div>

                        <div class="flex items-center gap-2">
                            <Button variant="outline" size="sm" @click="goToPage(props.teams.links[0].url)"
                                :disabled="!props.teams.links[0].url"
                                class="border-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium">
                                <ChevronLeft class="h-4 w-4" />
                                Previous
                            </Button>

                            <div class="hidden items-center gap-1 sm:flex">
                                <template v-for="(link, index) in props.teams.links" :key="index">
                                    <Button v-if="index !== 0 && index !== props.teams.links.length - 1"
                                        variant="outline" size="sm" @click="goToPage(link.url)" :disabled="!link.url"
                                        :class="[
                                            link.active
                                                ? 'bg-teal-600 text-white hover:bg-teal-700 border-teal-600 font-semibold'
                                                : 'border-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300',
                                            'min-w-[2.5rem] disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium'
                                        ]" v-html="link.label" />
                                </template>
                            </div>

                            <div class="flex items-center gap-2 sm:hidden">
                                <span class="text-sm text-slate-600 font-medium">
                                    Page {{ props.teams.current_page }} of {{ props.teams.last_page }}
                                </span>
                            </div>

                            <Button variant="outline" size="sm"
                                @click="goToPage(props.teams.links[props.teams.links.length - 1].url)"
                                :disabled="!props.teams.links[props.teams.links.length - 1].url"
                                class="border-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium">
                                Next
                                <ChevronRight class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex items-center gap-3 rounded-lg bg-white border border-slate-200 px-5 py-4 shadow-sm">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                    <span class="text-lg font-bold text-teal-600">{{ props.teams.total }}</span>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-900">Total Teams</p>
                    <p class="text-xs text-slate-500">Across all pages</p>
                </div>
            </div>
        </div>

        <AssignUsersDialog v-model:open="isDialogOpen" :team="selectedTeam" @close="closeDialog" />
    </AppLayout>
</template>