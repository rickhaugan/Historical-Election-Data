/*************************************************************
1) FIRST CREATE DATABASE IN POSTGRES CALLED "election_data"
2) CREATE BOTH TABLES BELOW
3) RUN JUPYTER NOTEBOOK
4) RUN INSERT STATEMENT
**************************************************************/

/*CREATE BOTH TABLES PRIOR TO IMPORT*/
create table elections (
id serial primary key
,year integer
,state varchar(100)
,state_po varchar(2)
,county varchar(100)
,fips integer
,office varchar(100)
,candidate varchar(100)
,party varchar(100)
,candidatevotes integer
,totalvotes integer
,version varchar(100)
)



create table edata (
id serial primary key
,year integer
,state varchar(100)
,state_po varchar(2)
,county varchar(100)
,fips integer
,fullfips varchar(6)
,statefips varchar(3)
,countyfips varchar(3)
,office varchar(100)
,candidate varchar(100)
,party varchar(100)
,candidatevotes integer
,totalvotes integer
,percentage numeric(18,2)
)

/*RUN INSERT AFTER JUPYTER IMPORT*/

INSERT INTO edata (year,state,state_po,county,fips,fullfips,statefips,countyfips,office,candidate,party,candidatevotes,totalvotes,percentage)
SELECT
  e.year 
, e.state 
, e.state_po 
, e.county 
, e.fips 
, lpad(cast(e.fips as varchar),6,'0') 
, substring(lpad(cast(e.fips as varchar),6,'0') from 1 for 3) 
, substring(lpad(cast(e.fips as varchar),6,'0') from 4 for 6) 
, e.office 
, e.candidate 
, e.party 
, e.candidatevotes 
, e2.total 
,round((cast (e.candidatevotes as numeric) / cast(e2.total as numeric)*100),2) 
from elections e
JOIN (select sum(candidatevotes) total, year year2, state state2, county county2 from elections where party IN ('democrat','republican') group by year2, state2, county2) e2 ON e.year = e2.year2 and e.state = e2.state2 and e.county = e2.county2
WHERE e.party IN ('democrat','republican')


/*
select 
  e.year year
, e.state state
, e.state_po state_po
, e.county county
, e.fips fips
, lpad(cast(e.fips as varchar),6,'0') fullfips
, substring(lpad(cast(e.fips as varchar),6,'0') from 1 for 3) statefips
, substring(lpad(cast(e.fips as varchar),6,'0') from 4 for 6) countyfips
, e.office office
, e.candidate candidate
, e.party party
, e.candidatevotes candidatevotes
, e2.total totalvotes
,round((cast (e.candidatevotes as numeric) / cast(e2.total as numeric)*100),2) percentage
from elections e
JOIN (select sum(candidatevotes) total, year year2, state state2, county county2 from elections where party IN ('democrat','republican') group by year2, state2, county2) e2 ON e.year = e2.year2 and e.state = e2.state2 and e.county = e2.county2
WHERE e.party IN ('democrat','republican')
*/

