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
import Select from '@/components/ui/select/Select.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectGroup from '@/components/ui/select/SelectGroup.vue';
import SelectLabel from '@/components/ui/select/SelectLabel.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import { router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { assignRoles } from '@/routes/users';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    roles: Role[];
}

interface Props {
    open: boolean;
    user: User | null;
    allRoles: Role[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'close'): void;
}>();

const selectedRole = ref<string>('none');
const isSaving = ref(false);

watch(
    () => props.open,
    (open) => {
        if (open && props.user) {
            selectedRole.value = props.user.roles[0]?.name ?? 'none';
        }
    }
);

function closeDialog() {
    emit('update:open', false);
    emit('close');
}

function handleSubmit() {
    if (!props.user?.id) return;
    isSaving.value = true;

    router.post(assignRoles(props.user.id).url, {
        roles: selectedRole.value !== 'none' ? [selectedRole.value] : [],
    }, {
        preserveScroll: true,
        preserveState: true,
        only: ['users', 'flash'],
        onSuccess: () => {
            Swal.fire({
                title: 'Role updated!',
                text: 'User role has been successfully updated.',
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
</script>

<template>
    <Dialog :open="props.open" @update:open="val => emit('update:open', val)">
        <DialogContent class="sm:max-w-[500px]">
            <form @submit.prevent="handleSubmit">
                <DialogHeader>
                    <DialogTitle>Assign Role</DialogTitle>
                    <DialogDescription>
                        Assign a role for {{ props.user?.name }}.
                    </DialogDescription>
                </DialogHeader>

                <div class="py-4">
                    <Select v-model="selectedRole">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select Role</SelectLabel>
                                <SelectItem value="none">
                                    -- No Role --
                                </SelectItem>
                                <SelectItem v-for="role in props.allRoles" :key="role.id" :value="role.name"
                                    class="capitalize">
                                    {{ role.name }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter class="mt-4">
                    <DialogClose as-child>
                        <Button variant="outline" type="button" @click="closeDialog">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" :disabled="isSaving" class="bg-teal-600 hover:bg-teal-700">
                        {{ isSaving ? 'Saving...' : 'Save Role' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
