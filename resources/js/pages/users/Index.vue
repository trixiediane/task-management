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
import Edit from './Edit.vue';
import ChangePassword from './ChangePassword.vue';
import Swal from 'sweetalert2';

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
const selectedUser = ref<User | null>(null);

// flash message state 
const showAlert = ref(false);
let alertTimeout: ReturnType<typeof setTimeout> | null = null;

// manage user modals
const isCreateUserOpen = ref(false);
const isUpdateUserOpen = ref(false);
const isChangePasswordOpen = ref(false);

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

// open update modal 
function openUpdateUser(user: User) {
    selectedUser.value = user;
    isUpdateUserOpen.value = true;
}

// close update modal 
function closeUpdateUser() {
    isUpdateUserOpen.value = false;
}

// open change password modal 
function openChangePassword(user: User) {
    selectedUser.value = user;
    isChangePasswordOpen.value = true;
}

// close change password modal 
function closeChangePassword() {
    isChangePasswordOpen.value = false;
}
// delete confirmation 
const userToDelete = ref<number | null>(null);

function confirmDelete() {
    if (!userToDelete.value) return;

    router.delete(users.destroy(userToDelete.value).url, {
        onSuccess: () => {
            // Show success Swal after deletion
            Swal.fire({
                title: 'Deleted!',
                text: 'The user has been successfully deleted.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });

            // Reset selection
            userToDelete.value = null;
        },
    });
}
</script>

<template>

    <Head title="User Management" />
    <AppLayout :breadcrumbs="breadcrumbs">

        <div class="p-6 bg-slate-50 min-h-screen">
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
                    <p class="mt-2 text-slate-600">Create, organize, and manage your users efficiently</p>
                </div>
                <Button @click="openCreateUser()"
                    class="bg-teal-600 text-white shadow-sm hover:bg-teal-700 hover:shadow-md transition-all font-medium cursor-pointer">
                    <Plus class="mr-2 h-4 w-4" />
                    Create User
                </Button>
            </div>

            <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div class="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5">
                    <h2 class="text-lg font-semibold text-white tracking-wide">Your Users</h2>
                    <p class="text-teal-100 text-sm mt-1">{{ props.users.total }} {{ props.users.total === 1 ? 'user' :
                        'users' }} total</p>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow class="border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Name</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Email</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Active</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Created</TableHead>
                            <TableHead
                                class="h-12 px-6 text-center font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="user in props.users.data" :key="user.id"
                            class="border-b border-slate-100 transition-colors hover:bg-teal-50/30">
                            <TableCell class="px-6 py-4">
                                <span class="font-semibold text-slate-900">{{ user.name }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-slate-700">{{ user.email }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-slate-700">{{ user.is_active ? 'Active' : 'Inactive' }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-sm text-slate-600">
                                    {{ user.created_at ? new Date(user.created_at).toLocaleDateString() : '-' }}
                                </span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <Button variant="outline" size="sm" @click="openUpdateUser(user)"
                                        class="border-teal-300 bg-white text-teal-700 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all font-medium cursor-pointer">
                                        Update
                                    </Button>
                                    <Button variant="outline" size="sm" @click="openChangePassword(user)"
                                        class="border-slate-300 bg-white text-slate-700 hover:bg-slate-600 hover:text-white hover:border-slate-600 transition-all font-medium cursor-pointer">
                                        Change Password
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger as-child>
                                            <Button size="sm"
                                                class="bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-all font-medium cursor-pointer"
                                                @click="
                                                    userToDelete = user.id
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

                <div v-if="props.users.data.length === 0" class="px-6 py-16 text-center">
                    <div
                        class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 border-2 border-teal-100">
                        <Plus class="h-10 w-10 text-teal-400" />
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-slate-900">No users yet</h3>
                    <p class="mb-6 text-slate-600">Get started by creating your first user.</p>
                    <Button @click="openCreateUser()"
                        class="bg-teal-600 text-white hover:bg-teal-700 shadow-sm font-medium">
                        <Plus class="mr-2 h-4 w-4" />
                        Create Your First User
                    </Button>
                </div>

                <div v-if="props.users.data.length > 0" class="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-slate-600">
                            Showing
                            <span class="font-semibold text-slate-900">{{ props.users.from }}</span>
                            to
                            <span class="font-semibold text-slate-900">{{ props.users.to }}</span>
                            of
                            <span class="font-semibold text-slate-900">{{ props.users.total }}</span>
                            results
                        </div>

                        <div class="flex items-center gap-2">
                            <Button variant="outline" size="sm" @click="goToPage(props.users.links[0].url)"
                                :disabled="!props.users.links[0].url"
                                class="border-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium">
                                <ChevronLeft class="h-4 w-4" />
                                Previous
                            </Button>

                            <div class="hidden items-center gap-1 sm:flex">
                                <template v-for="(link, index) in props.users.links" :key="index">
                                    <Button v-if="index !== 0 && index !== props.users.links.length - 1"
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
                                    Page {{ props.users.current_page }} of {{ props.users.last_page }}
                                </span>
                            </div>

                            <Button variant="outline" size="sm"
                                @click="goToPage(props.users.links[props.users.links.length - 1].url)"
                                :disabled="!props.users.links[props.users.links.length - 1].url"
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
                    <span class="text-lg font-bold text-teal-600">{{ props.users.total }}</span>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-900">Total Users</p>
                    <p class="text-xs text-slate-500">Across all pages</p>
                </div>
            </div>
        </div>

        <Create v-model:open="isCreateUserOpen" @close="closeCreateUser" />
        <Edit v-model:open="isUpdateUserOpen" :user="selectedUser" @close="closeUpdateUser" />
        <ChangePassword v-model:open="isChangePasswordOpen" :user="selectedUser" @close="closeChangePassword" />
    </AppLayout>
</template>