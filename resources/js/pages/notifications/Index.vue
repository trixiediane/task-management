<script setup lang="ts">
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
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/vue3';
import { Bell, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, watch } from 'vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: '/notifications',
    },
];

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    read_at: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedNotifications {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface Props {
    notifications: PaginatedNotifications;
}

const props = defineProps<Props>();
const page = usePage();

const showAlert = ref(false);
let alertTimeout: ReturnType<typeof setTimeout> | null = null;

function goToPage(url: string | null) {
    if (!url) return;

    router.visit(url, {
        preserveState: true,
        preserveScroll: true,
    });
}

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

if (page.props.flash?.message) {
    showAlert.value = true;
    alertTimeout = setTimeout(() => {
        showAlert.value = false;
        alertTimeout = null;
    }, 5000);
}

function typeBadgeClass(type: string) {
    switch (type) {
        case 'success': return 'bg-teal-100 text-teal-700';
        case 'warning': return 'bg-yellow-100 text-yellow-700';
        case 'error': return 'bg-rose-100 text-rose-700';
        default: return 'bg-slate-100 text-slate-700';
    }
}
</script>

<template>

    <Head title="Notifications" />
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
                    <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
                    <p class="mt-2 text-slate-600">View all your notifications</p>
                </div>
            </div>

            <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div class="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5">
                    <h2 class="text-lg font-semibold text-white tracking-wide">Your Notifications</h2>
                    <p class="text-teal-100 text-sm mt-1">{{ props.notifications.total }} {{ props.notifications.total
                        === 1 ? 'notification' : 'notifications' }} total</p>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow class="border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Title</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Message</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Type</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Status</TableHead>
                            <TableHead class="h-12 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                                Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="notification in props.notifications.data" :key="notification.id"
                            class="border-b border-slate-100 transition-colors hover:bg-teal-50/30"
                            :class="{ 'bg-teal-50/20': !notification.read_at }">
                            <TableCell class="px-6 py-4">
                                <span class="font-semibold text-slate-900">{{ notification.title }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-slate-700">{{ notification.message }}</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span :class="typeBadgeClass(notification.type)"
                                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                                    {{ notification.type }}
                                </span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span v-if="notification.read_at" class="text-sm text-slate-500">Read</span>
                                <span v-else
                                    class="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700">Unread</span>
                            </TableCell>
                            <TableCell class="px-6 py-4">
                                <span class="text-sm text-slate-600">
                                    {{ notification.created_at ? new Date(notification.created_at).toLocaleDateString()
                                        : '-' }}
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div v-if="props.notifications.data.length === 0" class="px-6 py-16 text-center">
                    <div
                        class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 border-2 border-teal-100">
                        <Bell class="h-10 w-10 text-teal-400" />
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-slate-900">No notifications yet</h3>
                    <p class="text-slate-600">You're all caught up!</p>
                </div>

                <div v-if="props.notifications.data.length > 0"
                    class="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-slate-600">
                            Showing
                            <span class="font-semibold text-slate-900">{{ props.notifications.from }}</span>
                            to
                            <span class="font-semibold text-slate-900">{{ props.notifications.to }}</span>
                            of
                            <span class="font-semibold text-slate-900">{{ props.notifications.total }}</span>
                            results
                        </div>

                        <div class="flex items-center gap-2">
                            <Button variant="outline" size="sm" @click="goToPage(props.notifications.links[0].url)"
                                :disabled="!props.notifications.links[0].url"
                                class="border-slate-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium">
                                <ChevronLeft class="h-4 w-4" />
                                Previous
                            </Button>

                            <div class="hidden items-center gap-1 sm:flex">
                                <template v-for="(link, index) in props.notifications.links" :key="index">
                                    <Button v-if="index !== 0 && index !== props.notifications.links.length - 1"
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
                                    Page {{ props.notifications.current_page }} of {{ props.notifications.last_page }}
                                </span>
                            </div>

                            <Button variant="outline" size="sm"
                                @click="goToPage(props.notifications.links[props.notifications.links.length - 1].url)"
                                :disabled="!props.notifications.links[props.notifications.links.length - 1].url"
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
                    <span class="text-lg font-bold text-teal-600">{{ props.notifications.total }}</span>
                </div>
                <div>
                    <p class="text-sm font-medium text-slate-900">Total Notifications</p>
                    <p class="text-xs text-slate-500">Across all pages</p>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
