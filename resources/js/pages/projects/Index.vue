<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Table from '@/components/ui/table/Table.vue';
import TableBody from '@/components/ui/table/TableBody.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import TableHead from '@/components/ui/table/TableHead.vue';
import TableHeader from '@/components/ui/table/TableHeader.vue';
import TableRow from '@/components/ui/table/TableRow.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import projects from '@/routes/projects';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/vue3';

// pang header breadcrumbs 
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: projects.index().url,
    },
];

// basic types 
interface Project {
    team_id: number;
    owner_id: number;
    name: string;
    description: string;
    status: string;
    start_date: string;
    due_date: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

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

// pagination handler 
function goToPage(url: string | null) {
    if (!url) return;

    router.visit(url, {
        preserveState: true,
        preserveScroll: true,
    });
}

interface Props {
    projects: PaginatedProjects;
}

const props = defineProps<Props>();
</script>


<template>
    <Head title="Project Management" />
    <AppLayout :breadcrumbs="breadcrumbs">

        <div class="p-6 bg-slate-50 min-h-screen">
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Project Management</h1>
                    <p class="mt-2 text-slate-600">Create, organize, and manage your projects efficiently</p>
                </div>
                <Button
                    class="bg-teal-600 text-white shadow-sm hover:bg-teal-700 hover:shadow-md transition-all font-medium cursor-pointer">
                    <Plus class="mr-2 h-4 w-4" />
                    Create Project
                </Button>
            </div>

            <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div class="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5">
                    <h2 class="text-lg font-semibold text-white tracking-wide">Your Projects</h2>
                    <p class="text-teal-100 text-sm mt-1">{{ props.projects.total }} {{ props.projects.total === 1 ?
                        'project' :
                        'projects' }} total</p>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow class="border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Name</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Owner</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Team</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Status</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Start Date</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Due Date</TableHead>
                            <TableHead
                                class="h-12 px-6 text-center font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="project in props.projects.data" :key="project.id"
                            class="border-b border-slate-100 transition-colors hover:bg-teal-50/30">
                            <TableCell class="px-6 py-4">
                                <span class="font-semibold text-slate-900">{{ project.name }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-slate-700">{{ project.owner?.name || '-' }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-slate-700">{{ project.team?.name || '-' }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-slate-700 capitalize">{{ project.status }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-sm text-slate-600">{{ project.start_date ? new
                                    Date(project.start_date).toLocaleDateString() : '-' }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-sm text-slate-600">{{ project.due_date ? new
                                    Date(project.due_date).toLocaleDateString() : '-' }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <!-- Actions like edit/delete go here -->
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>


                <div v-if="props.projects.data.length === 0" class="px-6 py-16 text-center">
                    <div
                        class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 border-2 border-teal-100">
                        <Plus class="h-10 w-10 text-teal-400" />
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-slate-900">No projects yet</h3>
                    <p class="mb-6 text-slate-600">Get started by creating your first project.</p>
                    <Button @click="" class="bg-teal-600 text-white hover:bg-teal-700 shadow-sm font-medium">
                        <Plus class="mr-2 h-4 w-4" />
                        Create Your First Project
                    </Button>
                </div>

                <div v-if="props.projects.data.length > 0" class="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-slate-600">
                            Showing
                            <span class="font-semibold text-slate-900">{{ props.projects.from }}</span>
                            to
                            <span class="font-semibold text-slate-900">{{ props.projects.to }}</span>
                            of
                            <span class="font-semibold text-slate-900">{{ props.projects.total }}</span>
                            results
                        </div>

                        <div class="flex items-center gap-2">
                            <Button variant="outline" size="sm" @click="goToPage(props.projects.links[0].url)"
                                :disabled="!props.projects.links[0].url"
                                class="border-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium">
                                <ChevronLeft class="h-4 w-4" />
                                Previous
                            </Button>

                            <div class="hidden items-center gap-1 sm:flex">
                                <template v-for="(link, index) in props.projects.links" :key="index">
                                    <Button v-if="index !== 0 && index !== props.projects.links.length - 1"
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
                                    Page {{ props.projects.current_page }} of {{ props.projects.last_page }}
                                </span>
                            </div>

                            <Button variant="outline" size="sm"
                                @click="goToPage(props.projects.links[props.projects.links.length - 1].url)"
                                :disabled="!props.projects.links[props.projects.links.length - 1].url"
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
                    <span class="text-lg font-bold text-teal-600">{{ props.projects.total }}</span>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-900">Total Projects</p>
                    <p class="text-xs text-slate-500">Across all pages</p>
                </div>
            </div>
        </div>

    </AppLayout>
</template>