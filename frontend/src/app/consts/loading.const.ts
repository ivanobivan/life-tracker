const loadingBase = [
    'find-all',
    'create',
    'update',
    'remove',
    'update-order'
] as const;

export const loadingBoard = [
    ...loadingBase,
] as const;

export const loadingList = [
    ...loadingBase,
] as const;

export const loadingTask = [
    ...loadingBase,
] as const;

export type LoadingBoardName = (typeof loadingBoard)[number];
export type LoadingListName = (typeof loadingList)[number];
export type LoadingTaskName = (typeof loadingTask)[number];
