import { QueryRunner } from "../../query-runner/QueryRunner";
import { ObjectLiteral } from "../../common/ObjectLiteral";
import { TableColumn } from "../../schema-builder/schema/TableColumn";
import { Table } from "../../schema-builder/schema/Table";
import { TableForeignKey } from "../../schema-builder/schema/TableForeignKey";
import { TableIndex } from "../../schema-builder/schema/TableIndex";
import { SqlServerDriver } from "./SqlServerDriver";
import { Connection } from "../../connection/Connection";
import { ReadStream } from "../../platform/PlatformTools";
import { MssqlParameter } from "./MssqlParameter";
import { EntityManager } from "../../entity-manager/EntityManager";
/**
 * Runs queries on a single mysql database connection.
 */
export declare class SqlServerQueryRunner implements QueryRunner {
    /**
     * Database driver used by connection.
     */
    driver: SqlServerDriver;
    /**
     * Connection used by this query runner.
     */
    connection: Connection;
    /**
     * Isolated entity manager working only with current query runner.
     */
    manager: EntityManager;
    /**
     * Indicates if connection for this query runner is released.
     * Once its released, query runner cannot run queries anymore.
     */
    isReleased: boolean;
    /**
     * Indicates if transaction is in progress.
     */
    isTransactionActive: boolean;
    /**
     * Stores temporarily user data.
     * Useful for sharing data with subscribers.
     */
    data: {};
    /**
     * Real database connection from a connection pool used to perform queries.
     */
    protected databaseConnection: any;
    /**
     * Last executed query in a transaction.
     * This is needed because in transaction mode mssql cannot execute parallel queries,
     * that's why we store last executed query promise to wait it when we execute next query.
     *
     * @see https://github.com/patriksimek/node-mssql/issues/491
     */
    protected queryResponsibilityChain: Promise<any>[];
    /**
     * Indicates if special query runner mode in which sql queries won't be executed is enabled.
     */
    protected sqlMemoryMode: boolean;
    /**
     * Sql-s stored if "sql in memory" mode is enabled.
     */
    protected sqlsInMemory: string[];
    /**
     * Mode in which query runner executes.
     * Used for replication.
     * If replication is not setup its value is ignored.
     */
    protected mode: "master" | "slave";
    constructor(driver: SqlServerDriver, mode?: "master" | "slave");
    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    connect(): Promise<any>;
    /**
     * Releases used database connection.
     * You cannot use query runner methods once its released.
     */
    release(): Promise<void>;
    /**
     * Starts transaction.
     */
    startTransaction(): Promise<void>;
    /**
     * Commits transaction.
     * Error will be thrown if transaction was not started.
     */
    commitTransaction(): Promise<void>;
    /**
     * Rollbacks transaction.
     * Error will be thrown if transaction was not started.
     */
    rollbackTransaction(): Promise<void>;
    protected mssqlParameterToNativeParameter(parameter: MssqlParameter): any;
    /**
     * Executes a given SQL query.
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Returns raw data stream.
     */
    stream(query: string, parameters?: any[], onEnd?: Function, onError?: Function): Promise<ReadStream>;
    /**
     * Insert a new row with given values into the given table.
     * Returns value of the generated column if given and generate column exist in the table.
     */
    insert(tablePath: string, keyValues: ObjectLiteral): Promise<any>;
    /**
     * Updates rows that match given conditions in the given table.
     */
    update(tablePath: string, valuesMap: ObjectLiteral, conditions: ObjectLiteral): Promise<void>;
    /**
     * Deletes from the given table by a given conditions.
     */
    delete(tablePath: string, conditions: ObjectLiteral | string, maybeParameters?: any[]): Promise<void>;
    /**
     * Inserts rows into the closure table.
     */
    insertIntoClosureTable(tablePath: string, newEntityId: any, parentId: any, hasLevel: boolean): Promise<number>;
    /**
     * Loads given table's data from the database.
     */
    getTable(tablePath: string): Promise<Table | undefined>;
    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     */
    getTables(tablePaths: string[]): Promise<Table[]>;
    /**
     * Checks if database with the given name exist.
     */
    hasDatabase(database: string): Promise<boolean>;
    /**
     * Checks if table with the given name exist in the database.
     */
    hasTable(tablePath: string): Promise<boolean>;
    /**
     * Creates a database if it's not created.
     */
    createDatabase(database: string): Promise<void[]>;
    /**
     * Creates a schema if it's not created.
     */
    createSchema(schemaPaths: string[]): Promise<void[]>;
    /**
     * Creates a new table from the given table metadata and column metadatas.
     */
    createTable(table: Table): Promise<void>;
    /**
     * Drops the table.
     */
    dropTable(tablePath: string): Promise<void>;
    /**
     * Checks if column with the given name exist in the given table.
     */
    hasColumn(tablePath: string, columnName: string): Promise<boolean>;
    /**
     * Creates a new column from the column in the table.
     */
    addColumn(tableOrPath: Table | string, column: TableColumn): Promise<void>;
    /**
     * Creates a new columns from the column in the table.
     */
    addColumns(tableOrName: Table | string, columns: TableColumn[]): Promise<void>;
    /**
     * Renames column in the given table.
     */
    renameColumn(tableOrName: Table | string, oldTableColumnOrName: TableColumn | string, newTableColumnOrName: TableColumn | string): Promise<void>;
    /**
     * Changes a column in the table.
     */
    changeColumn(tableOrName: Table | string, oldTableColumnOrName: TableColumn | string, newColumn: TableColumn): Promise<void>;
    /**
     * Changes a column in the table.
     */
    changeColumns(table: Table, changedColumns: {
        newColumn: TableColumn;
        oldColumn: TableColumn;
    }[]): Promise<void>;
    /**
     * Drops column in the table.
     */
    dropColumn(table: Table, column: TableColumn): Promise<void>;
    /**
     * Drops the columns in the table.
     */
    dropColumns(table: Table, columns: TableColumn[]): Promise<void>;
    /**
     * Updates table's primary keys.
     */
    updatePrimaryKeys(table: Table): Promise<void>;
    /**
     * Creates a new foreign key.
     */
    createForeignKey(tableOrPath: Table | string, foreignKey: TableForeignKey): Promise<void>;
    /**
     * Creates a new foreign keys.
     */
    createForeignKeys(tableOrName: Table | string, foreignKeys: TableForeignKey[]): Promise<void>;
    /**
     * Drops a foreign key from the table.
     */
    dropForeignKey(tableOrPath: Table | string, foreignKey: TableForeignKey): Promise<void>;
    /**
     * Drops a foreign keys from the table.
     */
    dropForeignKeys(tableOrName: Table | string, foreignKeys: TableForeignKey[]): Promise<void>;
    /**
     * Creates a new index.
     */
    createIndex(tablePath: string, index: TableIndex): Promise<void>;
    /**
     * Drops an index from the table.
     */
    dropIndex(tableSchemeOrName: Table | string, indexName: string): Promise<void>;
    /**
     * Truncates table.
     */
    truncate(tablePath: string): Promise<void>;
    /**
     * Removes all tables from the currently connected database.
     */
    clearDatabase(schemas?: string[], database?: string): Promise<void>;
    /**
     * Enables special query runner mode in which sql queries won't be executed,
     * instead they will be memorized into a special variable inside query runner.
     * You can get memorized sql using getMemorySql() method.
     */
    enableSqlMemory(): void;
    /**
     * Disables special query runner mode in which sql queries won't be executed
     * started by calling enableSqlMemory() method.
     *
     * Previously memorized sql will be flushed.
     */
    disableSqlMemory(): void;
    /**
     * Gets sql stored in the memory. Parameters in the sql are already replaced.
     */
    getMemorySql(): (string | {
        up: string;
        down: string;
    })[];
    /**
     * Escapes given table path.
     */
    protected escapeTablePath(tableOrPath: Table | string, disableEscape?: boolean): string;
    protected parseTablePath(tablePath: string): any;
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     */
    protected parametrize(objectLiteral: ObjectLiteral, startFrom?: number): string[];
    /**
     * Builds a query for create column.
     */
    protected buildCreateColumnSql(tableName: string, column: TableColumn, skipIdentity: boolean, createDefault: boolean): string;
}
