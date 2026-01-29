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
import teams from '@/routes/teams';
import users from '@/routes/users';
import { router, useForm } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
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
    id: null as number | null,
    name: '',
    email: '',
    is_active: false,
});

// Populate form when user changes
watch(() => props.user, (newUser) => {
    if (newUser) {
        form.id = newUser.id;
        form.name = newUser.name;
        form.email = newUser.email;
        form.is_active = newUser.is_active;
    }
}, { immediate: true });

function handleSubmit() {
    if (!props.user?.id) return;

    isUpdating.value = true;

    form.put(users.update(props.user.id).url, {
        onSuccess: () => {
            closeDialog();
        },
        onFinish: () => {
            isUpdating.value = false;
        }
    });
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
                    <DialogTitle>Update User</DialogTitle>
                    <DialogDescription>
                        Update the selected user
                    </DialogDescription>
                </DialogHeader>

                <div class="py-4">
                    <div class="space-y-4">
                        <div>
                            <Label for="user-name" class="text-sm font-medium text-slate-700">
                                Name <span class="text-red-500">*</span>
                            </Label>
                            <Input id="user-name" type="text" placeholder="Enter user's name (e.g., Diane Bautista)"
                                v-model="form.name" class="h-11 transition-all focus:ring-2 focus:ring-teal-500"
                                :class="{ 'border-red-500': form.errors.name }" />
                            <p v-if="form.errors.name" class="text-sm text-red-600">
                                {{ form.errors.name }}
                            </p>
                        </div>

                        <div>
                            <Label for="email" class="text-sm font-medium text-slate-700">
                                Email <span class="text-red-500">*</span>
                            </Label>
                            <Input id="email" type="email" placeholder="Enter a unique email (e.g., diane@test.com)"
                                v-model="form.email" class="h-11 transition-all focus:ring-2 focus:ring-teal-500"
                                :class="{ 'border-red-500': form.errors.email }" />
                            <p v-if="form.errors.email" class="text-sm text-red-600">
                                {{ form.errors.email }}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter class="mt-4">
                    <DialogClose as-child>
                        <Button variant="outline" type="button" @click="closeDialog">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" :disabled="isUpdating" class="bg-teal-600 hover:bg-teal-700">
                        {{ isUpdating ? 'Updating...' : 'Update User' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>