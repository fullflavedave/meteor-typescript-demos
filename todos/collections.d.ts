/// <reference path="../meteor.d.ts" />
interface TodoDAO {
    _id?: string;
    text: string;
    done: boolean;
    tags: string[];
    list_id: string;
    timestamp: number;
}
declare var Todos: Meteor.Collection<TodoDAO>;

interface ListDAO {
    _id?: string;
    name: string;
}

declare var Lists: Meteor.Collection<ListDAO>;
