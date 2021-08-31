<p align="center">
  <a href="https://www.postgresql.org/" target="blank"><img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="100" alt="postgresql icon" /></a>
</p>

## What is PostgreSQL?
**오픈소스** 객체 관계형 데이터베이스 시스템  
PostgreSQL는 1986년 University of California의 POSTGRES 프로젝트의 일환으로 시작되었으며 30 년 이상 활발하게 개발됨.

## 다운로드 및 설치, 접속
[패키지 버전](https://www.postgresql.org/download/)  
[Mac은 app버전으로도 설치 가능](https://postgresapp.com/)  
다운로드 및 설치후 127.0.0.1:5432로 슈퍼계정으로 비밀번호 없이 접속가능함(postgres)

## 공식 문서
[Documentation](https://www.postgresql.org/docs/)  

## 데이터베이스 기본 개념
1. 데이터베이스
    - 방대한 데이터의 집합
2. DBMS
    - 데이터베이스를 관리하는 시스템
3. RDBMS
    - 관계형 데이터베이스를 관리하는 시스템
4. 관계형 데이터베이스
    - 각 개체간의 관계를 표현
    - 각 개체간의 데이터를 겹합해서 표현
5. 데이터베이스 스키마
    - 데이터베이스에서 각 개체의 구조 및 관계등을 정의한 구조
6. PostgreSQL 데이터베이스, 스키마
    - 테이블의 목적이나 용도에 따라 하나의 데이터베이스에 관리
    - 데이터베이스 내에서도 스키마를 통해 그룹화해서 사용
    - public 스키마를 기본으로 제공해줌
5. 릴레이션(테이블,각각의 개체)
6. 속성(어트리뷰트,컬럼)
7. 튜플(레코드,로우)
8. SQL
    - DDL -> 데이터 정의어, Create, Alter등 데이터 구조에 대한 쿼리
    - DML -> 데이터 조작어, 일반적으로 많이 쓰는 CURD가 여기에 속함
    - DCL -> 데이터 제어어, Grant, Revoke등 접근 및 권한에 대한 쿼리
    - TCL -> 트랜잭션 제어어, 논리적인 작업의 단위, Commit, Rollback등

## 여러가지 SQL들

##### 현재 스키마 확인
~~~sql
select current_schema();
show search_path;
-- 현재 스키마 확인

set search_path to contact;
-- 현재 스키마를 contact로 변경

show timezone
-- 타임존
~~~

 
##### 테이블 CREATE
~~~sql
-- user 테이블
create table public.user
(
    id          bigserial primary key,
    -- primary key로 user내에서 유일한 값을 가짐
    -- psql에서 bigserial 타입으로 생성하면 자동으로 시퀀스 생성
    user_type   char(1) not null,
    -- char 타입인 user_type, 값이 무조건 있어야함(not null)
    name        varchar(8) not null,
    -- varchar(가변갈이) 타입인 name, 값이 무조건 있어야함(not null)
    tel         text not null,
    -- text타입인 tel
    created_at  timestamp not null default now()
    -- timestamp 타입이고 미입력시 자동으로 현재날짜 세팅
);

-- post 테이블
create table public.post
(
    id          bigserial primary key,
    contents    text not null,
    created_at  timestamp not null default now(),
    user_id     bigint not null
    constraint fk_user_post
      references public.user(id)
        on update cascade
        on delete cascade
    -- user테이블과 관계가 생겼음(foreign key생성)
    -- on update cascade는 user.id가 변경시 같이 업데이트
    -- on delete cascade는 user.id가 삭제시 같이 삭제되는 옵션
);

-- comment 테이블
create table public.comment
(
    id          bigserial primary key,
    titl        varchar(100) not null,
    contents    text,
    created_at  timestamp not null default now()
);

-- comment 테이블에 컬럼명 변경
alter table public.comment rename column titl to title;
-- comment 테이블에 컬럼 not null 제거
alter table public.comment drop column title drop not null;
-- comment 테이블에 컬럼 삭제
alter table public.comment drop column title;
-- comment 테이블에 컬럼 추가
alter table public.comment add column post_id bigint not null;
-- comment - post 관계 맺기
alter table public.comment add constraint fk_post_comment foreign key (post_id) references public.post(id) on update cascade on delete cascade;
~~~

##### 테이블, 컬럼에 주석달기
~~~sql
comment on table public.user is '사용자';
comment on column public.user.name is '사용자 이름';
~~~

##### 테이블 SELECT
~~~sql
-- public.user의 모든 컬럼의 데이터 조회
select * from public.user;

-- public.user의 특정 컬럼의 데이터 조회
select id, name from public.user;

-- public.user의 특정 컬럼의 데이터를 조건을 걸어서 조회
select id, name from public.user where id = 1;
~~~

##### 테이블 INSERT
~~~sql
-- default로 넣으면 default로 설정된 값이 들어감
insert into public.user(id, user_type, name, tel, created_at) values (default, 'A','순기', '01099991111', default)
-- 컬럼 순서대로 넣는다고 가정하면 컬럼은 생략가능
insert into public.user values (default, 'A','순기2', '01099991111', default)
~~~

##### 테이블 UPDATE
~~~sql
-- user의 name컬럼의 모든 값을 홍일로 변경
update public.user set name = '홍일'
-- id가 1일 row의 name컬럼을 바보로 변경
update public.user set name = '바보' where id = 1
~~~

##### 테이블 DELETE
~~~sql
-- user테이블의 모든 row삭제 -> 위험!!!
delete from public.user
-- id가 1일 row를 삭제
delete from public.user where id = 1
~~~


##### 테이블 JOIN, 관계가 있는 테이블끼리 조회
~~~sql
-- inner 조인
-- user와 post간 데이터가 있어야 조회됨
select * from public.user as u 
inner join post as p 
on u.id = p.user_id
-- 특정 데이터만 조회
select u.name, p.title from public.user as u inner join post as p on u.id = p.user_id

-- outer 조인
-- user나 post에 데이터가 없어도 조회됨
-- left일 경우 왼쪽 테이블, right일 경우 오른쪽 테이블이 기준이기 떄문에 반대편 테이블은 데이터가 없어도 기준이 되는 테이블이 조회가됨
select * from public.user as u left outer join post as p on u.id = p.user_id
select * from public.user as u right outer join post as p on u.id = p.user_id
~~~

##### 테이블 집계
~~~sql
-- 집계 group by
-- user별 몇개의 post를 작성했는지 필요할때
-- select절에는 group by 뒤에 있는 컬럼과 집계합수(count, sum, avg ...)만 사용가능함
select user_id, count(*) from public.post group by user_id
~~~

##### 조건문
~~~sql
-- case
select case user_type when 'A' then '관리자' when 'B' then '사용자' else '탈퇴' end from public.user
-- coalesce -> contents가 null이면 두번째 값, 아니면 contents
select coalesce(contents, '빈값') from public.comment;
-- nullif -> contents, title이 같으면 null 아니면 contents
select nullif(contents, title) from public.comment;
~~~

##### 서브쿼리
~~~sql
-- subquery 종류
-- 서브쿼리 -> where절
select * from public.post
where user_id in (
  select id from public.user
)

-- 스칼라 서브쿼리 -> select절
select id, (select contents from public.post where user_id = u.id) from public.user as u

-- 인라인뷰 -> from점
select id from  (
  select id from public.user
)
~~~

##### 테이블 정렬
~~~sql
-- id 오름차순으로 정렬
select id, name from public.user order by id;
-- id 내림차순, created_at 오름 차순으로 정렬
select id, name from public.user order by id desc, created_at;
-- created_at 내림차순, null인 값들이 제일 위로, nulls last면 제일 뒤로
select id, name from public.user order by created_at desc nulls first
~~~

##### 페이징(offset, limit)
~~~sql
-- 처음 10개의 데이터
select * from public.post order by created_at limit 10 
select * from public.post order by created_at limit 10 offset 0;

-- 11번째 부터 10개의 데이터
select * from public.post order by created_at limit 10 offset 10
~~~

## 사용자 생성 및 권한 부여
데이터베이스에는 모든 데이터가 저장되기 때문에 권한 설정이 필수임

#### 사용자 관리

##### 사용자 목록 조회
~~~sql
select * from pg_user;
~~~

##### 사용자 생성
```sql
create user jack;
--기본값으로 jack이라는 사용자가 생성됨
--슈퍼권한 없음,DB 생성 권한 없음,사용자 생성 권한 없음,비밀번호 없음
```
```sql
create user jack2 password 'qwer1234';
--비밀번호가 qwer1234인 jack2이라는 사용자가 생성됨
```
```sql
create user jack3 password 'qwer1234' SUPERUSER CREATEDB CREATEUSER;
--비밀번호가 qwer1234이고 슈퍼권한, db생성 권한,사용자 생성 권한을 가진 jack3이라는 사용자가 생성됨
```
#### 권한 부여
GRANT "권한" ON "스키마, 테이블" TO "사용자"

```sql
grant usage ON schema public TO jack ;
--public schema 접근 권하을 jack 사용자에게 부여

grant select on all tables in schema public to jack;
--public schema의 모든 테이블의 SELECT권한을 jack 사용자에게 부여

grant insert, update on all tables in schema public to jack;
--public schema의 모든 테이블의 INSERT, UPDATE 권한을 jack 사용자에게 부여

grant update on all tables in schema public to jack;
--public schema의 모든 테이블의 UPDATE권한을 jack 사용자에게 부여

grant delete on public.user to jack;
--public schema의 user테이블의 DELETE 권한을 jack 사용자에게 부여

grant usage on all sequences in schema public TO jack;
--public schema의 모든 시퀀스의 사용(생성, 조회) 권한을 jack 사용자에게 부여

grant references on all tables in schema public TO jack;
--public schema의 모든 테이블의 외래키 생성 권한을 jack 사용자에게 부여
```

#### 권한 제거
REVOKE "권한" ON "스키마, 테이블" FROM "사용자"
```sql
revoke select on all tables in schema public from jack;
--public schema의 SELECT권한을 jack 사용자에게 제거
```

#### 그룹 관리
특정 권한을 가진 그룹을 생성하고 사용자에게 해당 그룹의 권한을 할당하면 동일한 권한을 여러 사용자에게 부여 가능함
##### 그룹 목록 조회
~~~sql
select * from pg_group;
~~~
##### 그룹 생성
```sql
create group group_s;
--group_s라는 그룹이 생성됨
```
##### 그룹에 사용자 추가
```sql
alter group group_s add user jack;
--group_s라는 그룹이 생성됨
```
##### 그룹 권한 부여
사용자 권한 부여와 동일함
```sql
grant select on all tables in schema public to group_s;
--public schema의 모든 테이블의 SELECT권한을 group_s 그룹에게 부여
```

#### 롤 관리
user, group를 포괄하는 개념, 일반적으로 롤을 만들면 user처럼 동작함(라고 생각됩니다...)
##### 롤 생성
```sql
create role select_role;
--select_role 이라는 role이 생성됨
```
##### 롤 권한 부여
사용자 권한 부여와 동일함
```sql
grant select on all tables in schema public to select_role;
--public schema의 모든 테이블의 SELECT권한을 group_s 그룹에게 부여
```


