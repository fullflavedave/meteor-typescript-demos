/// <reference path="packages/typescript-libs/meteor.d.ts" />
/// <reference path="packages/typescript-libs/underscore.d.ts" />

interface PartiesDAO {
    _id?: string;
    owner?: string;
    x?: number;
    y?: number;
    title?: string;
    description?: string;
    public?: boolean;
    invited?: Array;
    rsvps?: Array;
}

declare var Parties:Meteor.Collection<PartiesDAO>;
