import {kinshipRelationOrderFunction} from '../lib';

describe('index spec', () => {
   describe('kinshipRelationOrderFunction function', () => {
       const kinshipTests = [
           {
               data: ['K', 'O', 'P', 'A', 'B', 'OP', 'PO', 'AA', 'BB', 'BAB', 'OPO'],
               expectedResult: ["AA", "A", "BAB", "BB", "B", "K", "O", "OP", "OPO", "P", "PO"]
           },
           {
               data: ['K', 'A', 'O', 'P', 'B'],
               expectedResult: ['A', 'B', 'K', 'O', 'P']
           },
           {
               data: ['PP', 'A', 'O', 'P', 'B'],
               expectedResult: ['A', 'B', 'O', 'P', 'PP']
           }
       ];
       it('should order according to kinship going up/down', () => {
           for(let test of kinshipTests)
               expect(test.data.sort(kinshipRelationOrderFunction)).toEqual(test.expectedResult);
       });
   });
});
