# [TypeScript](https://www.typescriptlang.org/)
**TypeScript**  is JavaScript with syntax for types.

## [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

## 타입 추론
```ts
let helloWorld = "Hello World";
// let helloWorld: string
```

## 타입 정의
```ts
// 유저 
const user = {
  name: "Hayes",
  id: 0,
};

// 유저 인터페이스
interface User {
  name: string;
  id: number;
}

// 유저는 User타입을 가짐
const user: User = {
  name: "Hayes",
  id: 0,
};

// User인터페이스에 userName은 없기 떄문에 타입 오류 발생
const otherUser: User = {
  userName: "Hayes",
  id: 0,
};

// 클래스에도 사용가능
class UserAccount {
  name: string;
  id: number;
 
  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

// 유저 생성
const userAccount: User = new UserAccount("Murphy", 1);
```


## 자바스크립트의 기본 타입
boolean, bigint, null, number, string, symbol, undefined

## 타입스크립트의 추가 타입
- any: 아무거나
- unknown: 알수없음 -> 타입을 지정하지 않으면 다른 변수에 할당이나 속성 접근등이 불가능함
- void: 리턴값이 없음 -> undefined
- never: 발생할수 없는 타입 -> while, throw

## 타입 구성
좀더 복잡한 타입을 만들기 

1. Union (여러 타입) 
 
```ts
// MyBool은 true와 false가 올수 있음
type MyBool = true | false;

// 리터럴을 타입으로 지정가능함
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;

// 서로 다른 타입으로도 가능함
function getLength(obj: string | string[]) {
  return obj.length;
}

// 직접 타입을 체크하면 타입스크립트에서도 확인가능
function wrapInArray(obj: string | string[]) {
  // obj: string
  if (typeof obj === "string") {
    return [obj];
  }
  return obj;
}
```

2. Generics (변수에 타입을 제공) 
 
```ts
// 각각 제네릭으로 넘겨준 타입의 배열
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;

// type를 제네릭으로 받는 Backpack
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}
 
// backpack은 string
declare const backpack: Backpack<string>;
 
// object는 string
const object = backpack.get();
 
// string로 생성했기 때문에 number 값을 주면 타입 오류
backpack.add(23);
```


## 구조적 타입 시스템
타입스크립트의 타입검사는 값의 모양에 초점을 둠
```ts
interface Point {
  x: number;
  y: number;
}
 
function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
 
// point의 타입은 선언되지 않음
const point = { x: 12, y: 26 };
// point와 interface Point의 모양이 같기 때문에 타입스크립트가 동일하게 간주함
logPoint(point);
// logs "12, 26"

// 모양이 무조건 같아야 하는건 아님 -> interface Point가 포함되면 됨
const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); 
// logs "33, 3"
 
const color = { hex: "#187ABF" };
// 모양이 다르기 때문에 오류 발생
logPoint(color);
```

## Differences Between Type Aliases and Interfaces
둘이 비슷하며 필요에 따라 쓰고 싶은거 쓰면 됨
1. extend or intersections  

```ts
// 인터페이스
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

// Animal의 name과 Bear의 꿀을 사용가능
const bear = getBear() 
bear.name
bear.honey

// 타입
type Animal = {
  name: string
}

type Bear = Animal & { 
  honey: boolean 
}

// Animal의 name과 Bear의 꿀을 사용가능
const bear = getBear();
bear.name;
bear.honey;
```

2. interface, type 선언 

```ts
// 인터페이스는 선언이 합쳐짐
interface Bear {
  name: string
}

interface Bear {
  honey: boolean
}

const bear = getBear();
bear.name;
bear.honey;

// 타입은 중복 오류 발생
type Bear {
  name: string
}

type Bear {
  honey: boolean
}
```

3. 무엇을 써야할지 잘 모르겠으면 그냥 인터페이스를 쓰다가 타입의 기능이 필요한 경우에 타입을 쓰면 됨 