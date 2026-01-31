<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { BreadcrumbItem } from '@/types';
import tasks from '@/routes/tasks';
import projects from '@/routes/projects';
import { ChevronLeft, ChevronRight, Plus, Edit as EditIcon } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';

// -----------------
// Props first!
// -----------------
interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    start_date: string;
    due_date: string;
}

interface Task {
    id: number;
    name: string;
    description: string;
    status: string;
    due_date: string;
}

interface Props {
    tasks: Task[];
    project: Project;
}

const props = defineProps<Props>();

// -----------------
// Now you can use props
// -----------------
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Projects', href: projects.index().url },
    { title: props.project.name, href: tasks.index(props.project).url },
];
</script>


<template>

    <Head :title="`Tasks for ${props.project.name}`" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-6 bg-slate-50 min-h-screen">
            <h1 class="text-2xl font-bold mb-4">Tasks for {{ props.project.name }}</h1>

            <div v-if="props.tasks.length > 0" class="space-y-4">
                <div v-for="task in props.tasks" :key="task.id" class="p-4 bg-white border rounded">
                    <h2 class="font-semibold">{{ task.name }}</h2>
                    <p class="text-sm text-slate-600">{{ task.description }}</p>
                    <p class="text-xs text-slate-500">Due: {{ task.due_date ? new
                        Date(task.due_date).toLocaleDateString() : '-' }}</p>
                </div>
            </div>

            <div v-else class="text-slate-500">No tasks for this project yet.</div>
        </div>
    </AppLayout>
</template>
