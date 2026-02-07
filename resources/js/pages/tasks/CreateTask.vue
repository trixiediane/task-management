<script setup lang="ts">
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import Button from '@/components/ui/button/Button.vue';
import { X } from 'lucide-vue-next';

interface Props {
    open: boolean;
    project: { id: number };
    statusId: number | null;
    teamMembers?: Array<{ id: number; name: string }>;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open', 'close']);

const form = ref({
    task_status_id: props.statusId,
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: null as number | null,
    due_date: '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);

// Watch for statusId changes
watch(() => props.statusId, (newVal) => {
    form.value.task_status_id = newVal;
});

function submit() {
    processing.value = true;
    errors.value = {};

    router.post(`/projects/${props.project.id}/tasks`, form.value, {
        preserveScroll: true,
        onSuccess: () => {
            resetForm();
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

function resetForm() {
    form.value = {
        task_status_id: props.statusId,
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: null,
        due_date: '',
    };
    errors.value = {};
}

function closeModal() {
    resetForm();
    emit('update:open', false);
    emit('close');
}
</script>

<template>
    <Dialog :open="props.open" @update:open="(val) => !val && closeModal()">
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle class="text-2xl font-bold text-slate-900">Create New Task</DialogTitle>
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
                    <label for="title" class="block text-sm font-semibold text-slate-700 mb-2">
                        Task Title <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
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
                    <label for="description" class="block text-sm font-semibold text-slate-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
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
                        <label for="priority" class="block text-sm font-semibold text-slate-700 mb-2">
                            Priority <span class="text-red-500">*</span>
                        </label>
                        <select
                            id="priority"
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
                        <label for="due_date" class="block text-sm font-semibold text-slate-700 mb-2">
                            Due Date
                        </label>
                        <input
                            id="due_date"
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
                    <label for="assigned_to" class="block text-sm font-semibold text-slate-700 mb-2">
                        Assign To
                    </label>
                    <select
                        id="assigned_to"
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
                <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
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
                        <span v-if="processing">Creating...</span>
                        <span v-else>Create Task</span>
                    </Button>
                </div>

            </form>
        </DialogContent>
    </Dialog>
</template>
