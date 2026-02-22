<script setup lang="ts">
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
import { router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { assignPermissions } from '@/routes/users';
import { getPermissions } from '@/actions/App/Http/Controllers/UserController';

interface Permission {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface Props {
    open: boolean;
    user: User | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'close'): void;
}>();

const allPermissions = ref<Permission[]>([]);
const selectedPermissions = ref<string[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);

watch(
    () => props.open,
    async (open) => {
        if (open && props.user) {
            isLoading.value = true;
            try {
                const res = await fetch(getPermissions(props.user.id).url);
                const data = await res.json();
                allPermissions.value = data.all_permissions;
                selectedPermissions.value = data.user_permissions;
            } finally {
                isLoading.value = false;
            }
        }
    }
);

function handleSubmit() {
    if (!props.user?.id) return;
    isSaving.value = true;

    router.post(assignPermissions(props.user.id).url, {
        permissions: selectedPermissions.value,
    }, {
        preserveScroll: true,
        onSuccess: () => {
            Swal.fire({
                title: 'Permissions updated!',
                text: 'User permissions have been successfully updated.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });
            closeDialog();
        },
        onFinish: () => {
            isSaving.value = false;
        },
    });
}

function togglePermission(name: string) {
    if (selectedPermissions.value.includes(name)) {
        selectedPermissions.value = selectedPermissions.value.filter(p => p !== name);
    } else {
        selectedPermissions.value.push(name);
    }
}

function closeDialog() {
    emit('update:open', false);
    emit('close');
}

</script>

<template>
    <Dialog :open="props.open" @update:open="val => emit('update:open', val)">
        <DialogContent class="sm:max-w-[500px]">
            <form @submit.prevent="handleSubmit">
                <DialogHeader>
                    <DialogTitle>Assign Permissions</DialogTitle>
                    <DialogDescription>
                        Manage individual permissions for {{ props.user?.name }}.
                    </DialogDescription>
                </DialogHeader>

                <div class="py-4">
                    <div v-if="isLoading" class="text-center py-8 text-slate-500 text-sm">
                        Loading permissions...
                    </div>

                    <div v-else class="space-y-2 max-h-80 overflow-y-auto pr-1">
                        <label v-for="permission in allPermissions" :key="permission.id"
                            class="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 cursor-pointer hover:bg-teal-50 hover:border-teal-300 transition-colors"
                            :class="{ 'bg-teal-50 border-teal-300': selectedPermissions.includes(permission.name) }">
                            <input type="checkbox" :checked="selectedPermissions.includes(permission.name)"
                                @change="togglePermission(permission.name)"
                                class="h-4 w-4 rounded border-slate-300 accent-teal-600 cursor-pointer" />
                            <span class="text-sm font-medium text-slate-700 capitalize">
                                {{ permission.name }}
                            </span>
                        </label>
                    </div>
                </div>

                <DialogFooter class="mt-4">
                    <DialogClose as-child>
                        <Button variant="outline" type="button" @click="closeDialog">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" :disabled="isSaving || isLoading" class="bg-teal-600 hover:bg-teal-700">
                        {{ isSaving ? 'Saving...' : 'Save Permissions' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
