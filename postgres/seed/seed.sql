BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) VALUES (
    'jessie',
    'jessie@o2.pl',
    5,
    '2018-01-01'
);

INSERT INTO login (hash, email) VALUES (
    '$2b$10$XTbhucxkQEOM5rBF5ZJP2e1H7Gs61W37olby3pImRMTpXOzcC4p4i',
    'jessie@o2.pl'
);

COMMIT;