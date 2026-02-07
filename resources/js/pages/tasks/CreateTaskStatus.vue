<script setup lang="ts">
import { ref } from 'vue';
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
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open']);

const form = ref({
    name: '',
    color: '#64748b',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);

const colors = [
    { name: 'Slate', value: '#64748b' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' },
];

function submit() {
    processing.value = true;
    errors.value = {};

    router.post(`/projects/${props.project.id}/task-statuses`, form.value, {
        preserveScroll: true,
        onSuccess: () => {
            resetForm();
            emit('update:open', false);
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
        name: '',
        color: '#64748b',
    };
    errors.value = {};
}

function closeModal() {
    resetForm();
    emit('update:open', false);
}
</script>

<template>
    <Dialog :open="props.open" @update:open="(val) => !val && closeModal()">
        <DialogContent class="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle class="text-2xl font-bold text-slate-900">Create Task Status</DialogTitle>
                <button
                    @click="closeModal"
                    class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <X class="h-4 w-4" />
                    <span class="sr-only">Close</span>
                </button>
            </DialogHeader>

            <form @submit.prevent="submit" class="space-y-5 mt-4">

                <!-- Status Name -->
                <div>
                    <label for="status-name" class="block text-sm font-semibold text-slate-700 mb-2">
                        Status Name <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="status-name"
                        v-model="form.name"
                        type="text"
                        required
                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="e.g., To Do, In Progress, Done"
                        :class="errors.name ? 'border-red-500' : ''"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <!-- Color Selection -->
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-3">
                        Choose Color <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-9 gap-2">
                        <button
                            v-for="color in colors"
                            :key="color.value"
                            type="button"
                            @click="form.color = color.value"
                            :class="[
                                'w-10 h-10 rounded-lg border-2 transition-all hover:scale-110',
                                form.color === color.value ? 'border-slate-900 ring-2 ring-slate-300 scale-110' : 'border-slate-200'
                            ]"
                            :style="{ backgroundColor: color.value }"
                            :title="color.name"
                        >
                            <span class="sr-only">{{ color.name }}</span>
                        </button>
                    </div>
                    <p v-if="errors.color" class="mt-2 text-sm text-red-600">{{ errors.color }}</p>
                </div>

                <!-- Preview -->
                <div class="border-t border-slate-200 pt-4">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">
                        Preview
                    </label>
                    <div
                        class="px-4 py-3 rounded-lg inline-flex items-center"
                        :style="{ backgroundColor: form.color }"
                    >
                        <span class="font-semibold text-white">
                            {{ form.name || 'Your Status Name' }}
                        </span>
                    </div>
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
                        <span v-else>Create Status</span>
                    </Button>
                </div>

            </form>
        </DialogContent>
    </Dialog>
</template>
