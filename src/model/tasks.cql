CREATE KEYSPACE crud_example WITH REPLICATION =
{ 'class' : 'SimpleStrategy', 'replication_factor' : 1 };

CREATE TABLE crud_example.tasks (
	id uuid PRIMARY KEY,
  description text,
  status boolean,
  title text
);
