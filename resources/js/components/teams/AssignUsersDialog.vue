<script setup lang="ts">
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';
import teams from '@/routes/teams';
import { useForm } from '@inertiajs/vue3';
import {  computed, watch } from 'vue';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Team {
    id: number;
    name: string;
    users?: User[];
}

interface TeamUserAssignment {
    team_id: number;
    user_id: number;
}

interface Props {
    open: boolean;
    team: Team | null;
    users: User[];
    teamUserAssignments: TeamUserAssignment[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
    'update:open': [value: boolean];
    'close': [];
}>();

const form = useForm<{
    selectedUsers: number[];
    teamId: number | null;
}>({
    selectedUsers: [],
    teamId: null
});

const availableUsers = computed(() => {
    if (!props.team) return [];

    return props.users.filter(user => {
        // Check if user is assigned to any other team
        const assignedToOtherTeam = props.teamUserAssignments.some(
            assignment => assignment.user_id === user.id && assignment.team_id !== props.team!.id
        );

        return !assignedToOtherTeam;
    });
});

watch(() => props.open, (isOpen) => {
    if (isOpen && props.team) {
        form.teamId = props.team.id;
        form.selectedUsers = props.team.users?.map(u => u.id) || [];
    }
});

function handleAssignUsers() {
    form.post(teams.assignUsers().url, {
        onSuccess: () => {
            emit('update:open', false);
            emit('close');
        },
        preserveScroll: true
    });
}

function handleDialogClose() {
    emit('update:open', false);
    emit('close');
}
</script>

<template>
    <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
        <DialogContent class="sm:max-w-[500px]">
            <form @submit.prevent="handleAssignUsers">
                <DialogHeader>
                    <DialogTitle>Assign Users to {{ team?.name }}</DialogTitle>
                    <DialogDescription>
                        Select users to add to this team
                    </DialogDescription>
                </DialogHeader>
                <div class="max-h-[300px] space-y-3 overflow-y-auto py-4">
                    <label v-for="user in availableUsers" :key="user.id"
                        class="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-all hover:border-teal-300 hover:bg-teal-50 cursor-pointer">
                        <input type="checkbox" :value="user.id" v-model="form.selectedUsers"
                            class="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                        <div class="flex-1">
                            <p class="font-medium text-slate-900">{{ user.name }}</p>
                            <p class="text-sm text-slate-500">{{ user.email }}</p>
                        </div>
                    </label>
                    <div v-if="availableUsers.length === 0" class="py-8 text-center text-slate-500">
                        No available users to assign
                    </div>
                </div>
                <div class="rounded-lg bg-teal-50 p-3 mt-4">
                    <p class="text-sm text-teal-700">
                        <span class="font-semibold">{{ form.selectedUsers.length }} user(s)</span> selected
                    </p>
                </div>
                <DialogFooter class="mt-4">
                    <DialogClose as-child>
                        <Button variant="outline" type="button" @click="handleDialogClose">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" :disabled="form.processing" class="bg-teal-600 hover:bg-teal-700">
                        {{ form.processing ? 'Assigning...' : 'Assign Users' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
