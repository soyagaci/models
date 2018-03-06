export enum Gender {
    Female = 'K',
    Male = 'E',
}

export enum DeathStatus {
    Alive = 'Sağ',
    Dead = 'Ölüm',
}

export enum Relation{
    MotherOf = 'MO',
    FatherOf = 'FO',
    ChildToMother = 'CTM',
    ChildToFather = 'CTF',
}

// mother of, father of, child to mother, child to father relation types.
export type RelationType = 'MO' | 'FO' | 'CTM' | 'CTF';

export class PersonRecord {
    constructor(
        // order of the person in the records.
        readonly order: number,
        // gender of the person this record belongs to
        readonly gender: Gender,
        readonly name: string,
        // person's father's name
        readonly fathersName: string,
        // person's mother's name
        readonly mothersName: string,
        // the city/district the person was born in
        readonly birthPlace: string,
        // birth year of the person
        readonly birthYear: Date,
        // the whole address of the neighbourhood of person's birth (kütük)
        readonly birthNeighbourhood: string,
        // cilt no of the person, describing the book number the family is registered to
        readonly ciltNo: number,
        // hane no of the person, describing the which lastName/family the person belongs to in the cilt (book)
        readonly haneNo: number,
        // sıra no of the person, describing in which order the person was registered to the family
        readonly siraNo: number,
        // marriage status for the person.
        readonly marriageStatus: string,
        // wether the person is dead or alive
        readonly deathStatus: DeathStatus,
        // optional last name parameter
        readonly lastName?: string,
        // date of death for the person.
        readonly dateOfDeath?: Date,
    ) {
        //
    }
}

export class AncestorRecord {
    constructor(
        // a string that defines a relation relative to the starting person to this record.
        // for example: ABA -> Annesinin Babasının Annesi -> The Mother of the Father of the person's Mother...
        readonly relation: string,
        // person record for the ancestor.
        readonly record: PersonRecord,
    ) {
        //
    }
}

export type Relations = { [t in RelationType]: number[]; };
export class RelationalAncestorRecord {
    constructor(
        readonly person: PersonRecord,
        readonly relations: Relations,
    ) {
        //
    }
}


export type RelationalAncestorRecords = RelationalAncestorRecord[];

export function kinshipRelationOrderFunction(a: string, b: string){
    if(!a && !b) return 0;
    else if(!b) return -1;
    else if(!a) return 1;
    else if(a === b) return 0;
    const mapRelationToNumber = { A: 0, B: 1, O: 2, P: 3, K: 4 };
    const [ firstA, firstB ] = [ mapRelationToNumber[a[0]], mapRelationToNumber[b[0]] ];
    if(firstA != firstB) return firstA - firstB;

    const [lengthA, lengthB] = [ a.length, b.length ];
    if(lengthA != lengthB)
        return (lengthA > lengthB ? -1 : 1) * (firstA < mapRelationToNumber.K ? 1 : -1);

    return a.localeCompare(b);
}

function addRelationToAncestorRecord(
    relations: Relations,
    relationType: RelationType,
    index: number,
): Relations {
    const ourRelations = relations[relationType] || [];
    return {...relations, [relationType]: [...ourRelations, index]};
}

/**
 *
 * @param {AncestorRecord[]} records
 * @return {RelationalAncestorRecords}
 */
export function convertRecordArrayToRelations(records: AncestorRecord[]): RelationalAncestorRecords{
    const sorted = records.sort((a, b) => kinshipRelationOrderFunction(a.relation, b.relation));
    const defaultValue = { result: [], keys: {} };

    return sorted.reduce((acc, { record, relation }) => {
        const currentIndex = acc.result.length;
        const key = relation === 'K' ? '' : relation;
        const childRelations: RelationType[] = record.gender === Gender.Male ?
            [Relation.FatherOf, Relation.ChildToFather] :
            [Relation.MotherOf, Relation.ChildToMother];

        const relationsToAdd = [
            { siblingKey: key + 'A', ourRelation: Relation.ChildToMother, siblingRelation: Relation.MotherOf },
            { siblingKey: key + 'B', ourRelation: Relation.ChildToFather, siblingRelation: Relation.FatherOf },
            { siblingKey: key + 'O', ourRelation: childRelations[0], siblingRelation: childRelations[1] },
            { siblingKey: key + 'P', ourRelation: childRelations[0], siblingRelation: childRelations[1] },
        ];

        const relations = relationsToAdd.reduce((relations, { siblingKey, ourRelation, siblingRelation }) => {
            if(!acc.keys.hasOwnProperty(siblingKey)) return relations;
            const siblingIndex = acc.keys[siblingKey];
            const sibling = acc.result[siblingIndex];
            const ourRelations = addRelationToAncestorRecord(relations, ourRelation, siblingIndex);
            const siblingRelations = addRelationToAncestorRecord(sibling.relations, siblingRelation, currentIndex);

            sibling.relations = siblingRelations;
            return ourRelations;
        }, {} as Relations);

        acc.keys[key] = currentIndex;
        acc.result[currentIndex] = new RelationalAncestorRecord(record, relations);
        return acc;
    }, defaultValue).result;
}
