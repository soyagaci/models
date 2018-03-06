import {convertRecordArrayToRelations, kinshipRelationOrderFunction, PersonRecord} from '../lib';
import {AncestorRecord} from '../lib';

describe('index spec', () => {
   describe('kinshipRelationOrderFunction function', () => {
       const kinshipTests = [
           {
               data: ['K', 'O', 'P', 'A', 'B', 'OP', 'PO', 'AA', 'BB', 'BAB', 'OPO'],
               expectedResult: ["AA", "A", "BAB", "BB", "B", "OPO", "OP", "O", "PO", "P", "K"]
           },
           {
               data: ['K', 'A', 'O', 'P', 'B'],
               expectedResult: ['A', 'B', 'O', 'P', 'K']
           },
           {
               data: ['PP', 'A', 'O', 'P', 'B'],
               expectedResult: ['A', 'B', 'O', 'PP', 'P']
           }
       ];
       it('should order according to kinship going up/down', () => {
           for(let test of kinshipTests)
               expect(test.data.sort(kinshipRelationOrderFunction)).toEqual(test.expectedResult);
       });
   });

   describe('convertRecordArrayToRelations function', () => {
       const recordArrayTests = [
           {
               data: [
                   new AncestorRecord('A', { name: 'Anne' } as PersonRecord),
                   new AncestorRecord('AB', { name: 'Dede' } as PersonRecord),
                   new AncestorRecord('K', { name: 'Kendisi' } as PersonRecord),
               ],
               expectedResult: [
                   { person: { name: 'Dede'}, relations: { FO:[1] } },
                   { person: { name: 'Anne'}, relations: { CTF: [ 0 ], MO: [ 2 ] } },
                   { person: { name: 'Kendisi'}, relations: { CTM: [ 1 ] } }
               ]
           },
           {
               data: [
                   new AncestorRecord('K', { name: 'Kendisi' } as PersonRecord),
                   new AncestorRecord('O', { name: 'Oğlu' } as PersonRecord),
                   new AncestorRecord('A', { name: 'Anne' } as PersonRecord),
                   new AncestorRecord('BA', { name: 'Babasının Annesi' } as PersonRecord),
                   new AncestorRecord('B', { name: 'Baba' } as PersonRecord),
                   new AncestorRecord('OP', { name: 'Oğlunun Kızı' } as PersonRecord),
               ],
               expectedResult: [
                   { person: { name: 'Anne' }, relations: { MO: [ 5 ] } },
                   { person: { name: 'Babasının Annesi' }, relations: { MO: [ 2 ] } },
                   { person: { name: 'Baba' }, relations: { CTM: [ 1 ], FO: [ 5 ] } },
                   { person: { name: 'Oğlunun Kızı' }, relations: { CTM: [ 4 ] } },
                   { person: { name: 'Oğlu' }, relations: { MO: [ 3 ], CTM: [ 5 ] } },
                   { person: { name: 'Kendisi' }, relations: { CTM: [ 0 ], CTF: [ 2 ], MO: [ 4 ] } }
               ]
           },
       ];

       it('should convert ancestor record array to relation array', () => {
           for(let test of recordArrayTests) {
               const result = convertRecordArrayToRelations(test.data);

               expect(result).toEqual(test.expectedResult);
           }
       });
   });
});
