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
    created_at: Date;
}

interface Props {
    open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'close'): void;
}>();

const isCreating = ref(false);

const form = useForm({
    name: '',
    email: '',
    password: ''
});

function handleSubmit() {
    isCreating.value = true;

    form.post(users.store().url, {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            closeDialog(); 
        },
        onFinish: () => {
            isCreating.value = false;
        },
    });
}


function closeDialog() {
    emit('update:open', false);
    emit('close');
}
</script>

<template>
    <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
        <DialogContent class="sm:max-w-[500px]">
            <form @submit.prevent="handleSubmit">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>
                        Create a new user
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

                        <div>
                            <Label for="password" class="text-sm font-medium text-slate-700">
                                Password <span class="text-red-500">*</span>
                            </Label>
                            <Input id="password" type="password" placeholder="***********" v-model="form.password"
                                class="h-11 transition-all focus:ring-2 focus:ring-teal-500"
                                :class="{ 'border-red-500': form.errors.password }" />
                            <p v-if="form.errors.password" class="text-sm text-red-600">
                                {{ form.errors.password }}
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
                    <Button type="submit" :disabled="isCreating" class="bg-teal-600 hover:bg-teal-700">
                        {{ isCreating ? 'Creating...' : 'Create User' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>