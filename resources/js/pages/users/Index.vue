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
import users from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { Plus, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import Create from './Create.vue';

// pang header breadcrumbs 
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: users.index().url,
    },
];

// basic types 
interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface Props {
    users: PaginatedUsers;
}

const props = defineProps<Props>();
const page = usePage();

// flash message state 
const showAlert = ref(false);
let alertTimeout: ReturnType<typeof setTimeout> | null = null;

// create user modal 
const isCreateUserOpen = ref(false);

// pagination handler 
function goToPage(url: string | null) {
    if (!url) return;

    router.visit(url, {
        preserveState: true,
        preserveScroll: true,
    });
}

// open create modal 
function openCreateUser() {
    isCreateUserOpen.value = true;
}

// close create modal 
function closeCreateUser() {
    isCreateUserOpen.value = false;
}

// auto show/hide success message 
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

// pag may flash agad on page load 
if (page.props.flash?.message) {
    showAlert.value = true;
    alertTimeout = setTimeout(() => {
        showAlert.value = false;
        alertTimeout = null;
    }, 5000);
}
</script>


<template>

    <Head title="User Management" />
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
                    <h1 class="text-2xl font-bold text-slate-900">Users Management</h1>
                    <p class="mt-1 text-sm text-slate-600">Manage and organize your users</p>
                </div>
                <Button variant="outline" size="sm" @click="openCreateUser()">
                    Create User
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow class="border-b-2 border-slate-200 bg-slate-50 hover:bg-slate-50">
                        <TableHead class="h-11 px-5 font-semibold text-slate-900">Name</TableHead>
                        <TableHead class="h-11 px-5 font-semibold text-slate-900">Email</TableHead>
                        <TableHead class="h-11 px-5 font-semibold text-slate-900">Active</TableHead>
                        <TableHead class="h-11 px-5 font-semibold text-slate-900">Created</TableHead>
                        <TableHead class="h-11 px-5 text-center font-semibold text-slate-900">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="user in props.users.data" :key="user.id"
                        class="border-b border-slate-100 transition-all hover:bg-teal-50/50">
                        <TableCell class="px-5 py-4">
                            <span class="font-medium text-slate-900">{{ user.name }}</span>
                        </TableCell>
                        <TableCell class="px-5 py-4">
                            <span class="font-medium text-slate-900">{{ user.email }}</span>
                        </TableCell>
                        <TableCell class="px-5 py-4">
                            <span class="font-medium text-slate-900">{{ user.is_active ? 'Active' : 'Inactive' }}</span>
                        </TableCell>
                        <TableCell class="px-5 py-4">
                            <span class="text-sm text-slate-600">
                                {{ user.created_at ? new Date(user.created_at).toLocaleDateString() : '-' }}
                            </span>
                        </TableCell>
                        <TableCell class="px-5 py-4">
                            <div class="flex items-center justify-center gap-2">
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>


            <div v-if="props.users.data.length > 0" class="border-t border-slate-200 bg-slate-50 px-5 py-4">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-slate-600">
                        Showing
                        <span class="font-medium text-slate-900">{{ props.users.from }}</span>
                        to
                        <span class="font-medium text-slate-900">{{ props.users.to }}</span>
                        of
                        <span class="font-medium text-slate-900">{{ props.users.total }}</span>
                        results
                    </div>

                    <div class="flex items-center gap-2">
                        <Button variant="outline" size="sm" @click="goToPage(props.users.links[0].url)"
                            :disabled="!props.users.links[0].url"
                            class="hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50">
                            <ChevronLeft class="h-4 w-4" />
                            Previous
                        </Button>

                        <div class="hidden items-center gap-1 sm:flex">
                            <template v-for="(link, index) in props.users.links" :key="index">
                                <Button v-if="index !== 0 && index !== props.users.links.length - 1" variant="outline"
                                    size="sm" @click="goToPage(link.url)" :disabled="!link.url" :class="[
                                        link.active
                                            ? 'bg-teal-600 text-white hover:bg-teal-700'
                                            : 'hover:bg-teal-50 hover:text-teal-700',
                                        'min-w-[2.5rem] disabled:cursor-not-allowed disabled:opacity-50'
                                    ]" v-html="link.label" />
                            </template>
                        </div>

                        <div class="flex items-center gap-2 sm:hidden">
                            <span class="text-sm text-slate-600">
                                Page {{ props.users.current_page }} of {{ props.users.last_page }}
                            </span>
                        </div>

                        <Button variant="outline" size="sm"
                            @click="goToPage(props.users.links[props.users.links.length - 1].url)"
                            :disabled="!props.users.links[props.users.links.length - 1].url"
                            class="hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50">
                            Next
                            <ChevronRight class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <Create v-model:open="isCreateUserOpen" @close="closeCreateUser" />
    </AppLayout>
</template>