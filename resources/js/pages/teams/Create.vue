<script setup lang="ts">
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/AppLayout.vue';
import teams from '@/routes/teams';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { Plus, ArrowLeft, Users } from 'lucide-vue-next';
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Team',
        href: teams.create().url,
    },
];

const form = useForm({
    name: ''
});

function handleSubmit() {
    form.post(teams.store().url);
}
</script>

<template>

    <Head title="Create Team" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-6">
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Create New Team</h1>
                    <p class="mt-1 text-sm text-slate-600">Add a new team to your organization</p>
                </div>
            </div>

            <div class="mx-auto max-w-2xl">
                <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
                    <div class="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="rounded-lg bg-white/20 p-2">
                                <Users class="h-5 w-5 text-white" />
                            </div>
                            <h2 class="text-lg font-semibold text-white">Team Information</h2>
                        </div>
                    </div>

                    <form @submit.prevent="handleSubmit" class="p-6">
                        <div class="space-y-6">
                            <div class="space-y-2">
                                <Label for="team-name" class="text-sm font-medium text-slate-700">
                                    Team Name <span class="text-red-500">*</span>
                                </Label>
                                <Input id="team-name" type="text" placeholder="Enter team name (e.g., Development Team)"
                                    v-model="form.name" class="h-11 transition-all focus:ring-2 focus:ring-teal-500"
                                    :class="{ 'border-red-500': form.errors.name }" required />
                                <p v-if="form.errors.name" class="text-sm text-red-600">
                                    {{ form.errors.name }}
                                </p>
                                <p class="text-xs text-slate-500">
                                    Choose a descriptive name for your team
                                </p>
                            </div>

                            <div class="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                                <Button type="submit" class="bg-teal-600 shadow-md hover:bg-teal-700 hover:shadow-lg"
                                    :disabled="form.processing || !form.name">
                                    <Plus class="mr-2 h-4 w-4" />
                                    {{ form.processing ? 'Creating...' : 'Create Team' }}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4">
                    <div class="flex gap-3">
                        <div class="flex-shrink-0">
                            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                                <Users class="h-4 w-4 text-teal-600" />
                            </div>
                        </div>
                        <div>
                            <h3 class="text-sm font-semibold text-teal-900">Team Tips</h3>
                            <p class="mt-1 text-sm text-teal-700">
                                Teams help you organize your work and collaborate with others. After creating a team,
                                you can add members and assign tasks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
