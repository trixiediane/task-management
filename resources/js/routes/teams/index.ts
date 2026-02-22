import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TeamController::index
 * @see app/Http/Controllers/TeamController.php:14
 * @route '/teams'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/teams',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamController::index
 * @see app/Http/Controllers/TeamController.php:14
 * @route '/teams'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::index
 * @see app/Http/Controllers/TeamController.php:14
 * @route '/teams'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamController::index
 * @see app/Http/Controllers/TeamController.php:14
 * @route '/teams'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamController::index
 * @see app/Http/Controllers/TeamController.php:14
 * @route '/teams'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamController::index
 * @see app/Http/Controllers/TeamController.php:14
 * @route '/teams'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamController::index
 * @see app/Http/Controllers/TeamController.php:14
 * @route '/teams'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\TeamController::getTeamUsers
 * @see app/Http/Controllers/TeamController.php:32
 * @route '/teams/{team}/users'
 */
export const getTeamUsers = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTeamUsers.url(args, options),
    method: 'get',
})

getTeamUsers.definition = {
    methods: ["get","head"],
    url: '/teams/{team}/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamController::getTeamUsers
 * @see app/Http/Controllers/TeamController.php:32
 * @route '/teams/{team}/users'
 */
getTeamUsers.url = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { team: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    team: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team: typeof args.team === 'object'
                ? args.team.id
                : args.team,
                }

    return getTeamUsers.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::getTeamUsers
 * @see app/Http/Controllers/TeamController.php:32
 * @route '/teams/{team}/users'
 */
getTeamUsers.get = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTeamUsers.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamController::getTeamUsers
 * @see app/Http/Controllers/TeamController.php:32
 * @route '/teams/{team}/users'
 */
getTeamUsers.head = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTeamUsers.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamController::getTeamUsers
 * @see app/Http/Controllers/TeamController.php:32
 * @route '/teams/{team}/users'
 */
    const getTeamUsersForm = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTeamUsers.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamController::getTeamUsers
 * @see app/Http/Controllers/TeamController.php:32
 * @route '/teams/{team}/users'
 */
        getTeamUsersForm.get = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTeamUsers.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamController::getTeamUsers
 * @see app/Http/Controllers/TeamController.php:32
 * @route '/teams/{team}/users'
 */
        getTeamUsersForm.head = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTeamUsers.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTeamUsers.form = getTeamUsersForm
/**
* @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:61
 * @route '/teams/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/teams/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:61
 * @route '/teams/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:61
 * @route '/teams/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:61
 * @route '/teams/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:61
 * @route '/teams/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:61
 * @route '/teams/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:61
 * @route '/teams/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\TeamController::store
 * @see app/Http/Controllers/TeamController.php:66
 * @route '/teams'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/teams',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamController::store
 * @see app/Http/Controllers/TeamController.php:66
 * @route '/teams'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::store
 * @see app/Http/Controllers/TeamController.php:66
 * @route '/teams'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamController::store
 * @see app/Http/Controllers/TeamController.php:66
 * @route '/teams'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamController::store
 * @see app/Http/Controllers/TeamController.php:66
 * @route '/teams'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TeamController::edit
 * @see app/Http/Controllers/TeamController.php:82
 * @route '/teams/{team}/edit'
 */
export const edit = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/teams/{team}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamController::edit
 * @see app/Http/Controllers/TeamController.php:82
 * @route '/teams/{team}/edit'
 */
edit.url = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { team: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    team: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team: typeof args.team === 'object'
                ? args.team.id
                : args.team,
                }

    return edit.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::edit
 * @see app/Http/Controllers/TeamController.php:82
 * @route '/teams/{team}/edit'
 */
edit.get = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamController::edit
 * @see app/Http/Controllers/TeamController.php:82
 * @route '/teams/{team}/edit'
 */
edit.head = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamController::edit
 * @see app/Http/Controllers/TeamController.php:82
 * @route '/teams/{team}/edit'
 */
    const editForm = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamController::edit
 * @see app/Http/Controllers/TeamController.php:82
 * @route '/teams/{team}/edit'
 */
        editForm.get = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamController::edit
 * @see app/Http/Controllers/TeamController.php:82
 * @route '/teams/{team}/edit'
 */
        editForm.head = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\TeamController::update
 * @see app/Http/Controllers/TeamController.php:87
 * @route '/teams/{team}'
 */
export const update = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/teams/{team}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TeamController::update
 * @see app/Http/Controllers/TeamController.php:87
 * @route '/teams/{team}'
 */
update.url = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { team: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    team: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team: typeof args.team === 'object'
                ? args.team.id
                : args.team,
                }

    return update.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::update
 * @see app/Http/Controllers/TeamController.php:87
 * @route '/teams/{team}'
 */
update.put = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TeamController::update
 * @see app/Http/Controllers/TeamController.php:87
 * @route '/teams/{team}'
 */
    const updateForm = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamController::update
 * @see app/Http/Controllers/TeamController.php:87
 * @route '/teams/{team}'
 */
        updateForm.put = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\TeamController::destroy
 * @see app/Http/Controllers/TeamController.php:118
 * @route '/teams/{team}'
 */
export const destroy = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/teams/{team}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TeamController::destroy
 * @see app/Http/Controllers/TeamController.php:118
 * @route '/teams/{team}'
 */
destroy.url = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { team: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    team: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team: typeof args.team === 'object'
                ? args.team.id
                : args.team,
                }

    return destroy.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::destroy
 * @see app/Http/Controllers/TeamController.php:118
 * @route '/teams/{team}'
 */
destroy.delete = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TeamController::destroy
 * @see app/Http/Controllers/TeamController.php:118
 * @route '/teams/{team}'
 */
    const destroyForm = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamController::destroy
 * @see app/Http/Controllers/TeamController.php:118
 * @route '/teams/{team}'
 */
        destroyForm.delete = (args: { team: number | { id: number } } | [team: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\TeamController::assignUsers
 * @see app/Http/Controllers/TeamController.php:103
 * @route '/teams/assign-users'
 */
export const assignUsers = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignUsers.url(options),
    method: 'post',
})

assignUsers.definition = {
    methods: ["post"],
    url: '/teams/assign-users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamController::assignUsers
 * @see app/Http/Controllers/TeamController.php:103
 * @route '/teams/assign-users'
 */
assignUsers.url = (options?: RouteQueryOptions) => {
    return assignUsers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::assignUsers
 * @see app/Http/Controllers/TeamController.php:103
 * @route '/teams/assign-users'
 */
assignUsers.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignUsers.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamController::assignUsers
 * @see app/Http/Controllers/TeamController.php:103
 * @route '/teams/assign-users'
 */
    const assignUsersForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assignUsers.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamController::assignUsers
 * @see app/Http/Controllers/TeamController.php:103
 * @route '/teams/assign-users'
 */
        assignUsersForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assignUsers.url(options),
            method: 'post',
        })
    
    assignUsers.form = assignUsersForm
const teams = {
    index: Object.assign(index, index),
getTeamUsers: Object.assign(getTeamUsers, getTeamUsers),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
assignUsers: Object.assign(assignUsers, assignUsers),
}

export default teams