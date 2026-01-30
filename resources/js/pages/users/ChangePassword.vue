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
import users from '@/routes/users';
import { useForm } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';
import Swal from 'sweetalert2';

interface User {
    id: number;
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

const isUpdating = ref(false);

const form = useForm({
    password: '',
    password_confirmation: '',
});

// Reset form when dialog opens or user changes
watch(
    () => props.open,
    (open) => {
        if (open) {
            form.reset();
            form.clearErrors();
        }
    }
);

function closeChangePassword() {
    emit('update:open', false);
    emit('close');
}

function handleSubmit() {
    if (!props.user?.id) return;

    isUpdating.value = true;

    form.put(users.changePassword(props.user.id).url, {
        preserveScroll: true,
        onSuccess: () => {
            // Optional: show success feedback
            Swal.fire({
                title: 'Password updated!',
                text: 'The user password has been successfully updated.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });

            closeChangePassword();
        },
        onFinish: () => {
            isUpdating.value = false;
        },
    });
}

</script>

<template>
    <Dialog :open="props.open" @update:open="val => emit('update:open', val)">
        <DialogContent class="sm:max-w-[500px]">
            <form @submit.prevent="handleSubmit">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Set a new password for this user.
                    </DialogDescription>
                </DialogHeader>

                <div class="py-4 space-y-4">
                    <!-- New Password -->
                    <Label for="password">
                        New Password <span class="text-red-500">*</span>
                    </Label>
                    <Input id="password" type="password" v-model="form.password" class="h-11"
                        :class="{ 'border-red-500': form.errors.password }" />
                    <p v-if="form.errors.password" class="text-sm text-red-600">
                        {{ form.errors.password }}
                    </p>

                    <!-- Confirm Password -->
                    <Label for="password_confirmation">
                        Confirm Password <span class="text-red-500">*</span>
                    </Label>
                    <Input id="password_confirmation" type="password" v-model="form.password_confirmation" class="h-11"
                        :class="{ 'border-red-500': form.errors.password_confirmation }" />
                    <p v-if="form.errors.password_confirmation" class="text-sm text-red-600">
                        {{ form.errors.password_confirmation }}
                    </p>
                </div>

                <DialogFooter class="mt-4">
                    <DialogClose as-child>
                        <Button variant="outline" type="button" @click="closeChangePassword">
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button type="submit" :disabled="isUpdating" class="bg-teal-600 hover:bg-teal-700">
                        {{ isUpdating ? 'Updating...' : 'Update Password' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
