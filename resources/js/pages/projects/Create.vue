<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';
import projects from '@/routes/projects';
import Swal from 'sweetalert2';

interface Team {
    id: number;
    name: string;
}

interface Props {
    open: boolean;
    teams: Team[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'close'): void;
}>();

const isCreating = ref(false);

const form = useForm({
    team_id: '',
    name: '',
    description: '',
    status: 'planning',
    start_date: '',
    due_date: '',
});

// submit handler
function handleSubmit() {
    isCreating.value = true;

    form.post(projects.store().url, {
        preserveScroll: true,
        onSuccess: () => {
            Swal.fire({
                title: 'Project created!',
                text: 'The project has been successfully added.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });

            form.reset();
            closeDialog();
        },
        onFinish: () => {
            isCreating.value = false;
        },
    });
}

// close modal
function closeDialog() {
    emit('update:open', false);
    emit('close');
}

interface Team {
    id: number;
    name: string;
}
</script>

<template>
    <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
        <DialogContent class="sm:max-w-[520px]">
            <form @submit.prevent="handleSubmit">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>Add a new project to your team</DialogDescription>
                </DialogHeader>

                <div class="py-4 space-y-4">
                    <!-- Team -->
                    <div>
                        <Label class="text-sm font-medium text-slate-700">
                            Team <span class="text-red-500">*</span>
                        </Label>
                        <select v-model="form.team_id" class="w-full h-11 rounded-md border px-3"
                            :class="{ 'border-red-500': form.errors.team_id }">
                            <option value="">Select team</option>
                            <option v-for="team in props.teams" :key="team.id" :value="team.id">
                                {{ team.name }}
                            </option>
                        </select>
                        <p v-if="form.errors.team_id" class="text-sm text-red-600">{{ form.errors.team_id }}</p>
                    </div>

                    <!-- Name -->
                    <div>
                        <Label class="text-sm font-medium text-slate-700">
                            Project Name <span class="text-red-500">*</span>
                        </Label>
                        <Input type="text" placeholder="e.g. Website Redesign" v-model="form.name"
                            :class="{ 'border-red-500': form.errors.name }" />
                        <p v-if="form.errors.name" class="text-sm text-red-600">{{ form.errors.name }}</p>
                    </div>

                    <!-- Description -->
                    <div>
                        <Label class="text-sm font-medium text-slate-700">Description</Label>
                        <textarea v-model="form.description" class="w-full rounded-md border px-3 py-2" rows="3" />
                    </div>

                    <!-- Status -->
                    <div>
                        <Label class="text-sm font-medium text-slate-700">Status</Label>
                        <select v-model="form.status" class="w-full h-11 rounded-md border px-3">
                            <option value="planning">Planning</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <!-- Dates -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label class="text-sm font-medium text-slate-700">Start Date</Label>
                            <Input type="date" v-model="form.start_date" />
                        </div>
                        <div>
                            <Label class="text-sm font-medium text-slate-700">Due Date</Label>
                            <Input type="date" v-model="form.due_date" />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose as-child>
                        <Button variant="outline" type="button" @click="closeDialog">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" :disabled="isCreating" class="bg-teal-600 hover:bg-teal-700">
                        {{ isCreating ? 'Creating...' : 'Create Project' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
