<script setup lang="ts">
import AppContent from '@/components/AppContent.vue';
import AppShell from '@/components/AppShell.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import AppSidebarHeader from '@/components/AppSidebarHeader.vue';
import type { BreadcrumbItemType } from '@/types';
import { onMounted, onUnmounted, ref } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-vue-next';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const notifications = ref<Notification[]>([]);

function addNotification(data: Notification) {
    notifications.value.push(data);
    setTimeout(() => removeNotification(data.id), 5000);
}

function removeNotification(id: number) {
    notifications.value = notifications.value.filter(n => n.id !== id);
}

function getTypeClasses(type: string) {
    switch (type) {
        case 'success': return 'border-teal-200 bg-white text-teal-800';
        case 'warning': return 'border-yellow-200 bg-white text-yellow-800';
        case 'error': return 'border-rose-200 bg-white text-rose-800';
        default: return 'border-blue-200 bg-white text-blue-800';
    }
}

function getIcon(type: string) {
    switch (type) {
        case 'success': return CheckCircle2;
        case 'warning': return AlertCircle;
        case 'error': return AlertCircle;
        default: return Info;
    }
}

function getIconClass(type: string) {
    switch (type) {
        case 'success': return 'text-teal-600';
        case 'warning': return 'text-yellow-600';
        case 'error': return 'text-rose-600';
        default: return 'text-blue-600';
    }
}

onMounted(() => {
    const userId = page.props.auth.user.id;

    window.Echo.private(`user.${userId}`)
        .listen('UserNotification', (e: Notification) => {
            addNotification(e);
        });
});

onUnmounted(() => {
    const userId = page.props.auth.user.id;
    window.Echo.leaveChannel(`user.${userId}`);
});
</script>

<template>
    <AppShell variant="sidebar">
        <AppSidebar />
        <AppContent variant="sidebar" class="overflow-x-hidden">
            <AppSidebarHeader :breadcrumbs="breadcrumbs" />
            <slot />
        </AppContent>
    </AppShell>

    <!-- Global Toast Notifications -->
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <TransitionGroup enter-active-class="transition duration-300 ease-out"
            enter-from-class="translate-x-full opacity-0" enter-to-class="translate-x-0 opacity-100"
            leave-active-class="transition duration-200 ease-in" leave-from-class="translate-x-0 opacity-100"
            leave-to-class="translate-x-full opacity-0">
            <div v-for="notification in notifications" :key="notification.id"
                class="relative w-96 rounded-lg border px-4 py-3 shadow-xl" :class="getTypeClasses(notification.type)">
                <div class="flex items-start gap-3">
                    <component :is="getIcon(notification.type)" class="mt-0.5 h-5 w-5 shrink-0"
                        :class="getIconClass(notification.type)" />
                    <div class="flex-1">
                        <p class="font-semibold text-sm">{{ notification.title }}</p>
                        <p class="text-sm mt-0.5 opacity-90">{{ notification.message }}</p>
                    </div>
                    <button @click="removeNotification(notification.id)"
                        class="rounded-full p-1 transition-colors hover:bg-black/10">
                        <X :size="14" />
                    </button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>
