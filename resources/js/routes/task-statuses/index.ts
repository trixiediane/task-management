import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TaskStatusController::store
 * @see app/Http/Controllers/TaskStatusController.php:12
 * @route '/projects/{project}/task-statuses'
 */
export const store = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/task-statuses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TaskStatusController::store
 * @see app/Http/Controllers/TaskStatusController.php:12
 * @route '/projects/{project}/task-statuses'
 */
store.url = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { project: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.id
                : args.project,
                }

    return store.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskStatusController::store
 * @see app/Http/Controllers/TaskStatusController.php:12
 * @route '/projects/{project}/task-statuses'
 */
store.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TaskStatusController::store
 * @see app/Http/Controllers/TaskStatusController.php:12
 * @route '/projects/{project}/task-statuses'
 */
    const storeForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TaskStatusController::store
 * @see app/Http/Controllers/TaskStatusController.php:12
 * @route '/projects/{project}/task-statuses'
 */
        storeForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TaskStatusController::update
 * @see app/Http/Controllers/TaskStatusController.php:30
 * @route '/projects/{project}/task-statuses/{taskStatus}'
 */
export const update = (args: { project: number | { id: number }, taskStatus: number | { id: number } } | [project: number | { id: number }, taskStatus: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/task-statuses/{taskStatus}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TaskStatusController::update
 * @see app/Http/Controllers/TaskStatusController.php:30
 * @route '/projects/{project}/task-statuses/{taskStatus}'
 */
update.url = (args: { project: number | { id: number }, taskStatus: number | { id: number } } | [project: number | { id: number }, taskStatus: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    taskStatus: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.id
                : args.project,
                                taskStatus: typeof args.taskStatus === 'object'
                ? args.taskStatus.id
                : args.taskStatus,
                }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{taskStatus}', parsedArgs.taskStatus.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskStatusController::update
 * @see app/Http/Controllers/TaskStatusController.php:30
 * @route '/projects/{project}/task-statuses/{taskStatus}'
 */
update.put = (args: { project: number | { id: number }, taskStatus: number | { id: number } } | [project: number | { id: number }, taskStatus: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\TaskStatusController::update
 * @see app/Http/Controllers/TaskStatusController.php:30
 * @route '/projects/{project}/task-statuses/{taskStatus}'
 */
    const updateForm = (args: { project: number | { id: number }, taskStatus: number | { id: number } } | [project: number | { id: number }, taskStatus: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TaskStatusController::update
 * @see app/Http/Controllers/TaskStatusController.php:30
 * @route '/projects/{project}/task-statuses/{taskStatus}'
 */
        updateForm.put = (args: { project: number | { id: number }, taskStatus: number | { id: number } } | [project: number | { id: number }, taskStatus: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TaskStatusController::destroy
 * @see app/Http/Controllers/TaskStatusController.php:48
 * @route '/projects/{project}/task-statuses/{taskStatus}'
 */
export const destroy = (args: { project: number | { id: number }, taskStatus: number | { id: number } } | [project: number | { id: number }, taskStatus: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/task-statuses/{taskStatus}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TaskStatusController::destroy
 * @see app/Http/Controllers/TaskStatusController.php:48
 * @route '/projects/{project}/task-statuses/{taskStatus}'
 */
destroy.url = (args: { project: number | { id: number }, taskStatus: number | { id: number } } | [project: number | { id: number }, taskStatus: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    taskStatus: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.id
                : args.project,
                                taskStatus: typeof args.taskStatus === 'object'
                ? args.taskStatus.id
                : args.taskStatus,
                }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{taskStatus}', parsedArgs.taskStatus.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskStatusController::destroy
 * @see app/Http/Controllers/TaskStatusController.php:48
 * @route '/projects/{project}/task-statuses/{taskStatus}'
 */
destroy.delete = (args: { project: number | { id: number }, taskStatus: number | { id: number } } | [project: number | { id: number }, taskStatus: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TaskStatusController::destroy
 * @see app/Http/Controllers/TaskStatusController.php:48
 * @route '/projects/{project}/task-statuses/{taskStatus}'
 */
    const destroyForm = (args: { project: number | { id: number }, taskStatus: number | { id: number } } | [project: number | { id: number }, taskStatus: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TaskStatusController::destroy
 * @see app/Http/Controllers/TaskStatusController.php:48
 * @route '/projects/{project}/task-statuses/{taskStatus}'
 */
        destroyForm.delete = (args: { project: number | { id: number }, taskStatus: number | { id: number } } | [project: number | { id: number }, taskStatus: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const taskStatuses = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default taskStatuses