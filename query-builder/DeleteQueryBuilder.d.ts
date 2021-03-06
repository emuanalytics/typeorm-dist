import { QueryBuilder } from "./QueryBuilder";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { ObjectType } from "../common/ObjectType";
import { Connection } from "../connection/Connection";
import { QueryRunner } from "../query-runner/QueryRunner";
import { WhereExpression } from "./WhereExpression";
import { Brackets } from "./Brackets";
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
export declare class DeleteQueryBuilder<Entity> extends QueryBuilder<Entity> implements WhereExpression {
    constructor(connectionOrQueryBuilder: Connection | QueryBuilder<any>, queryRunner?: QueryRunner);
    /**
     * Gets generated sql query without parameters being replaced.
     */
    getQuery(): string;
    /**
     * Specifies FROM which entity's table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    from<T>(entityTarget: ObjectType<T> | string, aliasName?: string): DeleteQueryBuilder<T>;
    /**
     * Sets WHERE condition in the query builder.
     * If you had previously WHERE expression defined,
     * calling this function will override previously set WHERE conditions.
     * Additionally you can add parameters used in where expression.
     */
    where(where: Brackets | string | ((qb: this) => string), parameters?: ObjectLiteral): this;
    /**
     * Adds new AND WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andWhere(where: Brackets | string | ((qb: this) => string), parameters?: ObjectLiteral): this;
    /**
     * Adds new OR WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orWhere(where: Brackets | string | ((qb: this) => string), parameters?: ObjectLiteral): this;
    /**
     * Adds new AND WHERE with conditions for the given ids.
     */
    whereInIds(ids: any[]): this;
    /**
     * Adds new AND WHERE with conditions for the given ids.
     */
    andWhereInIds(ids: any[]): this;
    /**
     * Adds new OR WHERE with conditions for the given ids.
     */
    orWhereInIds(ids: any[]): this;
    /**
     * Optional returning/output clause.
     */
    returning(returning: string): this;
    /**
     * Optional returning/output clause.
     */
    output(output: string): this;
    /**
     * Creates DELETE express used to perform query.
     */
    protected createDeleteExpression(): string;
}
