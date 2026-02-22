<script setup lang="ts">
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
import { Bell, BookOpen, BriefcaseBusiness, Folder, Handshake, LayoutGrid, Users } from 'lucide-vue-next';
import AppLogo from './AppLogo.vue';
import teams from '@/routes/teams';
import users from '@/routes/users';
import projects from '@/routes/projects';
import { computed } from 'vue';
import notifications from '@/routes/notifications';

const page = usePage();
const permissions = computed(() => page.props.auth.permissions as string[]);
const can = (permission: string) => permissions.value.includes(permission);

const mainNavItems = computed<NavItem[]>(() => [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    ...(can('view team') ? [{
        title: 'Teams',
        href: teams.index(),
        icon: Handshake,
    }] : []),
    ...(can('view user') ? [{
        title: 'Users',
        href: users.index(),
        icon: Users,
    }] : []),
    ...(can('view project') ? [{
        title: 'Project & Tasks',
        href: projects.index(),
        icon: BriefcaseBusiness,
    }] : [])
]);

const footerNavItems: NavItem[] = [
    {
        title: 'Notifications',
        href: notifications.index(),
        icon: Bell,
    }
];
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="dashboard()">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
