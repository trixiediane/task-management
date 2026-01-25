<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import teams from '@/routes/teams';
import { Head, useForm } from '@inertiajs/vue3';
import { defineProps } from 'vue';

interface Team {
    id: number;
}

const props = defineProps<{ team: Team }>();

const form = useForm({
    name: props.team.name,
    price: props.team.price,
    description: props.team.description,
});

const handleSubmit = () => {
    form.put(teams.update(props.team).url);
};
</script>

<template>

    <Head title="Edit a team" />
    <AppLayout :breadcrumbs="[
        {
            title: 'Edit a team',
            href: teams.edit(props.team).url,
        },
    ]">
        <div class="p-4">
            <form @submit.prevent="handleSubmit" class="w-8/12 space-y-4">
                <div class="space-y-2">
                    <Label for="team name"> Name </Label>
                    <Input type="text" placeholder="Name" v-model="form.name" />
                    <div class="text-sm text-red-500" v-if="form.errors.name">
                        {{ form.errors.name }}
                    </div>
                </div>

                <Button type="submit" :disabled="form.processing">
                    Edit a team
                </Button>
            </form>
        </div>
    </AppLayout>
</template>
