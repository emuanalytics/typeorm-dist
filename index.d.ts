import { ConnectionManager } from "./connection/ConnectionManager";
import { Connection } from "./connection/Connection";
import { MetadataArgsStorage } from "./metadata-args/MetadataArgsStorage";
import { ConnectionOptions } from "./connection/ConnectionOptions";
import { ObjectType } from "./common/ObjectType";
import { Repository } from "./repository/Repository";
import { EntityManager } from "./entity-manager/EntityManager";
import { TreeRepository } from "./repository/TreeRepository";
import { MongoRepository } from "./repository/MongoRepository";
import { MongoEntityManager } from "./entity-manager/MongoEntityManager";
export * from "./container";
export * from "./common/ObjectType";
export * from "./common/ObjectLiteral";
export * from "./error/QueryFailedError";
export * from "./decorator/columns/Column";
export * from "./decorator/columns/CreateDateColumn";
export * from "./decorator/columns/DiscriminatorColumn";
export * from "./decorator/columns/PrimaryGeneratedColumn";
export * from "./decorator/columns/PrimaryColumn";
export * from "./decorator/columns/UpdateDateColumn";
export * from "./decorator/columns/VersionColumn";
export * from "./decorator/columns/ObjectIdColumn";
export * from "./decorator/listeners/AfterInsert";
export * from "./decorator/listeners/AfterLoad";
export * from "./decorator/listeners/AfterRemove";
export * from "./decorator/listeners/AfterUpdate";
export * from "./decorator/listeners/BeforeInsert";
export * from "./decorator/listeners/BeforeRemove";
export * from "./decorator/listeners/BeforeUpdate";
export * from "./decorator/listeners/EventSubscriber";
export * from "./decorator/options/ColumnOptions";
export * from "./decorator/options/IndexOptions";
export * from "./decorator/options/JoinColumnOptions";
export * from "./decorator/options/JoinTableOptions";
export * from "./decorator/options/RelationOptions";
export * from "./decorator/options/EntityOptions";
export * from "./decorator/relations/RelationCount";
export * from "./decorator/relations/JoinColumn";
export * from "./decorator/relations/JoinTable";
export * from "./decorator/relations/ManyToMany";
export * from "./decorator/relations/ManyToOne";
export * from "./decorator/relations/OneToMany";
export * from "./decorator/relations/OneToOne";
export * from "./decorator/relations/RelationCount";
export * from "./decorator/relations/RelationId";
export * from "./decorator/entity/Entity";
export * from "./decorator/entity/ClassEntityChild";
export * from "./decorator/entity/ClosureEntity";
export * from "./decorator/entity/SingleEntityChild";
export * from "./decorator/entity/TableInheritance";
export * from "./decorator/transaction/Transaction";
export * from "./decorator/transaction/TransactionManager";
export * from "./decorator/tree/TreeLevelColumn";
export * from "./decorator/tree/TreeParent";
export * from "./decorator/tree/TreeChildren";
export * from "./decorator/Index";
export * from "./decorator/Generated";
export * from "./decorator/DiscriminatorValue";
export * from "./decorator/EntityRepository";
export * from "./find-options/FindOneOptions";
export * from "./find-options/FindManyOptions";
export * from "./logger/Logger";
export * from "./logger/AdvancedConsoleLogger";
export * from "./logger/SimpleConsoleLogger";
export * from "./logger/FileLogger";
export * from "./entity-manager/EntityManager";
export * from "./repository/AbstractRepository";
export * from "./repository/Repository";
export * from "./repository/BaseEntity";
export * from "./repository/TreeRepository";
export * from "./repository/MongoRepository";
export * from "./repository/RemoveOptions";
export * from "./repository/SaveOptions";
export * from "./schema-builder/schema/TableColumn";
export * from "./schema-builder/schema/TableForeignKey";
export * from "./schema-builder/schema/TableIndex";
export * from "./schema-builder/schema/TablePrimaryKey";
export * from "./schema-builder/schema/Table";
export * from "./driver/mongodb/typings";
export * from "./driver/sqlserver/MssqlParameter";
export { ConnectionOptionsReader } from "./connection/ConnectionOptionsReader";
export { Connection } from "./connection/Connection";
export { ConnectionManager } from "./connection/ConnectionManager";
export { ConnectionOptions } from "./connection/ConnectionOptions";
export { Driver } from "./driver/Driver";
export { QueryBuilder } from "./query-builder/QueryBuilder";
export { SelectQueryBuilder } from "./query-builder/SelectQueryBuilder";
export { DeleteQueryBuilder } from "./query-builder/DeleteQueryBuilder";
export { InsertQueryBuilder } from "./query-builder/InsertQueryBuilder";
export { UpdateQueryBuilder } from "./query-builder/UpdateQueryBuilder";
export { RelationQueryBuilder } from "./query-builder/RelationQueryBuilder";
export { Brackets } from "./query-builder/Brackets";
export { WhereExpression } from "./query-builder/WhereExpression";
export { QueryRunner } from "./query-runner/QueryRunner";
export { EntityManager } from "./entity-manager/EntityManager";
export { MongoEntityManager } from "./entity-manager/MongoEntityManager";
export { MigrationInterface } from "./migration/MigrationInterface";
export { DefaultNamingStrategy } from "./naming-strategy/DefaultNamingStrategy";
export { NamingStrategyInterface } from "./naming-strategy/NamingStrategyInterface";
export { Repository } from "./repository/Repository";
export { TreeRepository } from "./repository/TreeRepository";
export { MongoRepository } from "./repository/MongoRepository";
export { FindOneOptions } from "./find-options/FindOneOptions";
export { FindManyOptions } from "./find-options/FindManyOptions";
export { InsertEvent } from "./subscriber/event/InsertEvent";
export { UpdateEvent } from "./subscriber/event/UpdateEvent";
export { RemoveEvent } from "./subscriber/event/RemoveEvent";
export { EntitySubscriberInterface } from "./subscriber/EntitySubscriberInterface";
export { BaseEntity } from "./repository/BaseEntity";
export { EntitySchema } from "./entity-schema/EntitySchema";
export { EntitySchemaTable } from "./entity-schema/EntitySchemaTable";
export { EntitySchemaColumn } from "./entity-schema/EntitySchemaColumn";
export { EntitySchemaIndex } from "./entity-schema/EntitySchemaIndex";
export { EntitySchemaRelation } from "./entity-schema/EntitySchemaRelation";
export { ColumnType } from "./driver/types/ColumnTypes";
/**
 * Gets metadata args storage.
 */
export declare function getMetadataArgsStorage(): MetadataArgsStorage;
/**
 * Reads connection options stored in ormconfig configuration file.
 */
export declare function getConnectionOptions(connectionName?: string): Promise<ConnectionOptions>;
/**
 * Gets a ConnectionManager which creates connections.
 */
export declare function getConnectionManager(): ConnectionManager;
/**
 * Creates a new connection and registers it in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export declare function createConnection(options?: ConnectionOptions): Promise<Connection>;
/**
 * Creates new connections and registers them in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * All connections from the ormconfig will be created.
 */
export declare function createConnections(options?: ConnectionOptions[]): Promise<Connection[]>;
/**
 * Gets connection from the connection manager.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export declare function getConnection(connectionName?: string): Connection;
/**
 * Gets entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export declare function getManager(connectionName?: string): EntityManager;
/**
 * Gets MongoDB entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export declare function getMongoManager(connectionName?: string): MongoEntityManager;
/**
 * Gets repository for the given entity class.
 */
export declare function getRepository<Entity>(entityClass: ObjectType<Entity> | string, connectionName?: string): Repository<Entity>;
/**
 * Gets tree repository for the given entity class.
 */
export declare function getTreeRepository<Entity>(entityClass: ObjectType<Entity> | string, connectionName?: string): TreeRepository<Entity>;
/**
 * Gets tree repository for the given entity class.
 */
export declare function getCustomRepository<T>(customRepository: ObjectType<T>, connectionName?: string): T;
/**
 * Gets mongodb repository for the given entity class or name.
 */
export declare function getMongoRepository<Entity>(entityClass: ObjectType<Entity> | string, connectionName?: string): MongoRepository<Entity>;
