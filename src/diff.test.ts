import { objComplement } from "./diff";

describe('sum module', () => {
  test('it gives the object complement', () => {
    const obj1: object = {
      city: "New York",
      street: "5th street",
      number: "5",
      neighbors: {
        bill: {
          city: "New York",
          street: "5th street"

        },
        john: {
          city: "New York"
        }
      }
    }

    const obj2: object = {
      city: "New York",
      number: "5",
      neighbors: {
        bill: {
          street: "5th street"
        },
        john: {
          city: "New York"
        }
      }
    }

    const complement = objComplement(obj1, obj2);

    expect(complement['street']).toEqual('5th street')
    expect(complement['neighbors']['bill']['city']).toEqual('New York')
    expect(complement['neighbors']['john']).toBeUndefined()
  });
});

