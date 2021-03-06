import { Driver } from "../driver/Driver";
import { Repository } from "../repository/Repository";
import { EntitySubscriberInterface } from "../subscriber/EntitySubscriberInterface";
import { ObjectType } from "../common/ObjectType";
import { EntityManager } from "../entity-manager/EntityManager";
import { TreeRepository } from "../repository/TreeRepository";
import { NamingStrategyInterface } from "../naming-strategy/NamingStrategyInterface";
import { EntityMetadata } from "../metadata/EntityMetadata";
import { Logger } from "../logger/Logger";
import { MigrationInterface } from "../migration/MigrationInterface";
import { MongoRepository } from "../repository/MongoRepository";
import { MongoEntityManager } from "../entity-manager/MongoEntityManager";
import { ConnectionOptions } from "./ConnectionOptions";
import { QueryRunner } from "../query-runner/QueryRunner";
import { SelectQueryBuilder } from "../query-builder/SelectQueryBuilder";
import { QueryResultCache } from "../cache/QueryResultCache";
/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple connections to multiple databases in your application.
 */
export declare class Connection {
    /**
     * Connection name.
     */
    readonly name: string;
    /**
     * Connection options.
     */
    readonly options: ConnectionOptions;
    /**
     * Indicates if connection is initialized or not.
     */
    readonly isConnected: boolean;
    /**
     * Database driver used by this connection.
     */
    readonly driver: Driver;
    /**
     * EntityManager of this connection.
     */
    readonly manager: EntityManager;
    /**
     * Naming strategy used in the connection.
     */
    readonly namingStrategy: NamingStrategyInterface;
    /**
     * Logger used to log orm events.
     */
    readonly logger: Logger;
    /**
     * Migration instances that are registered for this connection.
     */
    readonly migrations: MigrationInterface[];
    /**
     * Entity subscriber instances that are registered for this connection.
     */
    readonly subscribers: EntitySubscriberInterface<any>[];
    /**
     * All entity metadatas that are registered for this connection.
     */
    readonly entityMetadatas: EntityMetadata[];
    /**
     * Used to work with query result cache.
     */
    readonly queryResultCache?: QueryResultCache;
    constructor(options: ConnectionOptions);
    /**
     * Gets the mongodb entity manager that allows to perform mongodb-specific repository operations
     * with any entity in this connection.
     *
     * Available only in mongodb connections.
     */
    readonly mongoManager: MongoEntityManager;
    /**
     * Performs connection to the database.
     * This method should be called once on application bootstrap.
     * This method not necessarily creates database connection (depend on database type),
     * but it also can setup a connection pool with database to use.
     */
    connect(): Promise<this>;
    /**
     * Closes connection with the database.
     * Once connection is closed, you cannot use repositories or perform any operations except opening connection again.
     */
    close(): Promise<void>;
    /**
     * Creates database schema for all entities registered in this connection.
     * Can be used only after connection to the database is established.
     *
     * @param dropBeforeSync If set to true then it drops the database with all its tables and data
     */
    synchronize(dropBeforeSync?: boolean): Promise<void>;
    /**
     * Drops the database and all its data.
     * Be careful with this method on production since this method will erase all your database tables and their data.
     * Can be used only after connection to the database is established.
     */
    dropDatabase(): Promise<void>;
    /**
     * Runs all pending migrations.
     * Can be used only after connection to the database is established.
     */
    runMigrations(): Promise<void>;
    /**
     * Reverts last executed migration.
     * Can be used only after connection to the database is established.
     */
    undoLastMigration(): Promise<void>;
    /**
     * Checks if entity metadata exist for the given entity class, target name or table name.
     */
    hasMetadata(target: Function | string): boolean;
    /**
     * Gets entity metadata for the given entity class or schema name.
     */
    getMetadata(target: Function | string): EntityMetadata;
    /**
     * Gets repository for the given entity.
     */
    getRepository<Entity>(target: ObjectType<Entity> | string): Repository<Entity>;
    /**
     * Gets tree repository for the given entity class or name.
     * Only tree-type entities can have a TreeRepository, like ones decorated with @ClosureEntity decorator.
     */
    getTreeRepository<Entity>(target: ObjectType<Entity> | string): TreeRepository<Entity>;
    /**
     * Gets mongodb-specific repository for the given entity class or name.
     * Works only if connection is mongodb-specific.
     */
    getMongoRepository<Entity>(target: ObjectType<Entity> | string): MongoRepository<Entity>;
    /**
     * Gets custom entity repository marked with @EntityRepository decorator.
     */
    getCustomRepository<T>(customRepository: ObjectType<T>): T;
    /**
     * Wraps given function execution (and all operations made there) into a transaction.
     * All database operations must be executed using provided entity manager.
     */
    transaction(runInTransaction: (entityManger: EntityManager) => Promise<any>): Promise<any>;
    /**
     * Executes raw SQL query and returns raw database results.
     */
    query(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<any>;
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    createQueryBuilder<Entity>(entityClass: ObjectType<Entity> | Function | string, alias: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity>;
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    createQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<any>;
    /**
     * Creates a query runner used for perform queries on a single database connection.
     * Using query runners you can control your queries to execute using single database connection and
     * manually control your database transaction.
     *
     * Mode is used in replication mode and indicates whatever you want to connect
     * to master database or any of slave databases.
     * If you perform writes you must use master database,
     * if you perform reads you can use slave databases.
     */
    createQueryRunner(mode?: "master" | "slave"): QueryRunner;
    /**
     * Gets entity metadata of the junction table (many-to-many table).
     */
    getManyToManyMetadata(entityTarget: Function | string, relationPropertyPath: string): EntityMetadata | undefined;
    /**
     * Finds exist entity metadata by the given entity class, target name or table name.
     */
    protected findMetadata(target: Function | string): EntityMetadata | undefined;
    /**
     * Builds metadatas for all registered classes inside this connection.
     */
    protected buildMetadatas(): void;
}
