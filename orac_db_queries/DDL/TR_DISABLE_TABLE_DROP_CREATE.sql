CREATE OR REPLACE TRIGGER TR_DISABLE_TABLE_DROP
BEFORE DROP ON DATABASE
BEGIN
    DECLARE
        ex_dropdisabled EXCEPTION;
        PRAGMA EXCEPTION_INIT( ex_dropdisabled, -20001 );
    BEGIN
        raise_application_error( -20001, 'Table drop is disabled! Please disable the TR_DISABLE_TABLE_DROP trigger first to drop a table!' );
    END;
END;