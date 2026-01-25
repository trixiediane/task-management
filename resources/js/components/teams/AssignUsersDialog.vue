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
import { router } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, watch } from 'vue';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Team {
    id: number;
    name: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    open: boolean;
    team: Team | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'close'): void;
}>();

const selectedUserIds = ref<number[]>([]);
const isSubmitting = ref(false);
const paginatedUsers = ref<PaginatedUsers | null>(null);
const currentPage = ref(1);
const isLoading = ref(false);

watch(() => props.open, async (isOpen) => {
    if (isOpen && props.team) {
        currentPage.value = 1;
        selectedUserIds.value = [];
        await loadTeamData(1);
    }
});

async function loadTeamData(page: number = 1) {
    if (!props.team) return;

    isLoading.value = true;
    try {
        const response = await fetch(`${teams.getTeamUsers(props.team.id).url}?page=${page}`);
        const data = await response.json();

        console.log('Backend response:', data);

        if (page === 1) {
            selectedUserIds.value = data.assignedUserIds || [];
        }

        paginatedUsers.value = data.users || data.availableUsers || null;

        if (paginatedUsers.value) {
            currentPage.value = paginatedUsers.value.current_page;
        }

        console.log('Paginated users:', paginatedUsers.value);
    } catch (error) {
        console.error('Failed to load team data:', error);
    } finally {
        isLoading.value = false;
    }
}

function isUserSelected(userId: number): boolean {
    return selectedUserIds.value.includes(userId);
}

function toggleUser(userId: number) {
    const index = selectedUserIds.value.indexOf(userId);
    if (index === -1) {
        selectedUserIds.value.push(userId);
    } else {
        selectedUserIds.value.splice(index, 1);
    }
}

function goToPage(page: number) {
    if (page < 1 || (paginatedUsers.value && page > paginatedUsers.value.last_page)) return;
    loadTeamData(page);
}

function handleSubmit() {
    if (!props.team) return;

    isSubmitting.value = true;

    router.post(
        teams.assignUsers().url,
        {
            teamId: props.team.id,
            selectedUsers: selectedUserIds.value,
        },
        {
            onFinish: () => {
                isSubmitting.value = false;
                closeDialog();
            },
        }
    );
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
                    <DialogTitle>Assign Users to {{ team?.name }}</DialogTitle>
                    <DialogDescription>
                        Select users to add to this team. Only available users and current team members are shown.
                    </DialogDescription>
                </DialogHeader>

                <div class="max-h-[300px] space-y-3 overflow-y-auto py-4">
                    <div v-if="isLoading" class="py-8 text-center text-slate-500">
                        Loading users...
                    </div>

                    <div v-else-if="!paginatedUsers || !paginatedUsers.data || paginatedUsers.data.length === 0"
                        class="py-8 text-center text-slate-500">
                        No available users to assign
                    </div>

                    <label v-else v-for="user in paginatedUsers.data" :key="user.id"
                        class="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-all hover:border-teal-300 hover:bg-teal-50 cursor-pointer">
                        <input type="checkbox" :checked="isUserSelected(user.id)" @change="toggleUser(user.id)"
                            class="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                        <div class="flex-1">
                            <p class="font-medium text-slate-900">{{ user.name }}</p>
                            <p class="text-sm text-slate-500">{{ user.email }}</p>
                        </div>
                    </label>
                </div>

                <div v-if="paginatedUsers && paginatedUsers.last_page > 1"
                    class="flex items-center justify-between border-t border-slate-200 pt-3">
                    <div class="text-xs text-slate-600">
                        Page {{ paginatedUsers.current_page }} of {{ paginatedUsers.last_page }}
                    </div>
                    <div class="flex items-center gap-2">
                        <Button variant="outline" size="sm" type="button" @click="goToPage(currentPage - 1)"
                            :disabled="currentPage === 1 || isLoading">
                            <ChevronLeft class="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" type="button" @click="goToPage(currentPage + 1)"
                            :disabled="currentPage === paginatedUsers.last_page || isLoading">
                            <ChevronRight class="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div class="rounded-lg bg-teal-50 p-3 mt-4">
                    <p class="text-sm text-teal-700">
                        <span class="font-semibold">{{ selectedUserIds.length }} user(s)</span> selected
                    </p>
                </div>

                <DialogFooter class="mt-4">
                    <DialogClose as-child>
                        <Button variant="outline" type="button" @click="closeDialog">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" :disabled="isSubmitting" class="bg-teal-600 hover:bg-teal-700">
                        {{ isSubmitting ? 'Assigning...' : 'Assign Users' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>