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
import { Head, useForm } from '@inertiajs/vue3';
import { Plus } from 'lucide-vue-next';
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team Creation',
        href: teams.create.url(),
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

    <Head title="Team Creation" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-4">
            <form @submit.prevent="handleSubmit">
                <Label for="Team Name">Name</Label>
                <Input type="text" placeholder="Name" v-model="form.name" />

                <Button type="submit">Create</Button>
            </form>
        </div>
    </AppLayout>
</template>
