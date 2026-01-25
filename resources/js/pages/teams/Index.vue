<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/AppLayout.vue';
import teams from '@/routes/teams';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/vue3';
import { Plus } from 'lucide-vue-next';

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

interface Team {
    id: number;
    name: string;
    created_by: string;
    updated_by: string;
}

interface Props {
    teams: Team[];
}

const props = defineProps<Props>();
</script>

<template>

    <Head title="Team Management" />
    <AppLayout :breadcrumbs="breadcrumbs">
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
                            <TableCell class="px-5 py-4 text-center">
                                <Link :href="teams.edit(team.id).url">
                                    <Button>Update</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div class="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3">
                <span class="text-sm text-slate-600">Total Teams:</span>
                <span class="rounded bg-teal-100 px-2 py-1 text-sm font-semibold text-teal-700">{{ props.teams.length
                    }}</span>
            </div>
        </div>
    </AppLayout>
</template>
