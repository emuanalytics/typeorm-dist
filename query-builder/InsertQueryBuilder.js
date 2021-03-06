"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var QueryBuilder_1 = require("./QueryBuilder");
var SqlServerDriver_1 = require("../driver/sqlserver/SqlServerDriver");
var PostgresDriver_1 = require("../driver/postgres/PostgresDriver");
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
var InsertQueryBuilder = /** @class */ (function (_super) {
    __extends(InsertQueryBuilder, _super);
    function InsertQueryBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // -------------------------------------------------------------------------
    // Public Implemented Methods
    // -------------------------------------------------------------------------
    /**
     * Gets generated sql query without parameters being replaced.
     */
    InsertQueryBuilder.prototype.getQuery = function () {
        var sql = this.createInsertExpression();
        return sql.trim();
    };
    /**
     * Optional returning/output clause.
     */
    InsertQueryBuilder.prototype.output = function (output) {
        return this.returning(output);
    };
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Specifies INTO which entity's table insertion will be executed.
     */
    InsertQueryBuilder.prototype.into = function (entityTarget) {
        var mainAlias = this.createFromAlias(entityTarget);
        this.expressionMap.setMainAlias(mainAlias);
        return this;
    };
    /**
     * Values needs to be inserted into table.
     */
    InsertQueryBuilder.prototype.values = function (values) {
        this.expressionMap.valuesSet = values;
        return this;
    };
    /**
     * Optional returning/output clause.
     */
    InsertQueryBuilder.prototype.returning = function (returning) {
        if (this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver || this.connection.driver instanceof PostgresDriver_1.PostgresDriver) {
            this.expressionMap.returning = returning;
            return this;
        }
        else
            throw new Error("OUTPUT or RETURNING clause only supported by MS SQLServer or PostgreSQL");
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates INSERT express used to perform insert query.
     */
    InsertQueryBuilder.prototype.createInsertExpression = function () {
        var _this = this;
        var valueSets = this.getValueSets();
        // get columns that participate in insertion query
        var insertColumns = [];
        Object.keys(valueSets[0]).forEach(function (columnProperty) {
            var column = _this.expressionMap.mainAlias.metadata.findColumnWithPropertyName(columnProperty);
            if (column)
                insertColumns.push(column);
        });
        // get values needs to be inserted
        var values = valueSets.map(function (valueSet, key) {
            var columnNames = insertColumns.map(function (column) {
                var paramName = "_inserted_" + key + "_" + column.databaseName;
                var value = valueSet[column.propertyName];
                if (value instanceof Function) {
                    return value();
                }
                else {
                    if (_this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
                        _this.setParameter(paramName, _this.connection.driver.parametrizeValue(column, value));
                    }
                    else {
                        _this.setParameter(paramName, value);
                    }
                    return ":" + paramName;
                }
            });
            return "(" + columnNames.join(",") + ")";
        }).join(", ");
        // get a table name and all column database names
        var columnNames = insertColumns.map(function (column) { return _this.escape(column.databaseName); }).join(", ");
        // generate sql query
        if (this.expressionMap.returning !== "" && this.connection.driver instanceof PostgresDriver_1.PostgresDriver) {
            return "INSERT INTO " + this.getTableName(this.getMainTableName()) + "(" + columnNames + ") VALUES " + values + " RETURNING " + this.expressionMap.returning;
        }
        else if (this.expressionMap.returning !== "" && this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
            return "INSERT INTO " + this.getTableName(this.getMainTableName()) + "(" + columnNames + ") OUTPUT " + this.expressionMap.returning + " VALUES " + values;
        }
        else {
            return "INSERT INTO " + this.getTableName(this.getMainTableName()) + "(" + columnNames + ") VALUES " + values;
        }
    };
    /**
     * Gets array of values need to be inserted into the target table.
     */
    InsertQueryBuilder.prototype.getValueSets = function () {
        if (this.expressionMap.valuesSet instanceof Array && this.expressionMap.valuesSet.length > 0)
            return this.expressionMap.valuesSet;
        if (this.expressionMap.valuesSet instanceof Object)
            return [this.expressionMap.valuesSet];
        throw new Error("Cannot perform insert query because values are not defined. Call \"qb.values(...)\" method to specify inserted values.");
    };
    return InsertQueryBuilder;
}(QueryBuilder_1.QueryBuilder));
exports.InsertQueryBuilder = InsertQueryBuilder;

//# sourceMappingURL=InsertQueryBuilder.js.map
