<script setup lang="ts">
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import Button from '@/components/ui/button/Button.vue';
import { X, Trash2 } from 'lucide-vue-next';

interface User {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    priority: string;
    assigned_to: number | null;
    due_date: string;
    assigned_user?: User;
}

interface Props {
    open: boolean;
    task: Task;
    project: { id: number };
    teamMembers?: Array<{ id: number; name: string }>;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open', 'close']);

const form = ref({
    title: props.task.title,
    description: props.task.description || '',
    priority: props.task.priority,
    assigned_to: props.task.assigned_to,
    due_date: props.task.due_date || '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);
const showDeleteConfirm = ref(false);

// Watch for task changes
watch(() => props.task, (newTask) => {
    if (newTask) {
        form.value = {
            title: newTask.title,
            description: newTask.description || '',
            priority: newTask.priority,
            assigned_to: newTask.assigned_to,
            due_date: newTask.due_date || '',
        };
    }
}, { immediate: true });

function submit() {
    processing.value = true;
    errors.value = {};

    router.put(`/projects/${props.project.id}/tasks/${props.task.id}`, form.value, {
        preserveScroll: true,
        onSuccess: () => {
            emit('update:open', false);
            emit('close');
        },
        onError: (err) => {
            errors.value = err;
        },
        onFinish: () => {
            processing.value = false;
        },
    });
}

function deleteTask() {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
        return;
    }

    processing.value = true;

    router.delete(`/projects/${props.project.id}/tasks/${props.task.id}`, {
        preserveScroll: true,
        onSuccess: () => {
            emit('update:open', false);
            emit('close');
        },
        onFinish: () => {
            processing.value = false;
        },
    });
}

function closeModal() {
    errors.value = {};
    emit('update:open', false);
    emit('close');
}
</script>

<template>
    <Dialog :open="props.open" @update:open="(val) => !val && closeModal()">
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle class="text-2xl font-bold text-slate-900">Edit Task</DialogTitle>
                <button
                    @click="closeModal"
                    class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <X class="h-4 w-4" />
                    <span class="sr-only">Close</span>
                </button>
            </DialogHeader>

            <form @submit.prevent="submit" class="space-y-5 mt-4">

                <!-- Title -->
                <div>
                    <label for="edit-title" class="block text-sm font-semibold text-slate-700 mb-2">
                        Task Title <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="edit-title"
                        v-model="form.title"
                        type="text"
                        required
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="Enter task title"
                        :class="errors.title ? 'border-red-500' : ''"
                    />
                    <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
                </div>

                <!-- Description -->
                <div>
                    <label for="edit-description" class="block text-sm font-semibold text-slate-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="edit-description"
                        v-model="form.description"
                        rows="4"
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                        placeholder="Describe the task..."
                        :class="errors.description ? 'border-red-500' : ''"
                    />
                    <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                </div>

                <!-- Priority & Due Date Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <!-- Priority -->
                    <div>
                        <label for="edit-priority" class="block text-sm font-semibold text-slate-700 mb-2">
                            Priority <span class="text-red-500">*</span>
                        </label>
                        <select
                            id="edit-priority"
                            v-model="form.priority"
                            required
                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            :class="errors.priority ? 'border-red-500' : ''"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
                    </div>

                    <!-- Due Date -->
                    <div>
                        <label for="edit-due_date" class="block text-sm font-semibold text-slate-700 mb-2">
                            Due Date
                        </label>
                        <input
                            id="edit-due_date"
                            v-model="form.due_date"
                            type="date"
                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            :class="errors.due_date ? 'border-red-500' : ''"
                        />
                        <p v-if="errors.due_date" class="mt-1 text-sm text-red-600">{{ errors.due_date }}</p>
                    </div>

                </div>

                <!-- Assigned To -->
                <div v-if="teamMembers && teamMembers.length > 0">
                    <label for="edit-assigned_to" class="block text-sm font-semibold text-slate-700 mb-2">
                        Assign To
                    </label>
                    <select
                        id="edit-assigned_to"
                        v-model="form.assigned_to"
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        :class="errors.assigned_to ? 'border-red-500' : ''"
                    >
                        <option :value="null">Unassigned</option>
                        <option v-for="member in teamMembers" :key="member.id" :value="member.id">
                            {{ member.name }}
                        </option>
                    </select>
                    <p v-if="errors.assigned_to" class="mt-1 text-sm text-red-600">{{ errors.assigned_to }}</p>
                </div>

                <!-- Footer Actions -->
                <div class="flex justify-between items-center pt-4 border-t border-slate-200">
                    <!-- Delete Button -->
                    <Button
                        type="button"
                        variant="outline"
                        @click="deleteTask"
                        :disabled="processing"
                        class="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 px-4 py-2.5 font-medium"
                    >
                        <Trash2 class="h-4 w-4 mr-2" />
                        Delete Task
                    </Button>

                    <!-- Save/Cancel Buttons -->
                    <div class="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            @click="closeModal"
                            :disabled="processing"
                            class="px-5 py-2.5 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            :disabled="processing"
                            class="bg-teal-600 text-white hover:bg-teal-700 px-5 py-2.5 font-medium shadow-sm"
                        >
                            <span v-if="processing">Saving...</span>
                            <span v-else>Save Changes</span>
                        </Button>
                    </div>
                </div>

            </form>
        </DialogContent>
    </Dialog>
</template>
